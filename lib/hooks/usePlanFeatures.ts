'use client';

import { useState, useEffect } from 'react';
import { businessApi, PlanResponse } from '../api/business';

export function usePlanFeatures() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await businessApi.getCurrentPlan();
        setPlan(response.data);
      } catch (error) {
        console.error('Failed to load plan information', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

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
  const hasDataImport = plan?.limits?.data_import === true || isPro || isUltimate;
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

