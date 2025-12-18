'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/lib/api/subscriptions';
import { useSubscriptions } from '@/lib/hooks/useSubscriptions';
import { formatCurrency } from '@/lib/utils/format';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';

interface SearchResult {
  id: string;
  type: 'subscription' | 'action' | 'navigation';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action: () => void;
  subscription?: Subscription;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd?: () => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onQuickAdd,
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Only fetch subscriptions when the search modal is actually open
  const { data: subscriptions = [] } = useSubscriptions({
    enabled: isOpen && !isMobile, // Only fetch when modal is open and not on mobile
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMobile) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen, isMobile]);

  // Generate search results
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show default actions when no query
      return [
        {
          id: 'action-add',
          type: 'action' as const,
          title: 'Add Subscription',
          subtitle: 'Create a new subscription',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          action: () => {
            if (onQuickAdd) {
              onQuickAdd();
            } else {
              router.push('/dashboard/subscriptions?action=add');
            }
            onClose();
          },
        },
        {
          id: 'nav-subscriptions',
          type: 'navigation' as const,
          title: 'View All Subscriptions',
          subtitle: 'Manage all your subscriptions',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          action: () => {
            router.push('/dashboard/subscriptions');
            onClose();
          },
        },
        {
          id: 'nav-dashboard',
          type: 'navigation' as const,
          title: 'Dashboard',
          subtitle: 'View your subscription overview',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
          action: () => {
            router.push('/dashboard');
            onClose();
          },
        },
      ];
    }

    const q = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search subscriptions
    subscriptions.forEach((sub) => {
      const searchText = `${sub.name} ${sub.category} ${sub.description || ''}`.toLowerCase();
      if (searchText.includes(q)) {
        searchResults.push({
          id: `sub-${sub.id}`,
          type: 'subscription',
          title: sub.name,
          subtitle: `${formatCurrency(sub.amount, sub.currency)} • ${sub.billingCycle} • ${sub.category}`,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          action: () => {
            router.push(`/dashboard/subscriptions/${sub.id}`);
            onClose();
          },
          subscription: sub,
        });
      }
    });

    // Search actions
    const actions = [
      {
        id: 'action-add',
        title: 'Add Subscription',
        subtitle: 'Create a new subscription',
        keywords: ['add', 'new', 'create', 'subscription'],
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        action: () => {
          if (onQuickAdd) {
            onQuickAdd();
          } else {
            router.push('/dashboard/subscriptions?action=add');
          }
          onClose();
        },
      },
    ];

    actions.forEach((action) => {
      if (action.keywords.some((keyword) => keyword.includes(q)) || action.title.toLowerCase().includes(q)) {
        searchResults.push({
          id: action.id,
          type: 'action',
          title: action.title,
          subtitle: action.subtitle,
          icon: action.icon,
          action: action.action,
        });
      }
    });

    // Search navigation
    const navItems = [
      {
        id: 'nav-dashboard',
        title: 'Dashboard',
        subtitle: 'View your subscription overview',
        keywords: ['dashboard', 'home', 'overview'],
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        action: () => {
          router.push('/dashboard');
          onClose();
        },
      },
      {
        id: 'nav-subscriptions',
        title: 'Subscriptions',
        subtitle: 'Manage all your subscriptions',
        keywords: ['subscriptions', 'list', 'manage', 'all'],
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        action: () => {
          router.push('/dashboard/subscriptions');
          onClose();
        },
      },
    ];

    navItems.forEach((nav) => {
      if (nav.keywords.some((keyword) => keyword.includes(q)) || nav.title.toLowerCase().includes(q)) {
        searchResults.push({
          id: nav.id,
          type: 'navigation',
          title: nav.title,
          subtitle: nav.subtitle,
          icon: nav.icon,
          action: nav.action,
        });
      }
    });

    return searchResults;
  }, [query, subscriptions, router, onClose, onQuickAdd]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results.length]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Don't show on mobile or when closed - check after all hooks are called
  if (isMobile || !isOpen) return null;

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels = {
    subscription: 'Subscriptions',
    action: 'Actions',
    navigation: 'Navigation',
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="flex min-h-screen items-start justify-center p-4 pt-[20vh]">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl">
          {/* Search Input */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subscriptions, actions, or navigate..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                autoComplete="off"
              />
              <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            className="max-h-[60vh] overflow-y-auto"
          >
            {results.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No results found</p>
                <p className="text-sm mt-2">Try searching for a subscription name, category, or action</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedResults).map(([type, typeResults]) => (
                  <div key={type} className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {typeLabels[type as keyof typeof typeLabels]}
                    </div>
                    {typeResults.map((result, index) => {
                      const globalIndex = results.findIndex(r => r.id === result.id);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={result.id}
                          onClick={result.action}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                            isSelected
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className={`flex-shrink-0 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{result.title}</div>
                            {result.subtitle && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded">
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    Esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

