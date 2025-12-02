'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '@/lib/context/ToastContext';
import Link from 'next/link';

interface QuickActionsProps {
  subscriptionCount: number;
  upcomingCount: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  subscriptionCount,
  upcomingCount,
}) => {
  const { showToast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleQuickAdd = () => {
    // This would open a simplified subscription form
    showToast('Quick add feature coming soon!', 'info');
  };

  const handleImportSubscriptions = async () => {
    setIsImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('Subscription import feature coming soon!', 'info');
    } catch (error) {
      showToast('Failed to import subscriptions', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleMarkAllPaid = () => {
    showToast('Mark all as paid feature coming soon!', 'info');
  };

  const actions = [
    {
      title: 'Add Subscription',
      description: 'Quickly add a new subscription',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: handleQuickAdd,
      color: 'bg-brand-accent-500',
      textColor: 'text-brand-accent-600 dark:text-brand-accent-400',
    },
    {
      title: 'Import Subscriptions',
      description: 'Import from bank or credit card',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      onClick: handleImportSubscriptions,
      loading: isImporting,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Mark All Paid',
      description: 'Mark all upcoming as paid',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: handleMarkAllPaid,
      disabled: upcomingCount === 0,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'View All',
      description: 'Manage all subscriptions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: '/dashboard/subscriptions',
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{subscriptionCount} total subscriptions</span>
          {upcomingCount > 0 && (
            <>
              <span>•</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">
                {upcomingCount} upcoming
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const content = (
            <Card
              className={`p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={!action.href && !action.disabled ? action.onClick : undefined}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.color} bg-opacity-10 dark:bg-opacity-20 ${action.textColor}`}>
                  {action.loading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    action.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          );

          return action.href ? (
            <Link key={action.title} href={action.href}>
              {content}
            </Link>
          ) : (
            <div key={action.title}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Smart Notifications */}
      {upcomingCount > 0 && (
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                Renewal Alert
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                You have {upcomingCount} subscription{upcomingCount > 1 ? 's' : ''} renewing soon.
                Consider using "Mark All Paid" to update their status.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};