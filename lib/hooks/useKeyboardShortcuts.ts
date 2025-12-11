'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/lib/context/ToastContext';

interface UseKeyboardShortcutsOptions {
  onNewSubscription?: () => void;
  onSearch?: () => void;
  onShowShortcuts?: () => void;
  disabled?: boolean; // Option to disable all shortcuts
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { onNewSubscription, onSearch, onShowShortcuts, disabled } = options;

  useEffect(() => {
    // Don't register shortcuts if disabled
    if (disabled) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // More precise input detection - only skip if actually typing in an input field
      const target = e.target as HTMLElement;
      
      // Check if target is an actual input, textarea, or contenteditable
      const isInputElement = 
        (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'button' && (target as HTMLInputElement).type !== 'submit' && (target as HTMLInputElement).type !== 'reset' && (target as HTMLInputElement).type !== 'checkbox' && (target as HTMLInputElement).type !== 'radio') ||
        target.tagName === 'TEXTAREA' ||
        (target.isContentEditable && target.getAttribute('contenteditable') === 'true');
      
      // Check if target is inside a contenteditable element
      const isInsideContentEditable = target.closest('[contenteditable="true"]');
      
      // Always allow Escape and ? shortcuts even in inputs
      const isEscapeOrQuestion = e.key === 'Escape' || e.key === '?';
      
      // Block shortcuts only if actually typing in a text input
      if ((isInputElement || isInsideContentEditable) && !isEscapeOrQuestion) {
        return;
      }

      const key = e.key.toLowerCase();
      const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + K for search
      if (modifierKey && key === 'k' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        if (onSearch) {
          onSearch();
        } else {
          // Default: show search toast or navigate to search
          showToast('Search feature coming soon!', 'info');
        }
        return;
      }
      
      // Ctrl/Cmd + N for new subscription
      if (modifierKey && key === 'n' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        
        if (onNewSubscription) {
          onNewSubscription();
        } else {
          // Default behavior: navigate to subscriptions page
          if (pathname?.includes('/dashboard/subscriptions')) {
            // If already on subscriptions page, we'll rely on the page to handle it
            // This could trigger a modal open via query param
            router.push('/dashboard/subscriptions?action=add');
          } else {
            router.push('/dashboard/subscriptions?action=add');
          }
        }
        return;
      }
      
      // ? to show keyboard shortcuts (Shift+/ or ? key)
      if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        if (onShowShortcuts) {
          onShowShortcuts();
        }
        return;
      }
    };

    // Use capture phase to catch events early, before browser defaults
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [router, pathname, showToast, onNewSubscription, onSearch, onShowShortcuts, disabled]);
}

