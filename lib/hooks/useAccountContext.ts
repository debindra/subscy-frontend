'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { authApi } from '../api/auth';

type AccountContext = 'personal' | 'business';
type AccountType = 'free' | 'pro' | 'family' | 'personal' | 'business';

interface AccountContextInfo {
  context: AccountContext;
  label: string;
  isActive: boolean;
}

export function useAccountContext() {
  const { user } = useAuth();
  const [activeContext, setActiveContext] = useState<AccountContext>('personal');
  const [availableContexts, setAvailableContexts] = useState<AccountContextInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Get account type from user metadata (returns account type, not context)
  const getUserAccountType = useCallback((): AccountType => {
    if (!user) return 'free';
    const metadata = user.user_metadata as { account_type?: string } | undefined;
    const accountType = (metadata?.account_type as AccountType) || 'free';
    // Map legacy "personal" to "free" for backward compatibility
    return accountType === 'personal' ? 'free' : accountType;
  }, [user]);

  // Load available account contexts
  const loadAccountContexts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setAvailableContexts([]);
      return;
    }

    try {
      const response = await authApi.getAccountContexts();
      console.log('Account contexts response:', response.data);
      setAvailableContexts(response.data.availableContexts);
      setActiveContext(response.data.currentContext as AccountContext);
      
      // Also store in localStorage for API client
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeAccountContext', response.data.currentContext);
      }
    } catch (error: any) {
      console.error('Error loading account contexts:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Fallback to user metadata - map account type to context
      const accountType = getUserAccountType();
      // Map account types to contexts: free/pro/family -> personal, business -> business
      const mappedContext: AccountContext = accountType === 'business' ? 'business' : 'personal';
      setActiveContext(mappedContext);
      
      const contexts: AccountContextInfo[] = [
        {
          context: 'personal',
          label: 'Personal',
          isActive: mappedContext === 'personal',
        },
      ];
      
      // Add business if user has business account type
      if (accountType === 'business') {
        contexts.push({
          context: 'business',
          label: 'Business',
          isActive: true,
        });
      }
      
      setAvailableContexts(contexts);
    } finally {
      setLoading(false);
    }
  }, [user, getUserAccountType]);

  // Switch account context
  const switchContext = useCallback(async (context: AccountContext) => {
    if (context === activeContext) return;

    try {
      await authApi.switchAccountContext(context);
      setActiveContext(context);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeAccountContext', context);
      }

      // Reload account contexts to get updated state
      await loadAccountContexts();
      
      // Reload page to refresh all data
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching account context:', error);
      throw error;
    }
  }, [activeContext, loadAccountContexts]);

  // Initialize on mount and when user changes
  useEffect(() => {
    if (user) {
      loadAccountContexts();
    } else {
      setLoading(false);
      setActiveContext('personal');
      setAvailableContexts([]);
    }
  }, [user, loadAccountContexts]);

  // Get current account context from localStorage on mount (for API client)
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const stored = localStorage.getItem('activeAccountContext') as AccountContext | null;
      if (stored && (stored === 'personal' || stored === 'business')) {
        const accountType = getUserAccountType();
        // Only use stored if it matches user's available contexts
        if (stored === accountType || (stored === 'business' && availableContexts.some(c => c.context === 'business'))) {
          setActiveContext(stored);
        }
      }
    }
  }, [user, getUserAccountType, availableContexts]);

  const hasMultipleContexts = availableContexts.length > 1;
  const canSwitchToBusiness = availableContexts.some(c => c.context === 'business');
  const canSwitchToPersonal = availableContexts.some(c => c.context === 'personal');

  return {
    activeContext,
    availableContexts,
    hasMultipleContexts,
    canSwitchToBusiness,
    canSwitchToPersonal,
    switchContext,
    loading,
  };
}

