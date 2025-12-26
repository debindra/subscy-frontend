import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from '../supabase';
import { logger } from '../utils/logger';

// Extend axios config to include retry flag
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// In-memory storage for CSRF token (since HTTP-only cookies can't be read by JS)
let csrfTokenCache: string | null = null;

// Token refresh state - singleton to handle all requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Cached access token - updated immediately after login/refresh
// This prevents race conditions where getSession() returns stale data
let cachedAccessToken: string | null = null;
let cachedTokenExpiry: number = 0;

// Fresh login state - blocks requests until new token is propagated
// This is only set to true during fresh login, not on page refresh
let pendingFreshLogin = false;
let freshLoginResolve: (() => void) | null = null;
let freshLoginPromise: Promise<void> | null = null;

// Export function to set token from useAuth after login
export function setAuthToken(token: string | null, expiresAt?: number): void {
  cachedAccessToken = token;
  cachedTokenExpiry = expiresAt || 0;
}

// Signal that a fresh login is starting - blocks API requests until ready
export function startFreshLogin(): void {
  pendingFreshLogin = true;
  freshLoginPromise = new Promise<void>((resolve) => {
    freshLoginResolve = resolve;
  });
}

// Signal that fresh login is complete and token is ready
export function markSessionReady(): void {
  pendingFreshLogin = false;
  if (freshLoginResolve) {
    freshLoginResolve();
    freshLoginResolve = null;
    freshLoginPromise = null;
  }
}

// Check if a fresh login is pending (for external use)
export function isFreshLoginPending(): boolean {
  return pendingFreshLogin;
}

// Clear session state (on logout)
export function clearSession(): void {
  cachedAccessToken = null;
  cachedTokenExpiry = 0;
  pendingFreshLogin = false;
}

// Wait for fresh login to complete (if pending)
async function waitForFreshLogin(): Promise<void> {
  if (!pendingFreshLogin) return;
  
  if (!freshLoginPromise) {
    // No promise means we're not actually waiting
    return;
  }
  
  // Wait max 5 seconds for fresh login to complete
  const timeout = new Promise<void>((resolve) => {
    setTimeout(() => {
      logger.warn('Fresh login wait timeout, proceeding with request');
      resolve();
    }, 5000);
  });
  
  await Promise.race([freshLoginPromise, timeout]);
}

// Get cached token if still valid
function getCachedToken(): string | null {
  if (cachedAccessToken && cachedTokenExpiry > Date.now()) {
    return cachedAccessToken;
  }
  return null;
}

// Helper to subscribe to token refresh
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

// Helper to notify all subscribers when token is refreshed
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// Helper function to get CSRF token from cache or cookies
function getCsrfToken(): string | null {
  // First try the cache
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  // Fallback: try to read from cookies (won't work for HTTP-only, but useful for fallback)
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token') {
        const token = decodeURIComponent(value);
        csrfTokenCache = token;
        return token;
      }
    }
  }
  return null;
}

// Function to set CSRF token in cache
function setCsrfToken(token: string | null): void {
  csrfTokenCache = token;
}

// Check if JWT token is expired or about to expire (within 30 seconds)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const buffer = 30 * 1000; // 30 second buffer
    return now >= exp - buffer;
  } catch {
    return true; // If we can't parse, assume expired
  }
}

// Refresh the token and return the new access token
async function refreshToken(): Promise<string | null> {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error || !session?.access_token) {
    logger.error('Token refresh failed', error);
    return null;
  }
  return session.access_token;
}

