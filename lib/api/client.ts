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

// Add auth token, CSRF token, and account context to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  // Add CSRF token for state-changing requests
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // Add account context header if available
  if (typeof window !== 'undefined') {
    const accountContext = localStorage.getItem('activeAccountContext');
    if (accountContext && (accountContext === 'personal' || accountContext === 'business')) {
      config.headers['X-Account-Context'] = accountContext;
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
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !session) {
        // Redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      // Retry the request with new token
      error.config.headers.Authorization = `Bearer ${session.access_token}`;
      return apiClient.request(error.config);
    }

    return Promise.reject(error);
  }
);

