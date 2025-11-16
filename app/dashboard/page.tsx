'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { analyticsApi, CurrencySpendingSummary, CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/lib/context/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { businessApi, PlanResponse } from '@/lib/api/business';

export default function DashboardPage() {
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [currencySummaries, setCurrencySummaries] = useState<CurrencySpendingSummary[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<number>(6);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [months]);

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

  const loadData = async () => {
    try {
      const [upcomingRes, spendingRes, categoryRes, monthlyRes] = await Promise.all([
        subscriptionsApi.getUpcoming(),
        analyticsApi.getSpending(),
        analyticsApi.getByCategory(),
        analyticsApi.getMonthlyTrend(months),
      ]);

      setUpcomingSubscriptions(upcomingRes.data);
      setCurrencySummaries(spendingRes.data);
      setCategoryData(categoryRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
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
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Spending Insights</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {plan && (
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {plan.accountType === 'business' ? 'Business Plan' : 'Personal Plan'}
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
      <SpendingChart categoryData={categoryData} monthlyData={monthlyData} />

      {/* Upcoming Renewals */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Renewals</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Subscriptions renewing in the next 7 days</p>
          </div>
          {upcomingSubscriptions.length > 0 && (
            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">
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
    </div>
  );
}

