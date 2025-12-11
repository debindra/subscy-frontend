'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

// Track if PostHog is blocked by ad blocker
let isPostHogBlocked = false;

// Comprehensive error suppression for PostHog blocked requests
if (typeof window !== 'undefined') {
  // Helper to check if an error is PostHog-related
  const isPostHogError = (args: any[]): boolean => {
    // Convert all arguments to strings and check for PostHog-related blocked errors
    const allArgs = args.map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg?.message) return String(arg.message);
      if (arg?.stack) return String(arg.stack);
      if (arg?.toString) return arg.toString();
      return String(arg);
    }).join(' ').toLowerCase();
    
    // Check for ERR_BLOCKED_BY_CLIENT errors related to PostHog
    const hasBlockedError = allArgs.includes('err_blocked_by_client') || 
                           allArgs.includes('blocked_by_client') ||
                           allArgs.includes('net::err_blocked');
    
    const isPostHogDomain = 
      allArgs.includes('posthog.com') ||
      allArgs.includes('us.i.posthog.com') ||
      allArgs.includes('us-assets.i.posthog.com') ||
      allArgs.includes('phc_'); // PostHog project key prefix
    
    // Also check if the error is coming from PostHog's internal code
    // by checking the stack trace for PostHog-related paths
    const hasPostHogStack = args.some((arg) => {
      const stack = arg?.stack || String(arg);
      return typeof stack === 'string' && (
        stack.includes('posthog') ||
        stack.includes('module.js') // PostHog's minified code
      );
    });
    
    return hasBlockedError && (isPostHogDomain || hasPostHogStack);
  };

  // Override console.error (only if not already overridden)
  if (!(console.error as any).__posthogOverridden) {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (isPostHogError(args)) {
        isPostHogBlocked = true;
        if (process.env.NODE_ENV === 'development' && !(window as any).__posthogBlockedLogged) {
          console.warn(
            '⚠️ PostHog requests are being blocked by an ad blocker. Analytics will be disabled.',
          );
          console.warn('💡 To enable analytics: whitelist us.i.posthog.com in your ad blocker');
          (window as any).__posthogBlockedLogged = true;
        }
        return;
      }
      if (typeof originalError === 'function') {
        originalError.apply(console, args);
      }
    };
    (console.error as any).__posthogOverridden = true;
  }

  // Override console.warn (only if not already overridden)
  if (!(console.warn as any).__posthogOverridden) {
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      if (isPostHogError(args)) {
        isPostHogBlocked = true;
        return;
      }
      if (typeof originalWarn === 'function') {
        originalWarn.apply(console, args);
      }
    };
    (console.warn as any).__posthogOverridden = true;
  }

  // Intercept fetch requests to catch errors before they're logged (only if not already overridden)
  if (!(window.fetch as any).__posthogOverridden) {
    const originalFetch = window.fetch;
    window.fetch = async function (...args: any[]) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      const isPostHogRequest = url.includes('posthog.com') || url.includes('us.i.posthog.com');
      
      try {
        if (typeof originalFetch === 'function') {
          const response = await originalFetch.apply(this, args as any);
          return response;
        }
        // Fallback if originalFetch is not available
        throw new Error('Fetch is not available');
      } catch (error: any) {
        if (isPostHogRequest && error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
          isPostHogBlocked = true;
          // Return a rejected promise that won't log errors
          return Promise.reject(new Error('PostHog request blocked'));
        }
        throw error;
      }
    };
    (window.fetch as any).__posthogOverridden = true;
  }

  // Intercept XMLHttpRequest errors (only if not already overridden)
  if (!(XMLHttpRequest.prototype.open as any).__posthogOverridden) {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: any[]) {
      (this as any).__posthogUrl = typeof url === 'string' ? url : url.toString();
      if (typeof originalXHROpen === 'function') {
        return originalXHROpen.apply(this, [method, url, ...rest] as any);
      }
      return;
    };
    (XMLHttpRequest.prototype.open as any).__posthogOverridden = true;
    
    XMLHttpRequest.prototype.send = function (...args: any[]) {
      const url = (this as any).__posthogUrl || '';
      const isPostHogRequest = url.includes('posthog.com') || url.includes('us.i.posthog.com');
      
      if (isPostHogRequest) {
        this.addEventListener('error', (event) => {
          isPostHogBlocked = true;
          event.stopPropagation();
        }, { capture: true });
        
        this.addEventListener('abort', () => {
          isPostHogBlocked = true;
        }, { capture: true });
      }
      
      if (typeof originalXHRSend === 'function') {
        return originalXHRSend.apply(this, args as [Document | XMLHttpRequestBodyInit | null | undefined]);
      }
    };
    (XMLHttpRequest.prototype.send as any).__posthogOverridden = true;
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = String(reason?.message || reason || '').toLowerCase();
    if (
      reasonStr.includes('err_blocked_by_client') &&
      (reasonStr.includes('posthog.com') || reasonStr.includes('us.i.posthog.com'))
    ) {
      isPostHogBlocked = true;
      event.preventDefault(); // Prevent default error logging
    }
  });

  // Global error handler to catch any remaining PostHog errors
  window.addEventListener('error', (event) => {
    const errorMsg = String(event.message || event.error?.message || '').toLowerCase();
    const errorSource = String(event.filename || '').toLowerCase();
    
    if (
      (errorMsg.includes('err_blocked_by_client') || 
       errorMsg.includes('blocked_by_client') ||
       errorMsg.includes('net::err_blocked')) &&
      (errorMsg.includes('posthog.com') ||
       errorMsg.includes('us.i.posthog.com') ||
       errorSource.includes('posthog') ||
       errorSource.includes('module.js')) // PostHog's minified code
    ) {
      isPostHogBlocked = true;
      event.preventDefault(); // Prevent default error logging
      event.stopPropagation(); // Stop error propagation
    }
  }, true); // Use capture phase to catch errors early
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize PostHog on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 PostHog initialization check:', {
        hasKey: !!posthogKey,
        hasHost: !!posthogHost,
        keyPreview: posthogKey ? posthogKey.substring(0, 10) + '...' : 'missing',
        host: posthogHost || 'missing',
        windowDefined: typeof window !== 'undefined',
      });
    }

    // Check if environment variables are set
    if (!posthogKey || !posthogHost) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ PostHog environment variables not set. Please check your .env.local file.');
        console.warn('Required variables: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST');
      }
      return;
    }

    // Check if PostHog is already initialized (PostHog sets this property)
    if ((posthog as any).__loaded || (posthog as any).initialized) {
      setIsInitialized(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ PostHog already initialized');
      }
      return;
    }

    // Initialize PostHog (safe to call multiple times - PostHog handles it)
    try {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll handle pageviews manually
        capture_pageleave: true,
        // Batch requests to reduce network calls
        request_batching: true,
        // Disable automatic retries to reduce console noise when blocked
        // PostHog will still retry internally, but we'll catch errors
        disable_session_recording: true, // Disable session recording to reduce requests
        loaded: (ph) => {
          setIsInitialized(true);
          
          // Wrap PostHog's capture method to catch errors
          // Only wrap if capture method exists
          if (ph && typeof ph.capture === 'function') {
            const originalCapture = ph.capture.bind(ph);
            ph.capture = function(...args: any[]) {
              try {
                return originalCapture.apply(ph, args as any);
              } catch (error: any) {
                const errorMsg = String(error?.message || error || '').toLowerCase();
                if (
                  errorMsg.includes('err_blocked_by_client') ||
                  errorMsg.includes('failed to fetch') ||
                  errorMsg.includes('networkerror')
                ) {
                  isPostHogBlocked = true;
                  return; // Silently fail
                }
                throw error; // Re-throw non-blocked errors
              }
            };
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ PostHog initialized successfully');
            console.log('📊 PostHog ready to track events');
            // Test event to verify PostHog is working
            setTimeout(() => {
              try {
                ph.capture('posthog_test', {
                  test: true,
                  timestamp: new Date().toISOString(),
                });
                console.log('🧪 Test event sent to PostHog');
              } catch (error) {
                // Silently handle blocked test events
                isPostHogBlocked = true;
              }
            }, 1000);
          }
        },
      });

      // Monitor for blocked requests
      if (process.env.NODE_ENV === 'development') {
        const checkBlockedRequests = () => {
          // Check network tab for blocked requests after a delay
          setTimeout(() => {
            const performanceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            const posthogRequests = performanceEntries.filter(
              (entry) => entry.name.includes('posthog.com')
            );
            
            if (posthogRequests.length === 0 && !isPostHogBlocked) {
              console.warn('⚠️ PostHog requests may be blocked by an ad blocker');
              console.warn('💡 Solutions:');
              console.warn('   1. Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)');
              console.warn('   2. Add us.i.posthog.com to your ad blocker whitelist');
              console.warn('   3. Test in incognito/private mode');
            }
          }, 3000);
        };
        checkBlockedRequests();
      }
    } catch (error) {
      // Only log non-blocked errors
      if (
        !(error as any)?.message?.includes('ERR_BLOCKED_BY_CLIENT') &&
        !(error as any)?.message?.includes('Failed to fetch')
      ) {
        console.error('❌ Failed to initialize PostHog:', error);
      }
    }
  }, []);

  // Track pageviews when route changes
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized || !pathname || isPostHogBlocked) return;

    try {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 PostHog pageview tracked:', url);
      }
    } catch (error) {
      // Silently handle blocked requests
      if (
        !(error as any)?.message?.includes('ERR_BLOCKED_BY_CLIENT') &&
        !(error as any)?.message?.includes('Failed to fetch')
      ) {
        console.error('❌ Failed to track pageview:', error);
      }
    }
  }, [pathname, searchParams, isInitialized]);

  return <>{children}</>;
}