// Add auth token, CSRF token, and account context to requests
apiClient.interceptors.request.use(async (config) => {
  // Skip auth for CSRF token endpoint and public endpoints
  const isPublicEndpoint = config.url?.includes('/auth/csrf-token');
  
  // Skip session lookup if this is a retry request with an already-set Authorization header
  // This prevents overwriting the fresh token we set during 401 retry
  if (config._retry && config.headers.Authorization) {
    // Add CSRF token for state-changing requests on retry
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  }

  // Wait for fresh login to complete before making authenticated requests
  // This prevents 401 errors when navigating to dashboard immediately after login
  if (!isPublicEndpoint && pendingFreshLogin) {
    await waitForFreshLogin();
  }

  // First, try to use cached token (set immediately after login)
  // This avoids race conditions with getSession()
  const cached = getCachedToken();
  if (cached && !isTokenExpired(cached)) {
    config.headers.Authorization = `Bearer ${cached}`;
    // Add CSRF token for state-changing requests
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  }

  // Get current session from Supabase
  let { data: { session } } = await supabase.auth.getSession();
  
  // If no session, wait briefly for it to be established (handles post-login race condition)
  if (!session?.access_token) {
    // Wait up to 2 seconds for session
    const maxWait = 2000;
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { data: { session: newSession } } = await supabase.auth.getSession();
      if (newSession?.access_token) {
        session = newSession;
        break;
      }
    }
  }

  if (session?.access_token) {
    // Update cached token
    try {
      const payload = JSON.parse(atob(session.access_token.split('.')[1]));
      setAuthToken(session.access_token, payload.exp * 1000);
    } catch {
      // If we can't parse the token, still use it but don't cache
    }

    // Check if token is expired or about to expire
    if (isTokenExpired(session.access_token)) {
      // If already refreshing, wait for the refresh to complete
      if (isRefreshing) {
        const newToken = await new Promise<string>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            resolve(token);
          });
        });
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        // Start refresh process
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            // Update cached token
            try {
              const payload = JSON.parse(atob(newToken.split('.')[1]));
              setAuthToken(newToken, payload.exp * 1000);
            } catch {
              // Ignore parsing errors
            }
            onTokenRefreshed(newToken);
          } else {
            // Refresh failed, use old token and let 401 handler deal with it
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
        } finally {
          isRefreshing = false;
        }
      }
    } else {
      // Token is still valid, use it
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } else {
    // If this is not a public endpoint and we don't have a session, log and continue
    // The backend will return 401 if auth is required
    if (!isPublicEndpoint) {
      logger.warn('No session found in request interceptor', { 
        url: config.url,
        method: config.method 
      });
      // Don't block the request - let the backend return 401
      // The response interceptor will handle 401 errors
    }
  }

  // Add CSRF token for state-changing requests
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return config;
});

// Handle token refresh on 401 and CSRF errors
apiClient.interceptors.response.use(
  (response) => {
    // If we get a CSRF token in the response (from /auth/csrf-token endpoint), cache it
    if (response.data?.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    
    // If this is a successful authenticated GET request and we don't have a CSRF token cached,
    // proactively fetch one to avoid 403 on the next state-changing request
    if (
      response.config.method?.toLowerCase() === 'get' &&
      !getCsrfToken() &&
      !response.config.url?.includes('/auth/csrf-token') && // Don't fetch if this IS the csrf-token request
      !response.config.url?.includes('/auth/') // Don't fetch for auth endpoints
    ) {
      // Check if user is authenticated before fetching CSRF token
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.access_token) {
          // Fetch CSRF token in the background (don't await, let it happen async)
          apiClient.get('/auth/csrf-token').catch(() => {
            // Silently fail - we'll retry on the next PATCH/POST/DELETE
          });
        }
      });
    }
    
    return response;
  },
  async (error) => {
    const { response, config } = error;
    
    // Skip retry if already retried
    if (config?._retry) {
      return Promise.reject(error);
    }

    // Handle CSRF token errors (403)
    if (response?.status === 403 && (
      response.data?.detail?.includes('CSRF') || 
      response.data?.detail?.includes('csrf') ||
      response.data?.detail?.includes('Invalid or missing CSRF token')
    )) {
      logger.warn('CSRF token error, attempting to refresh token...');

      try {
        // Clear the cached token
        setCsrfToken(null);
        
        // Try to fetch a new CSRF token (this will also set it in HTTP-only cookie)
        const csrfResponse = await apiClient.get('/auth/csrf-token');
        const newToken = csrfResponse.data?.csrfToken;
        
        if (newToken) {
          // Cache the new token
          setCsrfToken(newToken);
          
          // Create a new config for retry with updated CSRF token
          const retryConfig = {
            ...config,
            _retry: true,
            headers: {
              ...config.headers,
              'X-CSRF-Token': newToken,
            },
          };
          
          // Retry the original request with new token
          return apiClient.request(retryConfig);
        }
      } catch (csrfError: any) {
        logger.error('Failed to refresh CSRF token', csrfError);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }

    // Handle authentication errors (401)
    if (response?.status === 401) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token: string) => {
            config._retry = true;
            config.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient.request(config));
          });
        });
      }

      // Start refresh process
      isRefreshing = true;
      
      try {
        const newToken = await refreshToken();
        
        if (newToken) {
          // Notify all queued requests
          onTokenRefreshed(newToken);
          
          // Retry the original request
          config._retry = true;
          config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(config);
        } else {
          // Refresh failed - check if we should redirect to login
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const publicRoutes = [
              '/',
              '/auth/login',
              '/auth/signup',
              '/auth/callback',
              '/auth/update-password',
              '/privacy',
              '/terms',
            ];
            
            const isPublicRoute = publicRoutes.some(route => 
              currentPath === route || currentPath.startsWith(route + '/')
            );
            
            // Only redirect if we're NOT on a public route
            if (!isPublicRoute) {
              logger.warn('Session refresh failed, redirecting to login');
              window.location.href = '/auth/login';
            }
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        logger.error('Token refresh error', refreshError);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

