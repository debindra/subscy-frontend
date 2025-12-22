'use client';

import { useQuery } from '@tanstack/react-query';
import { businessApi, PlanResponse } from '../api/business';
import { useAuth } from './useAuth';

const PLAN_KEY = ['plan'] as const;

export function usePlanFeatures() {
  const { user, loading: authLoading, sessionReady } = useAuth();
  
  const {
    data: plan,
    isLoading,
  } = useQuery<PlanResponse>({
    queryKey: PLAN_KEY,
    queryFn: async () => {
      const response = await businessApi.getCurrentPlan();
      return response.data;
    },
    enabled: !authLoading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });

  const loading = authLoading || isLoading;

  // New plan structure: starter, pro, ultimate
  // Legacy support: base, command, sentinel, free, family, personal, business
  const isStarter = plan?.accountType === 'starter' || plan?.accountType === 'base' || plan?.accountType === 'free' || plan?.accountType === 'personal' || !plan;
  const isPro = plan?.accountType === 'pro' || plan?.accountType === 'command';
  const isUltimate = plan?.accountType === 'ultimate' || plan?.accountType === 'sentinel' || plan?.accountType === 'family' || plan?.accountType === 'business';
  
  // Legacy compatibility (for backward compatibility with old code)
  const isBase = isStarter;
  const isCommand = isPro;
  const isSentinel = isUltimate;
  const isFree = isStarter;
  const isFamily = isUltimate;
  
  const hasCategorization = plan?.limits?.categorization === true || isPro || isUltimate;
  const hasSmartRenewalManagement = plan?.limits?.smart_renewal_management === true || isPro || isUltimate;
  const hasCancellationNotes = plan?.limits?.cancellation_notes === true || isPro || isUltimate;
  const hasSharedAccounts = plan?.limits?.shared_accounts === true || plan?.limits?.team_sharing === true || isUltimate;
  const hasCustomizableReminders = plan?.limits?.customizable_reminders === true || isPro || isUltimate;
  const hasPushNotifications = plan?.limits?.push_notifications === true || isPro || isUltimate;
  const hasDataImport = false;  // Feature disabled
  const hasMultiCurrency = plan?.limits?.multi_currency === true || isUltimate;
  const hasExports = (plan?.limits?.exports?.csv === true || plan?.limits?.exports?.pdf === true) || isUltimate;
  const maxSubscriptions = plan?.limits?.max_subscriptions ?? (isStarter ? 5 : null);

  return {
    plan,
    loading,
    // New plan structure
    isStarter,
    isPro,
    isUltimate,
    // Legacy compatibility (for backward compatibility)
    isBase,
    isCommand,
    isSentinel,
    isFree,
    isFamily,
    // Feature flags
    hasCategorization,
    hasSmartRenewalManagement,
    hasCancellationNotes,
    hasSharedAccounts,
    hasCustomizableReminders,
    hasPushNotifications,
    hasDataImport,
    hasMultiCurrency,
    hasExports,
    maxSubscriptions,
  };
}

