'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/lib/queryClient';
import { useToast } from '@/lib/context/ToastContext';

interface QueryProviderProps {
  children: ReactNode;
}

// Component to handle query errors globally
function QueryErrorHandler() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Track recent errors to prevent duplicate toasts
    const recentErrors = new Map<string, number>();
    
    // Subscribe to query cache changes to detect errors
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      // Check for errors on query state updates (when event type is 'updated' or query has error state)
      if (event?.query && event.query.state?.error) {
        const error = event.query.state.error as any;
        const queryKey = JSON.stringify(event.query.queryKey);
        const status = error?.response?.status || 'network';
        const errorKey = `${queryKey}-${status}`;
        
        // Skip if we've already handled this error recently (within 3 seconds)
        const lastErrorTime = recentErrors.get(errorKey);
        const now = Date.now();
        if (lastErrorTime && now - lastErrorTime < 3000) {
          return;
        }
        
        // Record this error
        recentErrors.set(errorKey, now);
        
        // Clean up old error entries (keep only last 50)
        if (recentErrors.size > 50) {
          const entries = Array.from(recentErrors.entries());
          const sorted = entries.sort((a, b) => b[1] - a[1]);
          recentErrors.clear();
          sorted.slice(0, 50).forEach(([key, time]) => recentErrors.set(key, time));
        }
        
        // Don't show toast for 401 errors (handled by auth interceptor)
        if (error?.response?.status === 401) {
          return;
        }

        // Don't show toast for 403 errors (plan limitations - handled in components)
        if (error?.response?.status === 403) {
          return;
        }

        // Extract error message
        const errorMessage = 
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          'An error occurred while loading data. Please try again.';

        // Show toast for network errors, timeouts, and server errors (5xx)
        const statusCode = error?.response?.status;
        const isNetworkError = error?.code === 'ERR_NETWORK' || 
                             error?.code === 'ECONNABORTED' || 
                             error?.message?.includes('Network Error') ||
                             error?.message?.includes('timeout');
        
        if (isNetworkError || (statusCode && statusCode >= 500)) {
          const displayMessage = isNetworkError 
            ? 'Network error: Unable to connect to the server. Please check your connection and try again.'
            : errorMessage;
          showToast(displayMessage, 'error');
        } else if (statusCode && statusCode >= 400 && statusCode < 500) {
          // For 4xx errors (except 401, 403), show a user-friendly message
          const displayMessage = statusCode === 404
            ? 'The requested resource was not found.'
            : errorMessage;
          showToast(displayMessage, 'error');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, showToast]);

  return null;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorHandler />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};


