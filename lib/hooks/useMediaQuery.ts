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

    // Modern browsers
    if (media.addEventListener) {
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      // Legacy addListener passes MediaQueryList, not MediaQueryListEvent
      const listener = () => {
        setMatches(media.matches);
      };
      media.addListener(listener);
      return () => media.removeListener(listener);
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
 * Hook to detect if the screen is tablet (>= 768px and < 1024px)
 * @returns boolean indicating if the screen is tablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Hook to detect if the screen is desktop (>= 768px)
 * @returns boolean indicating if the screen is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

