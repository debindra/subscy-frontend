/**
 * CSRF Token Utilities
 * Handles CSRF token management for API requests
 */

import { apiClient } from '@/lib/api/client';

/**
 * Fetch CSRF token from backend
 * This should be called after user authentication
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await apiClient.get('/auth/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
}

/**
 * Check if CSRF token exists in cookies
 */
export function hasCsrfToken(): boolean {
  if (typeof document === 'undefined') return false;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return true;
    }
  }
  return false;
}

/**
 * Get CSRF token from cookies
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Initialize CSRF protection
 * Call this after user logs in or when app starts
 */
export async function initializeCsrfProtection(): Promise<boolean> {
  // Check if we already have a CSRF token
  if (hasCsrfToken()) {
    return true;
  }

  // Fetch new CSRF token
  const token = await fetchCsrfToken();
  return token !== null;
}

/**
 * Clear CSRF token (on logout)
 */
export function clearCsrfToken(): void {
  if (typeof document === 'undefined') return;

  // Clear the cookie by setting expiration in the past
  document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}