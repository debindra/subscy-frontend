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

  const isPro = plan?.accountType === 'pro' || plan?.accountType === 'family' || plan?.accountType === 'business';
  const isFree = plan?.accountType === 'free' || plan?.accountType === 'personal' || !plan;
  const isFamily = plan?.accountType === 'family';
  
  const hasCategorization = plan?.limits?.categorization === true || isPro;
  const hasSmartRenewalManagement = plan?.limits?.smart_renewal_management === true || isPro;
  const hasCancellationNotes = plan?.limits?.cancellation_notes === true || isPro;
  const hasSharedAccounts = plan?.limits?.shared_accounts === true || isFamily;
  const maxSubscriptions = plan?.limits?.max_subscriptions ?? (isFree ? 5 : null);

  return {
    plan,
    loading,
    isPro,
    isFree,
    isFamily,
    hasCategorization,
    hasSmartRenewalManagement,
    hasCancellationNotes,
    hasSharedAccounts,
    maxSubscriptions,
  };
}

