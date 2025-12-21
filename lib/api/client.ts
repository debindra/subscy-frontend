import axios from 'axios';
import { supabase } from '../supabase';
import { logger } from '../utils/logger';

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

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: ReturnType<typeof supabase.auth.refreshSession> | null = null;

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

// Track if we're waiting for initial session after login
let waitingForInitialSession = false;
let sessionWaitPromise: Promise<void> | null = null;

// Helper to wait for session to be ready
async function waitForSession(maxWait = 2000): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  return false;
}

// Add auth token, CSRF token, and account context to requests
apiClient.interceptors.request.use(async (config) => {
  // Get session once at the start
  let { data: { session } } = await supabase.auth.getSession();
  
  // Only wait for session if we don't have one and waitForSession isn't already running
  if (!session?.access_token && !sessionWaitPromise) {
    waitingForInitialSession = true;
    
    sessionWaitPromise = waitForSession().then((success) => {
      waitingForInitialSession = false;
      sessionWaitPromise = null;
    });
    await sessionWaitPromise;
    
    // Get session again after waiting (waitForSession returns success, not session)
    const { data: { session: waitedSession } } = await supabase.auth.getSession();
    session = waitedSession;
  } else if (sessionWaitPromise) {
    // If wait is already in progress, just wait for it
    await sessionWaitPromise;
    const { data: { session: waitedSession } } = await supabase.auth.getSession();
    session = waitedSession;
  }

  if (session?.access_token) {
    // Just use the current session token - let Supabase handle automatic refresh
    // Only refresh on 401 errors in the response interceptor
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    logger.warn('No session found in request interceptor', { 
      url: config.url,
      method: config.method 
    });
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
    const { response } = error;

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
            ...error.config,
            headers: {
              ...error.config.headers,
              'X-CSRF-Token': newToken,
            },
          };
          
          // Retry the original request with new token
          return apiClient.request(retryConfig);
        }
      } catch (csrfError: any) {
        logger.error('Failed to refresh CSRF token', csrfError);
        // If we can't refresh, show error to user
        if (typeof window !== 'undefined') {
          alert('Security session expired. Please refresh the page.');
        }
        return Promise.reject(error);
      }

      // If we can't refresh, show error to user
      if (typeof window !== 'undefined') {
        alert('Security session expired. Please refresh the page.');
      }
      return Promise.reject(error);
    }

    // Handle authentication errors (401)
    if (response?.status === 401) {
      // Get session once
      const { data: { session: checkSession } } = await supabase.auth.getSession();

      if (checkSession?.user && !error.config._retry && !checkSession?.access_token) {
        // Session exists but no token - wait once and retry
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.access_token) {
          error.config._retry = true;
          error.config.headers.Authorization = `Bearer ${currentSession.access_token}`;
          return apiClient.request(error.config);
        }
      }
      
      // Use shared refresh promise to avoid multiple simultaneous refresh attempts
      if (!isRefreshing || !refreshPromise) {
        isRefreshing = true;
        refreshPromise = supabase.auth.refreshSession().finally(() => {
          // Reset flag after promise completes (success or failure)
          isRefreshing = false;
          // Clear the promise only after refresh is complete
          refreshPromise = null;
        });
      }
      
      // Wait for refresh (either new or existing)
      if (!refreshPromise) {
        // Fallback - shouldn't happen but TypeScript needs it
        return Promise.reject(error);
      }
      
      const refreshResult = await refreshPromise;
      // DON'T clear refreshPromise here - let the finally block handle it

      const { data: { session }, error: refreshError } = refreshResult;

      if (refreshError || !session) {
        // Give it one more chance - check if session exists after a brief delay
        // This handles race conditions where Supabase is still refreshing
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        
        if (finalSession?.access_token) {
          // Session recovered - retry with new token
          error.config.headers.Authorization = `Bearer ${finalSession.access_token}`;
          return apiClient.request(error.config);
        }

        // Only redirect to login if we're on a protected route
        // Public routes should not redirect (e.g., landing page, auth pages)
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
            logger.warn('Session refresh failed, redirecting to login', refreshError ? { error: refreshError } : undefined);
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }

      // Retry the request with new token
      error.config.headers.Authorization = `Bearer ${session.access_token}`;
      return apiClient.request(error.config);
    }

    return Promise.reject(error);
  }
);

