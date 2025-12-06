'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/context/ToastContext';
import { useSearchParams } from 'next/navigation';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useSubscriptions } from '@/lib/hooks/useSubscriptions';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useUpdateSubscription,
} from '@/lib/hooks/useSubscriptionMutations';
import { useDashboardSpending } from '@/lib/hooks/useDashboardAnalytics';
import { settingsApi, UserSettings } from '@/lib/api/settings';
import { SpendingSummaryResponse } from '@/lib/api/analytics';
import { useViewMode } from '@/lib/context/ViewModeContext';

export default function SubscriptionsPage() {
  const PAGE_SIZE = 6;

  usePageTitle('Subscriptions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [billing, setBilling] = useState<'all' | Subscription['billingCycle']>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [trial, setTrial] = useState<'all' | 'trial' | 'nontrial'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [currency, setCurrency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('renewalDate-asc');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { viewMode, setViewMode } = useViewMode();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const { hasCategorization } = usePlanFeatures();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const {
    data: subscriptions = [],
    isLoading,
  } = useSubscriptions();

  // Fetch user settings to get defaultCurrency
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsApi.getSettings();
        setUserSettings(response.data);
      } catch (error) {
        console.error('Failed to load user settings', error);
      }
    };
    loadSettings();
  }, []);

  // Get converted spending totals if defaultCurrency is set
  const {
    data: spendingData,
  } = useDashboardSpending(userSettings?.defaultCurrency || undefined);

  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const currencyParam = searchParams.get('currency');

    if (statusParam === 'all' || statusParam === 'active' || statusParam === 'inactive') {
      setFilter(statusParam);
    }

    if (currencyParam) {
      setCurrency(currencyParam);
    } else {
      setCurrency('all');
    }
  }, [searchParamsString]);

  // Prevent body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      
      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        html.style.overflow = '';
        body.style.touchAction = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileFiltersOpen]);

  const handleCreate = async (data: CreateSubscriptionData) => {
    try {
      await createSubscription.mutateAsync(data);
      setIsModalOpen(false);
      showToast(`"${data.name}" subscription created successfully!`, 'success');
    } catch (error) {
      showToast(`Failed to create "${data.name}" subscription`, 'error');
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const handleUpdate = async (data: CreateSubscriptionData) => {
    if (!editingSubscription) return;

    try {
      await updateSubscription.mutateAsync({
        id: editingSubscription.id,
        data,
      });
      setIsModalOpen(false);
      setEditingSubscription(undefined);
      showToast(`"${data.name}" subscription updated successfully!`, 'success');
    } catch (error) {
      showToast(`Failed to update "${data.name}" subscription`, 'error');
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) return;

    if (!confirm(`Are you sure you want to delete "${subscription.name}" subscription?`)) {
      return;
    }

    try {
      await deleteSubscription.mutateAsync(id);
      showToast(`"${subscription.name}" subscription deleted successfully`, 'success');
    } catch (error) {
      showToast(`Failed to delete "${subscription.name}" subscription`, 'error');
      console.error('Error deleting subscription:', error);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(undefined);
  };

  const currencyOptions = useMemo(
    () => Array.from(new Set(subscriptions.map((s) => s.currency))).sort(),
    [subscriptions]
  );

  const filteredSubscriptions = useMemo(() => {
    const filtered = subscriptions.filter((sub) => {
      // status filter
      if (filter === 'active' && !sub.isActive) return false;
      if (filter === 'inactive' && sub.isActive) return false;
      // search filter
      const q = search.trim().toLowerCase();
      if (q) {
        const haystack = `${sub.name} ${sub.category} ${sub.description || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // category filter
      if (category !== 'all' && sub.category !== category) return false;
      // currency filter
      if (currency !== 'all' && sub.currency !== currency) return false;
      // billing cycle filter
      if (billing !== 'all' && sub.billingCycle !== billing) return false;
      // price range filter
      const min = priceMin ? parseFloat(priceMin) : undefined;
      const max = priceMax ? parseFloat(priceMax) : undefined;
      if (typeof min === 'number' && sub.amount < min) return false;
      if (typeof max === 'number' && sub.amount > max) return false;
      // trial filter
      if (trial === 'trial' && !sub.isTrial) return false;
      if (trial === 'nontrial' && sub.isTrial) return false;
      // next renewal date range filter
      if (dateFrom) {
        const from = new Date(dateFrom).getTime();
        const next = new Date(sub.nextRenewalDate).getTime();
        if (next < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo).getTime();
        const next = new Date(sub.nextRenewalDate).getTime();
        if (next > to) return false;
      }
      return true;
    });

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('-');
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'renewalDate':
          comparison = new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
          break;
        case 'price':
          comparison = (a.amount || 0) - (b.amount || 0);
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [subscriptions, filter, search, category, currency, billing, priceMin, priceMax, trial, dateFrom, dateTo, sortBy]);

  const visibleSubscriptions = useMemo(
    () => filteredSubscriptions.slice(0, visibleCount),
    [filteredSubscriptions, visibleCount]
  );

  // Reset visible count when filters or search change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    filter,
    search,
    category,
    billing,
    priceMin,
    priceMax,
    trial,
    dateFrom,
    dateTo,
    currency,
    sortBy,
    subscriptions,
  ]);

  // Infinite scroll: load more when sentinel is visible
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        !isLoading &&
        visibleCount < filteredSubscriptions.length
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, filteredSubscriptions.length)
        );
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, visibleCount, filteredSubscriptions.length]);

  // Calculate totals for export - use converted totals if available, otherwise calculate locally
  const { monthlyTotal, yearlyTotal, totalsCurrency } = useMemo(() => {
    // Check if we have converted totals from API
    if (spendingData && typeof spendingData === 'object' && 'converted' in spendingData) {
      const response = spendingData as SpendingSummaryResponse;
      if (response.converted) {
        return {
          monthlyTotal: response.converted.monthlyTotal,
          yearlyTotal: response.converted.yearlyTotal,
          totalsCurrency: response.converted.currency,
        };
      }
    }
    
    // Fallback to local calculation (sums all currencies without conversion)
    const monthly = subscriptions
      .filter(s => s.isActive)
      .reduce((sum, sub) => {
        const { amount, billingCycle } = sub;
        let monthlyAmount = amount;
        
        if (billingCycle === 'yearly') monthlyAmount = amount / 12;
        else if (billingCycle === 'quarterly') monthlyAmount = amount / 3;
        else if (billingCycle === 'weekly') monthlyAmount = amount * 4.33;
        
        return sum + monthlyAmount;
      }, 0);
    
    return {
      monthlyTotal: monthly,
      yearlyTotal: monthly * 12,
      totalsCurrency: undefined, // Mixed currencies
    };
  }, [subscriptions, spendingData]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header Loading State - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="space-y-2 w-full sm:w-auto">
            <div className="h-7 sm:h-9 w-full sm:w-48 md:w-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
            <div className="h-4 sm:h-5 w-full sm:w-64 md:w-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="h-10 w-full sm:w-28 md:w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
            <div className="h-10 w-full sm:w-36 md:w-40 bg-gradient-to-r from-primary-200 to-primary-300 dark:from-primary-700 dark:to-primary-600 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Filter Loading State - Responsive */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 sm:h-10 w-20 sm:w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Enhanced Subscription Cards Loading State - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-300 animate-fade-in">
              {/* Card Header with Icon - Responsive */}
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="h-6 sm:h-7 w-28 sm:w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                    <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-700 dark:to-green-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-3.5 sm:h-4 w-20 sm:w-28 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Enhanced Pricing Section - Responsive */}
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/25 dark:to-primary-800/25 rounded-xl border border-primary-200/50 dark:border-primary-700/30 animate-pulse">
                <div className="flex items-baseline space-x-1">
                  <div className="h-7 sm:h-9 w-24 sm:w-32 bg-gradient-to-r from-primary-200 to-primary-300 dark:from-primary-700 dark:to-primary-600 rounded animate-pulse"></div>
                  <div className="h-3.5 sm:h-4 w-12 sm:w-16 bg-gradient-to-r from-primary-200 to-primary-300 dark:from-primary-700 dark:to-primary-600 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Enhanced Renewal Information - Responsive */}
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="h-3.5 sm:h-4 w-16 sm:w-24 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3.5 sm:h-4 w-14 sm:w-20 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse flex-shrink-0 ml-2"></div>
                </div>
                <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg w-24 sm:w-32">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="h-3.5 sm:h-4 w-14 sm:w-20 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Enhanced Action Buttons - Responsive */}
              <div className="flex space-x-2 pt-3 sm:pt-4 border-t dark:border-gray-700">
                <div className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-primary-200 to-primary-300 dark:from-primary-700 dark:to-primary-600 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-200 to-red-300 dark:from-red-700 dark:to-red-600 rounded-lg animate-pulse flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Loading Progress Indicator - Responsive */}
        <div className="text-center space-y-2 sm:space-y-3 py-4 sm:py-6">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Loading your subscriptions...</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Please wait while we fetch your subscription data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your subscriptions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* First row on mobile: Export and Filter */}
          <div className="flex gap-2 w-full sm:w-auto sm:order-3">
            {subscriptions.length > 0 && (
              <div className="flex-1 sm:flex-none min-w-0">
                <ExportButton
                  subscriptions={subscriptions}
                  monthlyTotal={monthlyTotal}
                  yearlyTotal={yearlyTotal}
                  currency={totalsCurrency}
                />
              </div>
            )}
            {/* Mobile Filter Button - Hidden on desktop */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex-1 sm:flex-none"
              aria-label="Open filters menu"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span className="hidden min-[375px]:inline">Filters</span>
            </button>
          </div>

          {/* Second row on mobile: Add Subscription with View Mode Toggle */}
          <div className="flex gap-2 w-full sm:w-auto sm:order-1">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="accent"
              className="flex-1 sm:flex-none min-h-[44px] whitespace-nowrap"
            >
              <span className="hidden min-[375px]:inline">+ Add Subscription</span>
              <span className="min-[375px]:hidden">+ Add</span>
            </Button>
            {/* View Mode Toggle - Next to Add Subscription button */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-brand-accent-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="List view"
                aria-pressed={viewMode === 'detailed'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-brand-accent-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'compact'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips - Show active filters */}
      {(search || filter !== 'active' || category !== 'all' || billing !== 'all' || currency !== 'all' || priceMin || priceMax || trial !== 'all' || dateFrom || dateTo) && (
        <div className="flex flex-wrap gap-2 mb-4" role="status" aria-label="Active filters">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
              Search: "{search}"
              <button
                onClick={() => setSearch('')}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                aria-label="Remove search filter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          {filter !== 'active' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
              Status: {filter}
              <button
                onClick={() => setFilter('active')}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                aria-label="Remove status filter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
              Category: {category}
              <button
                onClick={() => setCategory('all')}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                aria-label="Remove category filter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          {currency !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
              Currency: {currency}
              <button
                onClick={() => setCurrency('all')}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                aria-label="Remove currency filter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          {(priceMin || priceMax) && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
              Price: {priceMin || '0'} - {priceMax || '∞'}
              <button
                onClick={() => {
                  setPriceMin('');
                  setPriceMax('');
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                aria-label="Remove price filter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearch('');
              setFilter('active');
              setCategory('all');
              setBilling('all');
              setPriceMin('');
              setPriceMax('');
              setTrial('all');
              setDateFrom('');
              setDateTo('');
              setCurrency('all');
              setSortBy('renewalDate-asc');
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Desktop Filters - Hidden on mobile */}
      <div className="hidden md:block space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search name, category, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Search subscriptions"
          />

          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-pressed={filter === 'all'}
            aria-label={`Show all subscriptions (${subscriptions.length} total)`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-pressed={filter === 'active'}
            aria-label={`Show active subscriptions (${subscriptions.filter((s) => s.isActive).length} active)`}
          >
            Active ({subscriptions.filter((s) => s.isActive).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'inactive'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-pressed={filter === 'inactive'}
            aria-label={`Show inactive subscriptions (${subscriptions.filter((s) => !s.isActive).length} inactive)`}
          >
            Inactive ({subscriptions.filter((s) => !s.isActive).length})
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Sort subscriptions"
          >
            <option value="renewalDate-asc">Renewal Date (Earliest)</option>
            <option value="renewalDate-desc">Renewal Date (Latest)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        {/* Expand/Collapse Filters Button */}
        <button
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={isFiltersExpanded}
          aria-controls="advanced-filters-section"
          aria-label={`${isFiltersExpanded ? 'Hide' : 'Show'} advanced filters`}
        >
          <span>{isFiltersExpanded ? 'Hide' : 'Show'} Advanced Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Advanced Filters - Only shown when expanded */}
        {isFiltersExpanded && (
          <div id="advanced-filters-section" role="region" aria-label="Advanced filters">
            <div className={`grid grid-cols-1 md:grid-cols-${hasCategorization ? '3' : '2'} gap-3`}>
              {hasCategorization ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(subscriptions.map((s) => s.category))).sort().map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm"
                     role="status"
                     aria-label="Category filter is a Pro feature"
                >
                  Category filter is a Pro feature. <a href="/" className="underline font-semibold">Upgrade to Pro</a> to filter by category.
                </div>
              )}

              <select
                value={billing}
                onChange={(e) => setBilling(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by billing cycle"
              >
                <option value="all">All Billing Cycles</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by currency"
              >
                <option value="all">All Currencies</option>
                {currencyOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min price"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Maximum price"
                />
              </div>
              <select
                value={trial}
                onChange={(e) => setTrial(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by trial status"
              >
                <option value="all">All Trials</option>
                <option value="trial">Trials only</option>
                <option value="nontrial">Non-trials (paid)</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="From"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter from date"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter to date"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length > 0 ? (
        <>
          {/* Screen reader announcement for results */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            Showing {visibleSubscriptions.length} of {filteredSubscriptions.length} subscriptions
          </div>

          {/* Subscription Cards */}
          <div className="space-y-3 md:grid md:grid-cols-1 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 md:space-y-0">
            {visibleSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={handleEdit}
                onDelete={handleDelete}
                preferredCurrency={userSettings?.defaultCurrency || subscription.currency}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 md:p-12 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {filter !== 'all' ? 'No matching subscriptions' : 'No subscriptions yet'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed px-2">
            {filter !== 'all'
              ? `No ${filter} subscriptions match your current filters. Try adjusting your search criteria.`
              : 'Start tracking your subscriptions to get insights into your recurring expenses and manage them effectively.'}
          </p>
          {filter === 'all' && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="accent" 
              size="md"
              className="w-full sm:w-auto inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="whitespace-nowrap">Add Your First Subscription</span>
            </Button>
          )}
          {filter !== 'all' && (
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                  setCategory('all');
                  setBilling('all');
                  setCurrency('all');
                  setTrial('all');
                  setPriceMin('');
                  setPriceMax('');
                  setDateFrom('');
                  setDateTo('');
                  setSortBy('renewalDate-asc');
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      {filteredSubscriptions.length > visibleCount && (
        <div ref={sentinelRef} className="h-8 w-full" aria-hidden="true" />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
        size="lg"
      >
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Mobile Filter Drawer */}
      {isMobileFiltersOpen && (
      <div
        className="fixed inset-0 z-50 md:hidden transition-transform duration-300 translate-x-0"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileFiltersOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Filter Presets */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Filters</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setFilter('active');
                    setCategory('all');
                    setBilling('all');
                    setCurrency('all');
                    setTrial('all');
                    setPriceMin('');
                    setPriceMax('');
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 font-medium transition-colors"
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setFilter('all');
                    setCategory('all');
                    setBilling('all');
                    setCurrency('all');
                    setTrial('all');
                    setPriceMin('');
                    setPriceMax('');
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 font-medium transition-colors"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    setFilter('active');
                    setDateFrom(today.toISOString().split('T')[0]);
                    setDateTo(nextWeek.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 font-medium transition-colors"
                >
                  Upcoming
                </button>
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search name, category, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Search subscriptions"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All', count: subscriptions.length },
                  { value: 'active', label: 'Active', count: subscriptions.filter((s) => s.isActive).length },
                  { value: 'inactive', label: 'Inactive', count: subscriptions.filter((s) => !s.isActive).length },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      filter === option.value
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    aria-pressed={filter === option.value}
                  >
                    <span>{option.label}</span>
                    <span className="text-sm opacity-75">({option.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {hasCategorization && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(subscriptions.map((s) => s.category))).sort().map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Billing Cycle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Billing Cycle
              </label>
              <select
                value={billing}
                onChange={(e) => setBilling(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by billing cycle"
              >
                <option value="all">All Billing Cycles</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {/* Currency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by currency"
              >
                <option value="all">All Currencies</option>
                {currencyOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* Trial Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trial Status
              </label>
              <select
                value={trial}
                onChange={(e) => setTrial(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by trial status"
              >
                <option value="all">All</option>
                <option value="trial">Trials only</option>
                <option value="nontrial">Non-trials (paid)</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Next Renewal Date
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  placeholder="From"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter from date"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter to date"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sort subscriptions"
              >
                <option value="renewalDate-asc">Renewal Date (Earliest)</option>
                <option value="renewalDate-desc">Renewal Date (Latest)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={() => {
                setSearch('');
                setFilter('active');
                setCategory('all');
                setBilling('all');
                setPriceMin('');
                setPriceMax('');
                setTrial('all');
                setDateFrom('');
                setDateTo('');
                setCurrency('all');
                setSortBy('renewalDate-asc');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

