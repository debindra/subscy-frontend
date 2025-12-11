'use client';

import React, { useMemo } from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { SubscriptionStats } from '@/lib/api/analytics';
import { Card } from '../ui/Card';
import { formatCurrency, getDaysUntil } from '@/lib/utils/format';

interface SubscriptionHealthProps {
  subscriptions: Subscription[];
  stats: SubscriptionStats;
  totalMonthlySpending?: number;
  preferredCurrency?: string;
}

export const SubscriptionHealth: React.FC<SubscriptionHealthProps> = ({
  subscriptions,
  stats,
  totalMonthlySpending,
  preferredCurrency = 'USD'
}) => {
  const healthMetrics = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(s => s.isActive);
    const trials = subscriptions.filter(s => s.isTrial);
    const expiringTrials = trials.filter(trial => {
      if (!trial.trialEndDate) return false;
      const daysUntilEnd = getDaysUntil(trial.trialEndDate);
      return daysUntilEnd <= 7 && daysUntilEnd >= 0;
    });

    // Use provided converted monthly spending or calculate from raw data
    const effectiveMonthlySpending = totalMonthlySpending !== undefined
      ? totalMonthlySpending
      : activeSubscriptions.reduce((total, sub) => {
          let monthlyAmount = sub.amount;
          if (sub.billingCycle === 'yearly') monthlyAmount = sub.amount / 12;
          else if (sub.billingCycle === 'quarterly') monthlyAmount = sub.amount / 3;
          else if (sub.billingCycle === 'weekly') monthlyAmount = sub.amount * 4.33;
          return total + monthlyAmount;
        }, 0);

    // Get payment method distribution
    const paymentMethods = activeSubscriptions.reduce((acc, sub) => {
      const method = sub.paymentMethod || 'other';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get category distribution
    const categories = activeSubscriptions.reduce((acc, sub) => {
      const category = sub.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMonthlySpending: effectiveMonthlySpending,
      trials: trials.length,
      expiringTrials: expiringTrials.length,
      paymentMethods,
      categories,
      averageMonthlyPerSubscription: activeSubscriptions.length > 0 ? effectiveMonthlySpending / activeSubscriptions.length : 0,
    };
  }, [subscriptions, totalMonthlySpending]);

  const paymentMethodLabels: Record<string, string> = {
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    'paypal': 'PayPal',
    'bank_transfer': 'Bank Transfer',
    'apple_pay': 'Apple Pay',
    'google_pay': 'Google Pay',
    'other': 'Other',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Health</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active vs Inactive Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subscription Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.active}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Inactive</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {stats.inactive}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Trial Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trial Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Trials</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {healthMetrics.trials}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</span>
              <span className={`text-lg font-bold ${
                healthMetrics.expiringTrials > 0
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {healthMetrics.expiringTrials}
              </span>
            </div>
            {healthMetrics.expiringTrials > 0 && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  ⚠️ {healthMetrics.expiringTrials} trial{healthMetrics.expiringTrials > 1 ? 's' : ''} expiring in the next 7 days
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Methods
          </h3>
          <div className="space-y-3">
            {Object.entries(healthMetrics.paymentMethods)
              .sort(([,a], [,b]) => b - a)
              .map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {paymentMethodLabels[method] || method}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({stats.active > 0 ? Math.round((count / stats.active) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Spending Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Monthly</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(healthMetrics.totalMonthlySpending, preferredCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg per Subscription</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(healthMetrics.averageMonthlyPerSubscription, preferredCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.active}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};