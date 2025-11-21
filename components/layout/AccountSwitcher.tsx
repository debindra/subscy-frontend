'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccountContext } from '@/lib/hooks/useAccountContext';
import { useToast } from '@/lib/context/ToastContext';

export const AccountSwitcher: React.FC = () => {
  const {
    activeContext,
    availableContexts,
    hasMultipleContexts,
    switchContext,
    loading,
  } = useAccountContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (context: 'personal' | 'business') => {
    if (context === activeContext) {
      setIsOpen(false);
      return;
    }

    try {
      await switchContext(context);
      showToast(`Switched to ${context} account`, 'success');
      setIsOpen(false);
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Failed to switch account', 'error');
    }
  };

  if (loading) {
    return null;
  }

  // Show switcher if there's at least one context
  if (availableContexts.length === 0) {
    return null;
  }

  const currentContext = availableContexts.find(c => c.isActive) || availableContexts[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={`Current account: ${currentContext?.label || activeContext}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
          <span className="capitalize">{currentContext?.label || activeContext}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden z-50 animate-scale-in">
          <div className="py-1">
            {availableContexts.map((context) => (
              <button
                key={context.context}
                onClick={() => handleSwitch(context.context)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  context.isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{context.label}</span>
                  {context.isActive && (
                    <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
            {!hasMultipleContexts && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
                <Link
                  href="/dashboard/business?create=true"
                  className="w-full text-left px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Business Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

