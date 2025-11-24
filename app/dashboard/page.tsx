'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { BudgetWidget } from '@/components/dashboard/BudgetWidget';
import { BudgetSettingsModal } from '@/components/dashboard/BudgetSettingsModal';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { analyticsApi, CurrencySpendingSummary, CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/lib/context/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { businessApi, PlanResponse } from '@/lib/api/business';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';

export default function DashboardPage() {
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [currencySummaries, setCurrencySummaries] = useState<CurrencySpendingSummary[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<number>(6);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetRefreshKey, setBudgetRefreshKey] = useState(0);
  const { showToast } = useToast();
  const { hasCategorization, loading: planFeaturesLoading } = usePlanFeatures();
  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load category data separately with better error handling
      let categoryDataResult: CategorySpending[] = [];
      
      if (hasCategorization) {
        try {
          console.log('Loading category data... (hasCategorization:', hasCategorization, ')');
          const categoryRes = await analyticsApi.getByCategory();
          if (categoryRes && categoryRes.data) {
            categoryDataResult = Array.isArray(categoryRes.data) ? categoryRes.data : [];
            console.log('Category data loaded successfully:', categoryDataResult);
          } else {
            console.warn('Category API response missing data:', categoryRes);
          }
        } catch (categoryError: any) {
          console.error('Error loading category data:', categoryError);
          // Check if it's a 403 (forbidden) error
          if (categoryError?.response?.status === 403) {
            console.warn('Category analytics not available - user may need to upgrade plan');
            showToast('Category analytics requires Pro plan', 'info');
          } else {
            console.error('Unexpected error loading category data:', categoryError);
          }
          categoryDataResult = [];
        }
      } else {
        console.log('Skipping category data load - hasCategorization is false');
      }

      const [upcomingRes, spendingRes, monthlyRes] = await Promise.all([
        subscriptionsApi.getUpcoming(),
        analyticsApi.getSpending(),
        analyticsApi.getMonthlyTrend(months),
      ]);
      
      setUpcomingSubscriptions(upcomingRes.data);
      setCurrencySummaries(spendingRes.data);
      setCategoryData(categoryDataResult);
      setMonthlyData(monthlyRes.data);

    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [hasCategorization, months, showToast]);

  useEffect(() => {
    // Wait for plan features to load before fetching data
    if (!planFeaturesLoading) {
      loadData();
    }
  }, [loadData, planFeaturesLoading]);

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
        console.error('Failed to load plan information', error);
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

  // Calculate total monthly spending for budget widget
  // Prefer USD if available, otherwise use first currency
  const monthlySpending = useMemo(() => {
    if (currencySummaries.length === 0) return 0;
    
    // Try to find USD first
    const usdSummary = currencySummaries.find(s => s.currency === 'USD');
    if (usdSummary) {
      return usdSummary.monthlyTotal;
    }
    
    // Otherwise use first currency's monthly total
    return currencySummaries[0]?.monthlyTotal || 0;
  }, [currencySummaries]);

  const handleBudgetSettingsSave = () => {
    // Force budget widget to refresh by updating the key
    setBudgetRefreshKey(prev => prev + 1);
    showToast('Budget settings saved', 'success');
  };

  if (loading || planFeaturesLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          </div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                  <div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Overview of your subscriptions and spending
          </p>
        </div>
        <Link
          href="/dashboard/subscriptions"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white rounded-lg hover:from-brand-accent-600 hover:to-brand-accent-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Manage Subscriptions
        </Link>
      </div>

      {/* Stats Cards grouped by currency */}
      <div className="space-y-6">
        {currencySummaries.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currencySummaries.map((summary, index) => (
              <Card
                key={summary.currency}
                variant="glass"
                className="animate-scale-in transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-110">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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
        ) : (
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700/40 rounded-full">
                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No active subscriptions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add subscriptions to see spending summaries grouped by currency.
                </p>
              </div>
            </div>
          </Card>
        )}

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
          <BudgetWidget key={budgetRefreshKey} monthlySpending={monthlySpending} />
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
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
        <SpendingChart categoryData={categoryData} monthlyData={monthlyData} />
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

      {/* Upcoming Renewals */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Renewals</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Subscriptions renewing in the next 7 days</p>
          </div>
          {upcomingSubscriptions.length > 0 && (
            <span className="px-4 py-2 bg-brand-accent-100 dark:bg-brand-accent-900/30 text-brand-accent-700 dark:text-brand-accent-400 rounded-full text-sm font-bold">
              {upcomingSubscriptions.length} upcoming
            </span>
          )}
        </div>
        {upcomingSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSubscriptions.map((subscription, index) => (
              <div key={subscription.id} style={{animationDelay: `${index * 0.1}s`}}>
                <SubscriptionCard
                  subscription={subscription}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              All Clear!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming renewals in the next 7 days
            </p>
          </Card>
        )}
      </div>

      {/* Budget Settings Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleBudgetSettingsSave}
      />
    </div>
  );
}

