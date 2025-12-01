'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the screen matches a media query
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener as EventListener);
      return () => media.removeEventListener('change', listener as EventListener);
    } else {
      // Fallback for older browsers
      media.addListener(listener as (mql: MediaQueryList) => void);
      return () => media.removeListener(listener as (mql: MediaQueryList) => void);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to detect if the screen is mobile (< 768px)
 * @returns boolean indicating if the screen is mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook to detect if the screen is desktop (>= 768px)
 * @returns boolean indicating if the screen is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

