'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/lib/queryClient';

interface QueryProviderProps {
  children: ReactNode;
}

// Component to handle query errors globally
function QueryErrorHandler() {
  const queryClient = useQueryClient();

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
        
        // Don't show toast for query errors - only mutations (add/edit) should show toasts
        // Mutations handle their own error toasts in component code (handleCreate, handleUpdate, etc.)
        // Query errors (404s, network errors, etc.) are silent failures for better UX
        // Users don't need to be notified about failed data fetches - the UI will show empty/loading states
        return;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

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


