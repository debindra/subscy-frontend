import { useEffect } from 'react';

/**
 * Hook to set the page title for client components
 * @param title - The page title (will be appended with " | Subsy" template)
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Subsy`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

