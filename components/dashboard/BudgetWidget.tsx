'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { settingsApi, BudgetStatus } from '@/lib/api/settings';
import { formatCurrency } from '@/lib/utils/format';
import { Card } from '../ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';

interface BudgetWidgetProps {
  monthlySpending: number;
  preferredCurrency?: string;
}

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({ monthlySpending, preferredCurrency = 'USD' }) => {
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Normalize currency code to uppercase (e.g., 'jpy' -> 'JPY')
  const normalizedCurrency = preferredCurrency?.toUpperCase() || 'USD';

  const { user, loading: authLoading, sessionReady } = useAuth();

  useEffect(() => {
    // Only load budget status if user is authenticated AND session token is ready
    if (!authLoading && user && sessionReady) {
      loadBudgetStatus();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [monthlySpending, user, authLoading, sessionReady]);

  const loadBudgetStatus = async () => {
    try {
      const response = await settingsApi.getBudgetStatus(monthlySpending);
      setBudgetStatus(response.data);
    } catch (error) {
      console.error('Error loading budget status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!budgetStatus || !budgetStatus.budgetAmount) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No monthly budget set yet
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Set a monthly budget so we can show you how close your subscriptions are to your limit.
            </p>
          </div>
          <Link
            href="/dashboard/settings#budget"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Set budget
          </Link>
        </div>
      </Card>
    );
  }

  const { budgetAmount, spendingAmount, percentageUsed, withinBudget, alertTriggered } = budgetStatus;

  // Determine progress bar color
  let progressColor = 'bg-green-500';
  if (percentageUsed && percentageUsed >= 100) {
    progressColor = 'bg-red-500';
  } else if (percentageUsed && percentageUsed >= 90) {
    progressColor = 'bg-orange-500';
  } else if (percentageUsed && percentageUsed >= 75) {
    progressColor = 'bg-yellow-500';
  }

  return (
    <Card className={alertTriggered ? 'border-2 border-orange-500' : ''}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Budget
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(spendingAmount, normalizedCurrency)} of {formatCurrency(budgetAmount, normalizedCurrency)}
          </p>
        </div>
        {alertTriggered && (
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
            Alert
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${progressColor} transition-all duration-500`}
          style={{ width: `${Math.min(percentageUsed || 0, 100)}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="flex justify-between items-center text-sm">
        <span className={`font-medium ${
          withinBudget 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {percentageUsed?.toFixed(1)}% used
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {formatCurrency(budgetAmount - spendingAmount, normalizedCurrency)} remaining
        </span>
      </div>

      {/* Alert Message */}
      {/* {alertTriggered && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm text-orange-700 dark:text-orange-400">
            ⚠️ You've reached {percentageUsed?.toFixed(0)}% of your monthly budget
          </p>
        </div>
      )} */}

      {/* Over Budget Message */}
      {/* {!withinBudget && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">
            🚨 You're over budget by {formatCurrency(spendingAmount - budgetAmount, normalizedCurrency)}
          </p>
        </div>
      )} */}
    </Card>
  );
};

