'use client';

import React, { useEffect, useState } from 'react';
import { settingsApi, BudgetStatus } from '@/lib/api/settings';
import { formatCurrency } from '@/lib/utils/format';
import { Card } from '../ui/Card';

interface BudgetWidgetProps {
  monthlySpending: number;
  preferredCurrency?: string;
}

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({ monthlySpending, preferredCurrency = 'USD' }) => {
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Normalize currency code to uppercase (e.g., 'jpy' -> 'JPY')
  const normalizedCurrency = preferredCurrency?.toUpperCase() || 'USD';

  useEffect(() => {
    loadBudgetStatus();
  }, [monthlySpending]);

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
    return null; // Don't show widget if no budget is set
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

