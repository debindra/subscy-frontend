'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Subscription } from '@/lib/api/subscriptions';
import { SubscriptionCard } from './SubscriptionCard';
import { Card } from '../ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { useOptimizedBulkCurrencyConversion } from '@/lib/hooks/useOptimizedCurrencyConversion';
import { useUpcomingSubscriptions } from '@/lib/hooks/useSubscriptions';

interface EnhancedUpcomingRenewalsProps {
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  preferredCurrency?: string;
}

export const EnhancedUpcomingRenewals: React.FC<EnhancedUpcomingRenewalsProps> = ({
  onEdit,
  onDelete,
  preferredCurrency = 'USD',
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const days = parseInt(timeRange);

  // Fetch subscriptions based on the selected time range
  const {
    data: subscriptions = [],
    isLoading,
  } = useUpcomingSubscriptions(days);

  // Display subscriptions in the order they come from the endpoint (no sorting)
  const filteredSubscriptions = subscriptions;

  // Group subscription amounts by currency for bulk conversion
  const amountsByCurrency = useMemo(() => {
    const amounts: Record<string, number> = {};
    filteredSubscriptions.forEach(sub => {
      const currency = sub.currency || 'USD';
      amounts[currency] = (amounts[currency] || 0) + sub.amount;
    });
    return amounts;
  }, [filteredSubscriptions]);

  // Use optimized bulk currency conversion for total amount
  const { data: totalConvertedAmount, isLoading: isConverting } = useOptimizedBulkCurrencyConversion({
    amountsByCurrency,
    toCurrency: preferredCurrency,
  });

  const renewalStats = useMemo(() => {
    // Use converted amount if available, otherwise use simple sum as fallback
    const totalAmount = totalConvertedAmount !== undefined
      ? totalConvertedAmount
      : filteredSubscriptions.reduce((total, sub) => total + sub.amount, 0);

    return {
      totalAmount,
      upcomingCount: filteredSubscriptions.length,
      isConverted: totalConvertedAmount !== undefined,
    };
  }, [filteredSubscriptions, totalConvertedAmount]);


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming renewals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Subscriptions renewing and trials expiring in the next {timeRange} days.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Time range:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7' | '30' | '90')}
              className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary
      {filteredSubscriptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                  Total Amount
                </p>
                {isConverting && (
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                {!isConverting && renewalStats.isConverted && (
                  <div className="flex items-center text-xs text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Converted
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {isConverting ? (
                  <span className="inline-block w-16 h-6 bg-blue-200 dark:bg-blue-700 rounded animate-pulse" />
                ) : renewalStats.totalAmount !== null ? (
                  formatCurrency(renewalStats.totalAmount, preferredCurrency)
                ) : (
                  formatCurrency(renewalStats.totalAmount || 0, preferredCurrency)
                )}
              </p>
              {!isConverting && !renewalStats.isConverted && Object.keys(amountsByCurrency).length > 1 && (
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                  Approximate total (conversion unavailable)
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                Upcoming
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {renewalStats.upcomingCount}
              </p>
            </div>
          </Card>
        </div>
      )} */}

      {/* Subscriptions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription, index) => (
            <div key={subscription.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <SubscriptionCard
                subscription={subscription}
                onEdit={onEdit}
                onDelete={onDelete}
                preferredCurrency={preferredCurrency}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-full shadow-lg">
                <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              All Clear! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              No upcoming renewals or trial expirations in the next {timeRange} days. You're all set!
            </p>
            <Link
              href="/dashboard/subscriptions"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Subscriptions
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};