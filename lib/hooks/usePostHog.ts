'use client';

import { useCallback } from 'react';
import posthog from 'posthog-js';

/**
 * Hook to use PostHog analytics in client components
 * 
 * @example
 * const posthog = usePostHog();
 * posthog.capture('button_clicked', { button_name: 'signup' });
 */
export function usePostHog() {
  const isLoaded = typeof window !== 'undefined' && ((posthog as any).__loaded || (posthog as any).initialized);

  const capture = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (isLoaded) {
      try {
        posthog.capture(eventName, properties);
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 PostHog event captured: ${eventName}`, properties);
        }
      } catch (error) {
        // Silently handle blocked requests
        const errorMessage = (error as any)?.message || String(error);
        if (
          !errorMessage.includes('ERR_BLOCKED_BY_CLIENT') &&
          !errorMessage.includes('Failed to fetch') &&
          !errorMessage.includes('NetworkError')
        ) {
          console.error('PostHog capture error:', error);
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('PostHog not loaded yet. Event not captured:', eventName);
      }
    }
  }, [isLoaded]);

  const identify = useCallback((distinctId: string, properties?: Record<string, any>) => {
    if (isLoaded) {
      try {
        posthog.identify(distinctId, properties);
        if (process.env.NODE_ENV === 'development') {
          console.log(`👤 PostHog identify: ${distinctId}`, properties);
        }
      } catch (error) {
        // Silently handle blocked requests
        const errorMessage = (error as any)?.message || String(error);
        if (
          !errorMessage.includes('ERR_BLOCKED_BY_CLIENT') &&
          !errorMessage.includes('Failed to fetch') &&
          !errorMessage.includes('NetworkError')
        ) {
          console.error('PostHog identify error:', error);
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('PostHog not loaded yet. Identify not called.');
      }
    }
  }, [isLoaded]);

  const reset = useCallback(() => {
    if (isLoaded) {
      try {
        posthog.reset();
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 PostHog reset');
        }
      } catch (error) {
        // Silently handle blocked requests
        const errorMessage = (error as any)?.message || String(error);
        if (
          !errorMessage.includes('ERR_BLOCKED_BY_CLIENT') &&
          !errorMessage.includes('Failed to fetch') &&
          !errorMessage.includes('NetworkError')
        ) {
          console.error('PostHog reset error:', error);
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('PostHog not loaded yet. Reset not called.');
      }
    }
  }, [isLoaded]);

  return {
    capture,
    identify,
    reset,
    posthog: isLoaded ? posthog : null,
    isLoaded,
  };
}

