'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { BudgetWidget } from '@/components/dashboard/BudgetWidget';
import { BudgetSettingsModal } from '@/components/dashboard/BudgetSettingsModal';
import { SubscriptionSummaryCards } from '@/components/dashboard/SubscriptionSummaryCards';
import { SubscriptionHealth } from '@/components/dashboard/SubscriptionHealth';
import { EnhancedUpcomingRenewals } from '@/components/dashboard/EnhancedUpcomingRenewals';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { CurrencySpendingSummary, CategorySpending, MonthlyTrend, SpendingSummaryResponse, ConvertedSpendingSummary } from '@/lib/api/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/lib/context/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { businessApi, PlanResponse } from '@/lib/api/business';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useUpcomingSubscriptions } from '@/lib/hooks/useSubscriptions';
import { Modal } from '@/components/ui/Modal';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import {
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
} from '@/lib/hooks/useSubscriptionMutations';
import {
  useDashboardCategorySpending,
  useDashboardMonthlyTrend,
  useDashboardSpending,
} from '@/lib/hooks/useDashboardAnalytics';
import { useSubscriptionStats } from '@/lib/hooks/useSubscriptionStats';
import { settingsApi, UserSettings } from '@/lib/api/settings';
import { useAuth } from '@/lib/hooks/useAuth';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';
import { getUserDisplayName } from '@/lib/utils/userUtils';
import { logger } from '@/lib/utils/logger';
import { resetTour } from '@/lib/utils/tour';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  usePageTitle('Dashboard');
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [currencySummaries, setCurrencySummaries] = useState<CurrencySpendingSummary[]>([]);
  const [convertedSummary, setConvertedSummary] = useState<ConvertedSpendingSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [months, setMonths] = useState<number>(6);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetRefreshKey, setBudgetRefreshKey] = useState(0);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [showPrimaryBreakdown, setShowPrimaryBreakdown] = useState(true); // Default to visible
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  // Edit modal state for upcoming renewals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const { showToast } = useToast();
  const { hasCategorization, loading: planFeaturesLoading } = usePlanFeatures();
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const displayName = getUserDisplayName(user);

  const {
    data: upcoming = [],
    isLoading: upcomingLoading,
  } = useUpcomingSubscriptions();

  // Define handleCloseEditModal early so it can be used in useEffect
  const handleCloseEditModal = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingSubscription(undefined);
  }, []);

  const {
    data: spending,
    isLoading: spendingLoading,
  } = useDashboardSpending(userSettings?.defaultCurrency || undefined);

  const {
    data: trend = [],
    isLoading: trendLoading,
  } = useDashboardMonthlyTrend(months);

  const {
    data: categorySpending = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useDashboardCategorySpending(hasCategorization);

  const {
    data: subscriptionStats,
    isLoading: statsLoading,
  } = useSubscriptionStats();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsApi.getSettings();
        setUserSettings(response.data);
      } catch (error) {
        logger.error('Failed to load user settings for dashboard', error);
      }
    };

    loadSettings();
  }, []);

  // Keyboard shortcuts with page-specific handlers - disabled on mobile
  useKeyboardShortcuts(
    isMobile
      ? { disabled: true } // Disable all shortcuts on mobile
      : {
          onNewSubscription: () => setIsQuickAddModalOpen(true),
          onShowShortcuts: () => setIsKeyboardShortcutsOpen(true),
          // Search is handled globally in layout, but we can override if needed
        }
  );

  // Handle Escape key for closing modals (page-specific)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Escape for closing modals
      if (e.key === 'Escape') {
        const target = e.target as HTMLElement;
        // Don't close modals if user is typing in an input
        const isInputElement = 
          (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'button' && (target as HTMLInputElement).type !== 'submit' && (target as HTMLInputElement).type !== 'reset') ||
          target.tagName === 'TEXTAREA' ||
          (target.isContentEditable && target.getAttribute('contenteditable') === 'true');
        
        if (isInputElement) {
          return; // Let the input handle Escape
        }

        e.preventDefault();
        e.stopPropagation();
        if (isKeyboardShortcutsOpen) {
          setIsKeyboardShortcutsOpen(false);
        } else if (isEditModalOpen) {
          handleCloseEditModal();
        } else if (isQuickAddModalOpen) {
          setIsQuickAddModalOpen(false);
        } else if (isBudgetModalOpen) {
          setIsBudgetModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isEditModalOpen, isQuickAddModalOpen, isBudgetModalOpen, isKeyboardShortcutsOpen, handleCloseEditModal]);

  useEffect(() => {
    if (categoryError && (categoryError as any)?.response?.status === 403) {
      logger.warn('Category analytics not available - user may need to upgrade plan');
      showToast('Category analytics requires Pro or Ultimate plan', 'info');
    }
  }, [categoryError, showToast]);

  // Use refs to track previous stringified values and prevent infinite loops
  const prevUpcomingStrRef = useRef<string>();
  const prevSpendingStrRef = useRef<string>();
  const prevCategorySpendingStrRef = useRef<string>();
  const prevTrendStrRef = useRef<string>();

  useEffect(() => {
    if (!planFeaturesLoading) {
      // Only update if upcoming actually changed (using stringified comparison)
      const upcomingStr = JSON.stringify(upcoming);
      if (prevUpcomingStrRef.current !== upcomingStr) {
        setUpcomingSubscriptions(upcoming);
        prevUpcomingStrRef.current = upcomingStr;
      }
      
      // Only update if spending actually changed
      const spendingStr = JSON.stringify(spending);
      if (prevSpendingStrRef.current !== spendingStr) {
        // Handle spending data - can be new format (SpendingSummaryResponse) or legacy (array)
        if (spending && typeof spending === 'object' && 'converted' in spending) {
          const response = spending as SpendingSummaryResponse;
          setConvertedSummary(response.converted || null);
          setCurrencySummaries(response.byCurrency || []);
        } else if (Array.isArray(spending)) {
          // Legacy format - array of currency summaries
          setCurrencySummaries(spending);
          setConvertedSummary(null);
        } else {
          setCurrencySummaries([]);
          setConvertedSummary(null);
        }
        prevSpendingStrRef.current = spendingStr;
      }
      
      // Only update if categorySpending actually changed
      const categoryStr = JSON.stringify(categorySpending);
      if (prevCategorySpendingStrRef.current !== categoryStr) {
        setCategoryData(categorySpending);
        prevCategorySpendingStrRef.current = categoryStr;
      }
      
      // Only update if trend actually changed
      const trendStr = JSON.stringify(trend);
      if (prevTrendStrRef.current !== trendStr) {
        setMonthlyData(trend);
        prevTrendStrRef.current = trendStr;
      }
    }
  }, [
    upcoming,
    spending,
    categorySpending,
    trend,
    planFeaturesLoading,
  ]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await businessApi.getCurrentPlan();
        setPlan(response.data);

        const limit = response.data.limits.analytics?.monthly_trend?.max_months ?? null;
        if (limit && months > limit) {
          setMonths(limit);
        }
      } catch (error) {
        logger.error('Failed to load plan information', error);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthOptions = useMemo(() => {
    const baseOptions = [3, 6, 12, 24];
    const limit = plan?.limits.analytics?.monthly_trend?.max_months ?? null;

    if (!limit) {
      return baseOptions;
    }

    const allowed = baseOptions.filter((option) => option <= limit);
    if (!allowed.includes(limit)) {
      allowed.push(limit);
    }

    return Array.from(new Set(allowed)).sort((a, b) => a - b);
  }, [plan]);

  // Get plan-specific color classes
  const getPlanColors = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'free':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300';
      case 'pro':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'family':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'business':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'personal':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300';
    }
  };

  // Determine the primary spending figure to highlight in the dashboard
  // Prefer a fully converted total, otherwise fall back to the best single-currency summary
  const primarySpending = useMemo(() => {
    if (convertedSummary) {
      return {
        monthly: convertedSummary.monthlyTotal,
        yearly: convertedSummary.yearlyTotal,
        currency: convertedSummary.currency,
        source: 'converted' as const,
      };
    }

    if (currencySummaries.length === 0) return null;

    const preferredCurrency = userSettings?.defaultCurrency?.toUpperCase();

    if (preferredCurrency) {
      const preferredSummary = currencySummaries.find(
        (s) => s.currency?.toUpperCase() === preferredCurrency
      );
      if (preferredSummary) {
        return {
          monthly: preferredSummary.monthlyTotal,
          yearly: preferredSummary.yearlyTotal,
          currency: preferredSummary.currency,
          source: 'preferred' as const,
        };
      }
    }

    const usdSummary = currencySummaries.find((s) => s.currency === 'USD');
    if (usdSummary) {
      return {
        monthly: usdSummary.monthlyTotal,
        yearly: usdSummary.yearlyTotal,
        currency: usdSummary.currency,
        source: 'usd' as const,
      };
    }

    const first = currencySummaries[0];
    return {
      monthly: first.monthlyTotal,
      yearly: first.yearlyTotal,
      currency: first.currency,
      source: 'first' as const,
    };
  }, [convertedSummary, currencySummaries, userSettings]);

  // Total monthly spending passed into the budget widget
  const monthlySpending = primarySpending?.monthly ?? 0;

  const handleBudgetSettingsSave = () => {
    // Force budget widget to refresh by updating the key
    setBudgetRefreshKey(prev => prev + 1);
    showToast('Budget settings saved', 'success');
  };

  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();

  const handleUpcomingEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleUpcomingUpdate = async (data: CreateSubscriptionData) => {
    if (!editingSubscription) return;

    try {
      await updateSubscription.mutateAsync({
        id: editingSubscription.id,
        data,
      });
      setIsEditModalOpen(false);
      setEditingSubscription(undefined);
      showToast('Subscription updated successfully!', 'success');
    } catch (error) {
      logger.error('Error updating subscription from dashboard', error);
      showToast('Failed to update subscription', 'error');
    }
  };

  const handleUpcomingDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await deleteSubscription.mutateAsync(id);
      showToast('Subscription deleted successfully', 'success');
    } catch (error) {
      logger.error('Error deleting subscription from dashboard', error);
      showToast('Failed to delete subscription', 'error');
    }
  };

  const renderCurrencyIcon = (currency: string) => {
    const code = currency?.trim().toUpperCase();

    switch (code) {
      case 'EUR':
        return (
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
          >
            <path
              d="M20.53 7.34822C20.0618 7.64077 19.4453 7.49865 19.1524 7.03084C19.0357 6.85333 18.905 6.68488 18.7695 6.52151C18.4985 6.1949 18.0945 5.76329 17.5678 5.34742C16.5152 4.51631 15.0206 3.78159 13.1104 3.99385C11.1002 4.21723 9.46561 5.10164 8.32821 6.45571C7.73245 7.16497 7.26033 8.0187 6.9452 8.99998H12C12.5523 8.99998 13 9.44769 13 9.99998C13 10.5523 12.5523 11 12 11H6.54506C6.51528 11.324 6.5 11.6576 6.5 12.0003C6.5 12.3428 6.51526 12.6761 6.545 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H6.945C7.26013 15.9815 7.73232 16.8353 8.32819 17.5447C9.46556 18.8986 11.1001 19.7829 13.1104 20.0063C15.0636 20.2233 16.5779 19.5773 17.6228 18.8624C18.1473 18.5035 18.5477 18.1306 18.8145 17.85C18.9457 17.7121 19.0755 17.5696 19.1884 17.4159C19.5101 16.9691 20.1328 16.8662 20.5812 17.1865C21.0257 17.504 21.1302 18.1392 20.8126 18.5831C20.648 18.8122 20.4577 19.0245 20.2636 19.2285C19.9211 19.5886 19.4152 20.0593 18.7522 20.513C17.4221 21.423 15.4364 22.277 12.8896 21.994C10.3999 21.7174 8.28443 20.602 6.79681 18.8311C5.89323 17.7554 5.23859 16.4592 4.86466 15H2C1.44771 15 1 14.5523 1 14C1 13.4477 1.44772 13 2 13H4.53804C4.51277 12.6724 4.5 12.339 4.5 12.0003C4.5 11.6614 4.51279 11.3277 4.53809 11H2C1.44771 11 1 10.5523 1 9.99998C1 9.44769 1.44772 8.99998 2 8.99998H4.86482C5.23877 7.54101 5.89335 6.24489 6.79679 5.16934C8.28439 3.39834 10.3998 2.28275 12.8896 2.00608C15.4794 1.71829 17.4848 2.73369 18.8072 3.7777C19.4679 4.2994 19.9703 4.83661 20.3086 5.24442C20.5005 5.47561 20.6854 5.715 20.847 5.96861C21.1364 6.43079 20.9927 7.05904 20.53 7.34822Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'USD':
        return (
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
          >
            <path
              d="M12 20.75C11.8019 20.7474 11.6126 20.6676 11.4725 20.5275C11.3324 20.3874 11.2526 20.1981 11.25 20V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V20C12.7474 20.1981 12.6676 20.3874 12.5275 20.5275C12.3874 20.6676 12.1981 20.7474 12 20.75Z"
              fill="currentColor"
            />
            <path
              d="M13.5 18.75H7C6.80109 18.75 6.61032 18.671 6.46967 18.5303C6.32902 18.3897 6.25 18.1989 6.25 18C6.25 17.8011 6.32902 17.6103 6.46967 17.4697C6.61032 17.329 6.80109 17.25 7 17.25H13.5C14.1615 17.3089 14.8199 17.1064 15.3339 16.6859C15.8479 16.2653 16.1768 15.6601 16.25 15C16.1768 14.3399 15.8479 13.7347 15.3339 13.3141C14.8199 12.8935 14.1615 12.691 13.5 12.75H10.5C9.97449 12.7839 9.44746 12.7136 8.94915 12.5433C8.45085 12.373 7.99107 12.106 7.5962 11.7576C7.20134 11.4092 6.87915 10.9863 6.64814 10.513C6.41712 10.0398 6.28182 9.52562 6.25 8.99998C6.28182 8.47434 6.41712 7.96016 6.64814 7.48694C6.87915 7.01371 7.20134 6.59076 7.5962 6.24235C7.99107 5.89394 8.45085 5.62692 8.94915 5.45663C9.44746 5.28633 9.97449 5.21611 10.5 5.24998H16C16.1989 5.24998 16.3897 5.329 16.5303 5.46965C16.671 5.61031 16.75 5.80107 16.75 5.99998C16.75 6.1989 16.671 6.38966 16.5303 6.53031C16.3897 6.67097 16.1989 6.74998 16 6.74998H10.5C9.83846 6.69103 9.18013 6.89353 8.6661 7.3141C8.15206 7.73468 7.82321 8.33987 7.75 8.99998C7.82321 9.6601 8.15206 10.2653 8.6661 10.6859C9.18013 11.1064 9.83846 11.3089 10.5 11.25H13.5C14.0255 11.2161 14.5525 11.2863 15.0508 11.4566C15.5492 11.6269 16.0089 11.8939 16.4038 12.2423C16.7987 12.5908 17.1208 13.0137 17.3519 13.4869C17.5829 13.9602 17.7182 14.4743 17.75 15C17.7182 15.5256 17.5829 16.0398 17.3519 16.513C17.1208 16.9863 16.7987 17.4092 16.4038 17.7576C16.0089 18.106 15.5492 18.373 15.0508 18.5433C14.5525 18.7136 14.0255 18.7839 13.5 18.75Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'GBP':
        return (
          <svg
            className="w-10 h-10"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
          >
            <path
              fill="currentColor"
              d="M196 208a12 12 0 0 1-12 12H56a12 12 0 0 1 0-24h4a24 24 0 0 0 24-24v-32H56a12 12 0 0 1 0-24h28V84a56 56 0 0 1 91.63-43.21a12 12 0 0 1-15.28 18.51A31.66 31.66 0 0 0 140 52a32 32 0 0 0-32 32v32h28a12 12 0 0 1 0 24h-28v32a47.74 47.74 0 0 1-6.44 24H184a12 12 0 0 1 12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-10 h-10"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
          >
            <path
              id="price-tag"
              d="M26.2051,26.2929 C25.8141,26.6839 25.8141,27.3159 26.2051,27.7069 L32.2051,33.7069 C32.4001,33.9019 32.6561,33.9999 32.9121,33.9999 C33.1681,33.9999 33.4241,33.9019 33.6191,33.7069 C34.0101,33.3159 34.0101,32.6839 33.6191,32.2929 L27.6191,26.2929 C27.2281,25.9019 26.5961,25.9019 26.2051,26.2929 L26.2051,26.2929 Z M23.6191,30.2929 C23.2281,29.9019 22.5961,29.9019 22.2051,30.2929 C21.8141,30.6839 21.8141,31.3159 22.2051,31.7069 L28.2051,37.7069 C28.4001,37.9019 28.6561,37.9999 28.9121,37.9999 C29.1681,37.9999 29.4241,37.9019 29.6191,37.7069 C30.0101,37.3159 30.0101,36.6839 29.6191,36.2929 L23.6191,30.2929 Z M19.6191,34.2929 C19.2281,33.9019 18.5961,33.9019 18.2051,34.2929 C17.8141,34.6839 17.8141,35.3159 18.2051,35.7069 L24.2051,41.7069 C24.4001,41.9019 24.6561,41.9999 24.9121,41.9999 C25.1681,41.9999 25.4241,41.9019 25.6191,41.7069 C26.0101,41.3159 26.0101,40.6839 25.6191,40.2929 L19.6191,34.2929 Z M38.4981,31.9999 L27.9121,21.4139 L13.3261,35.9999 L23.9121,46.5859 L38.4981,31.9999 Z M28.6191,19.2929 L40.6191,31.2929 C41.0101,31.6839 41.0101,32.3159 40.6191,32.7069 L24.6191,48.7069 C24.4241,48.9019 24.1681,48.9999 23.9121,48.9999 C23.6561,48.9999 23.4001,48.9019 23.2051,48.7069 L11.2051,36.7069 C10.8141,36.3159 10.8141,35.6839 11.2051,35.2929 L27.2051,19.2929 C27.5961,18.9019 28.2281,18.9019 28.6191,19.2929 L28.6191,19.2929 Z M51.8871,36.5749 C51.4091,36.2939 50.7971,36.4549 50.5181,36.9319 L39.0561,56.4819 C38.2281,57.9149 36.3891,58.4079 35.0011,57.6079 L32.7681,56.1609 C32.3061,55.8599 31.6861,55.9929 31.3861,56.4559 C31.0851,56.9199 31.2171,57.5389 31.6811,57.8389 L33.9571,59.3139 C34.7421,59.7669 35.6011,59.9819 36.4491,59.9819 C38.1781,59.9819 39.8611,59.0869 40.7841,57.4879 L52.2431,37.9429 C52.5221,37.4669 52.3631,36.8549 51.8871,36.5749 L51.8871,36.5749 Z M59.9121,4.9999 L59.9121,20.9999 C59.9121,24.0939 58.9281,26.3989 56.6191,28.7069 L26.9211,58.4469 C25.9761,59.3919 24.7201,59.9109 23.3841,59.9109 C22.0481,59.9109 20.7931,59.3919 19.8501,58.4469 L1.4651,40.0629 C0.5201,39.1179 0.0001,37.8619 0.0001,36.5259 C0.0001,35.1899 0.5201,33.9349 1.4651,32.9909 L27.4391,7.0519 C20.6471,5.5079 16.4321,5.4039 15.1981,5.7649 C15.7191,6.2979 17.3421,7.4299 21.2591,8.9739 C21.7731,9.1769 22.0251,9.7569 21.8231,10.2709 C21.6201,10.7849 21.0391,11.0339 20.5261,10.8349 C12.4181,7.6389 12.8921,5.8669 13.0711,5.1999 C13.4421,3.8099 15.4231,3.3469 19.4811,3.7019 C22.7861,3.9909 27.0521,4.8059 31.4931,5.9949 C35.9341,7.1849 40.0341,8.6119 43.0401,10.0149 C46.7351,11.7379 48.2161,13.1269 47.8431,14.5179 C47.4831,15.8599 45.6121,16.0239 44.9971,16.0779 C44.9681,16.0809 44.9381,16.0819 44.9091,16.0819 C44.3961,16.0819 43.9601,15.6889 43.9141,15.1689 C43.8651,14.6189 44.2721,14.1339 44.8231,14.0859 C45.2491,14.0489 45.5321,13.9909 45.7151,13.9389 C45.2871,13.4919 44.2041,12.7949 42.4721,11.9649 C42.1091,12.5769 41.9121,13.2799 41.9121,13.9999 C41.9121,16.2059 43.7061,17.9999 45.9121,17.9999 C48.1181,17.9999 49.9121,16.2059 49.9121,13.9999 C49.9121,11.7939 48.1181,9.9999 45.9121,9.9999 C45.3591,9.9999 44.9121,9.5529 44.9121,8.9999 C44.9121,8.4469 45.3591,7.9999 45.9121,7.9999 C49.2211,7.9999 51.9121,10.6909 51.9121,13.9999 C51.9121,17.3089 49.2211,19.9999 45.9121,19.9999 C42.6031,19.9999 39.9121,17.3089 39.9121,13.9999 C39.9121,12.9969 40.1761,12.0199 40.6471,11.1479 C38.2541,10.1429 35.0441,9.0179 30.9761,7.9269 C30.5471,7.8119 30.1341,7.7069 29.7211,7.6019 L2.8791,34.4059 C2.3121,34.9719 2.0001,35.7259 2.0001,36.5259 C2.0001,37.3279 2.3121,38.0809 2.8791,38.6479 L21.2641,57.0329 C22.3971,58.1659 24.3731,58.1659 25.5061,57.0329 L55.2041,27.2929 C57.1531,25.3449 57.9121,23.5799 57.9121,20.9999 L57.9121,4.9999 C57.9121,3.3459 56.5661,1.9999 54.9121,1.9999 L38.9121,1.9999 C36.3321,1.9999 34.5671,2.7589 32.6191,4.7069 C32.2281,5.0979 31.5961,5.0979 31.2051,4.7069 C30.8141,4.3159 30.8141,3.6839 31.2051,3.2929 C33.5131,0.9839 35.8181,-0.0001 38.9121,-0.0001 L54.9121,-0.0001 C57.6691,-0.0001 59.9121,2.2429 59.9121,4.9999 L59.9121,4.9999 Z"
              fill="currentColor"
            />
          </svg>
        );
    }
  };

  if (upcomingLoading || spendingLoading || trendLoading || planFeaturesLoading || statsLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Header Skeleton - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full sm:w-auto">
            <div className="h-7 sm:h-9 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            <div className="h-4 sm:h-5 w-full sm:w-96 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          </div>
          <div className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
        </div>
        
        {/* Stats Cards Skeleton - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                  <div className="h-3.5 sm:h-4 w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                  <div className="h-7 sm:h-9 w-32 sm:w-40 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer ml-2 sm:ml-4 flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts Skeleton - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <div className="h-5 sm:h-6 w-32 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer mb-3 sm:mb-4"></div>
              <div className="h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header - Collapsible on mobile */}
      <div className={`sticky top-0 z-50 bg-gradient-to-b from-gray-50/95 to-white/95 dark:from-gray-900/95 dark:to-gray-950/95 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 animate-fade-in backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
        isHeaderCollapsed ? 'py-2' : 'py-4'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            {!isHeaderCollapsed && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 mb-2">
                  {getGreeting()}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text">
                  {displayName}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-sm">
                  Here's your subscription overview
                </p>
              </>
            )}
            {isHeaderCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {displayName}'s Dashboard
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Take Tour Button */}
            <button
              onClick={() => {
                resetTour();
                window.dispatchEvent(new CustomEvent('startTour'));
              }}
              className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white dark:hover:text-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 rounded-lg transition-all duration-200 border border-primary-200 dark:border-primary-800 hover:border-transparent shadow-sm hover:shadow-md transform hover:scale-105"
              title="Take a guided tour of the dashboard"
              aria-label="Take tour"
            >
              <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline text-xs font-semibold">Take Tour</span>
            </button>
            {/* Keyboard Shortcuts Button - Desktop only (hidden on mobile since shortcuts are disabled) */}
            {!isMobile && (
              <button
                onClick={() => setIsKeyboardShortcutsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                title="Keyboard shortcuts (Press ?)"
                aria-label="Show keyboard shortcuts"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="hidden lg:inline text-xs font-medium">Shortcuts</span>
              </button>
            )}
            {/* Mobile collapse button */}
            <button
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={isHeaderCollapsed ? 'Expand header' : 'Collapse header'}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${isHeaderCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <Link
              href="/dashboard/subscriptions"
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white rounded-lg hover:from-brand-accent-600 hover:to-brand-accent-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              data-tour="manage-button"
            >
              Manage Subscriptions
              <svg className="w-5 h-5 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Total Spending Summary */}
      {primarySpending && (
        <Card
          variant="outline-primary"
          className="bg-gradient-to-br from-primary-50 to-primary-100/60 dark:from-primary-900/20 dark:to-primary-900/10 text-gray-900 dark:text-white"
          data-tour="spending-summary"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-800 dark:text-primary-100 mb-2">
                {primarySpending.source === 'converted'
                  ? `Total Spending (Converted to ${primarySpending.currency})`
                  : `Total Spending in ${primarySpending.currency}`}
              </p>
              <p className="text-3xl font-bold mb-1">
                {formatCurrency(primarySpending.monthly, primarySpending.currency)}
              </p>
              <p className="text-base text-primary-700 dark:text-primary-100">
                per month •{' '}
                {formatCurrency(primarySpending.yearly, primarySpending.currency)} per year
              </p>
              {primarySpending.source === 'converted' && (
                <p className="mt-2 text-sm text-primary-700/80 dark:text-primary-100/80">
                  Based on all active subscriptions, converted using your base currency.
                </p>
              )}
              {primarySpending.source !== 'converted' && userSettings?.defaultCurrency && (
                <p className="mt-2 text-sm text-primary-700/80 dark:text-primary-100/80">
                  Showing totals in{' '}
                  <span className="font-semibold">
                    {primarySpending.currency}
                  </span>{' '}
                  {primarySpending.currency.toUpperCase() ===
                  userSettings.defaultCurrency.toUpperCase()
                    ? '(your default currency)'
                    : '(closest match to your default currency)'}
                </p>
              )}
            </div>
            <div className="p-6 bg-white/10 dark:bg-black/20 rounded-2xl backdrop-blur-sm">
              {renderCurrencyIcon(primarySpending.currency)}
            </div>
          </div>

          {/* Currency breakdown - visible by default with toggle */}
          {currencySummaries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary-100/70 dark:border-primary-800/70">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-800 dark:text-primary-100">
                  Breakdown by currency
                </p>
                <button
                  onClick={() => setShowPrimaryBreakdown((prev) => !prev)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
                  aria-label={showPrimaryBreakdown ? 'Hide breakdown' : 'Show breakdown'}
                >
                  {showPrimaryBreakdown ? 'Hide' : 'Show'}
                  <svg 
                    className={`w-3 h-3 transition-transform ${showPrimaryBreakdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showPrimaryBreakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm animate-fade-in">
                  {currencySummaries.map((summary) => (
                    <div
                      key={summary.currency}
                      className="flex items-center justify-between rounded-lg bg-white/70 dark:bg-gray-900/60 px-3 py-2"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {summary.currency}
                      </span>
                      <span className="text-right text-gray-700 dark:text-gray-200">
                        <span className="block">
                          {formatCurrency(summary.monthlyTotal, summary.currency)}{' '}
                          <span className="text-xs text-gray-500 dark:text-gray-400">/ month</span>
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(summary.yearlyTotal, summary.currency)} / year
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Quick Actions - Added prominently after spending summary */}
      {subscriptionStats && (
        <div data-tour="quick-actions">
          <QuickActions
            subscriptionCount={subscriptionStats.total}
            upcomingCount={upcomingSubscriptions.length}
            onQuickAdd={() => setIsQuickAddModalOpen(true)}
          />
        </div>
      )}

      {/* Upcoming Renewals - Moved up for better priority */}
      <div data-tour="upcoming-renewals">
        <EnhancedUpcomingRenewals
          subscriptions={upcomingSubscriptions}
          onEdit={handleUpcomingEdit}
          onDelete={handleUpcomingDelete}
          preferredCurrency={userSettings?.defaultCurrency || primarySpending?.currency || 'USD'}
        />
      </div>

      {/* Stats Cards grouped by currency */}
      <div className="space-y-6">
        {/* {currencySummaries.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {convertedSummary
                  ? 'Original currency breakdown:'
                  : 'Spending grouped by currency:'}
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currencySummaries.map((summary, index) => (
              <Card
                key={summary.currency}
                variant="outline-primary"
                className="bg-white/95 dark:bg-gray-900/60 animate-scale-in transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                style={{ animationDelay: `${index * 0.1}s` }}
                role="button"
                tabIndex={0}
                onDoubleClick={() =>
                  router.push(
                    `/dashboard/subscriptions?currency=${encodeURIComponent(summary.currency)}&status=active`
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(
                      `/dashboard/subscriptions?currency=${encodeURIComponent(summary.currency)}&status=active`
                    );
                  }
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                        {summary.currency} Monthly Spending
                      </p>
                      <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                        {formatCurrency(summary.monthlyTotal, summary.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatCurrency(summary.yearlyTotal / 12, summary.currency)} avg per month
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-110 text-white">
                      {renderCurrencyIcon(summary.currency)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
                        Yearly Spending
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(summary.yearlyTotal, summary.currency)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
                        Active Subscriptions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.totalSubscriptions}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            </div>
          </>
        )}
        
        {currencySummaries.length === 0 && !convertedSummary && (
          <Link href="/dashboard/subscriptions">
            <Card
              variant="outline-primary"
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/80 dark:to-gray-950 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800/60 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                  <svg className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">No active subscriptions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add subscriptions to see spending summaries grouped by currency.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )} */}

        {/* Budget Widget */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Tracking</h2>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Configure budget settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
          <BudgetWidget
            key={budgetRefreshKey}
            monthlySpending={monthlySpending}
            preferredCurrency={userSettings?.defaultCurrency?.toUpperCase() || 'USD'}
          />
        </div>

        {/* Subscription Summary Cards */}
        {subscriptionStats && (
          <div className="animate-fade-in">
            <SubscriptionSummaryCards stats={subscriptionStats} />
          </div>
        )}

      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in" data-tour="analytics">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Spending Insights</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {plan && (
            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${getPlanColors(plan.accountType)}`}>
              {plan.accountType.charAt(0).toUpperCase() + plan.accountType.slice(1)} Plan
            </span>
          )}
          <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="mr-2">Monthly trend:</span>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Months to display in Monthly Trend chart"
              disabled={planLoading}
            >
              {monthOptions.map((option) => (
                <option key={option} value={option}>
                  {`Last ${option} months`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {hasCategorization ? (
        <SpendingChart 
          categoryData={categoryData} 
          monthlyData={monthlyData}
          preferredCurrency={userSettings?.defaultCurrency || primarySpending?.currency || 'USD'}
        />
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
          <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">Category Analytics is a Pro Feature</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
            Upgrade to Pro to view spending breakdown by category and unlock advanced analytics.
          </p>
          <a href="/" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Upgrade to Pro
          </a>
        </div>
      )}

      {/* Subscription Health */}
      {subscriptionStats && (
        <SubscriptionHealth
          subscriptions={upcomingSubscriptions}
          stats={subscriptionStats}
          totalMonthlySpending={monthlySpending}
          preferredCurrency={userSettings?.defaultCurrency || primarySpending?.currency || 'USD'}
        />
      )}

      {/* Budget Settings Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleBudgetSettingsSave}
      />
      {/* Edit Subscription Modal for Upcoming Renewals */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Subscription"
        size="lg"
      >
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={handleUpcomingUpdate}
          onCancel={handleCloseEditModal}
        />
      </Modal>

      {/* Quick Add Subscription Modal */}
      <Modal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        title="Add New Subscription"
        size="lg"
      >
        <SubscriptionForm
          onSubmit={async (data) => {
            try {
              await createSubscription.mutateAsync(data);
              setIsQuickAddModalOpen(false);
              showToast('Subscription added successfully!', 'success');
            } catch (error: any) {
              const errorMessage = error?.response?.data?.message || error?.response?.data?.detail || 'Failed to add subscription';
              showToast(errorMessage, 'error');
              throw error; // Re-throw to let form handle it
            }
          }}
          onCancel={() => setIsQuickAddModalOpen(false)}
        />
      </Modal>

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
        title="Keyboard Shortcuts"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Use these keyboard shortcuts to navigate and perform actions quickly.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Add New Subscription</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Open the subscription form</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <span className="text-gray-400 dark:text-gray-500">+</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  N
                </kbd>
              </div>
            </div>

            <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Spotlight Search</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quick search for subscriptions, actions, and navigation (Web only)</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <span className="text-gray-400 dark:text-gray-500">+</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  K
                </kbd>
              </div>
            </div>

            <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Show Shortcuts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Open this help dialog</p>
              </div>
              <div className="ml-4">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  ?
                </kbd>
              </div>
            </div>

            <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Close Modal</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Close any open dialog or modal</p>
              </div>
              <div className="ml-4">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                  Esc
                </kbd>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Tip: Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> anytime to see this help
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

