'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor } from '@/lib/utils/icons';
import { Card } from '../ui/Card';

interface CompactSubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  preferredCurrency?: string;
}

export const CompactSubscriptionCard: React.FC<CompactSubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  preferredCurrency = 'USD',
}) => {
  const router = useRouter();
  const daysUntilRenewal = getDaysUntil(subscription.nextRenewalDate);
  const isUpcoming = daysUntilRenewal > 0 && daysUntilRenewal <= 7;
  const iconClasses = getSubscriptionColor(subscription.name, subscription.category);
  const subscriptionIcon = getSubscriptionIcon(subscription.name, subscription.category);

  const handleDoubleClick = () => {
    router.push(`/dashboard/subscriptions/${subscription.id}`);
  };

  // Enhanced UI for renewing today - prominent badge and visual indicators
  const isRenewingToday = daysUntilRenewal === 0;
  const cardClassName = "hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in relative overflow-hidden group cursor-pointer";

  return (
    <div className={isRenewingToday ? "relative rounded-2xl animate-pulse-glow" : ""}>
      {/* "RENEWS TODAY" Badge - Top Right Corner with Google-style shimmer animation (outside Card to avoid clipping) */}
      {isRenewingToday && (
        <div className="absolute -top-1.5 -right-1.5 z-20">
          <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-shimmer-glow overflow-hidden">
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
            <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
          </div>
        </div>
      )}
      <Card className={cardClassName} variant="elevated" onDoubleClick={handleDoubleClick}>

      <div className="p-4">
        {/* Compact Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-3.5 rounded-xl ${iconClasses} transition-transform group-hover:scale-105 shrink-0 [&_svg]:!text-current [&_svg]:h-10 [&_svg]:w-10 shadow-md`}>
            {subscriptionIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">{subscription.name}</h3>
              <div className="flex items-center gap-1">
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full ${
                  !subscription.isActive ? 'bg-gray-400' :
                  isUpcoming ? 'bg-amber-500' :
                  'bg-green-500'
                }`} />
                {subscription.isTrial && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{subscription.category}</p>
              {subscription.plan && (
                <>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{subscription.plan}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compact Pricing */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
            {formatCurrency(subscription.amount, subscription.currency)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            / {(() => {
              const cycle = subscription.billingCycle.replace('ly', '');
              return cycle.charAt(0).toUpperCase() + cycle.slice(1);
            })()}
          </span>
        </div>

        {/* Compact Renewal Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(subscription.nextRenewalDate)}
          </span>
          <span className={`font-medium ${
            isUpcoming ? 'text-amber-600 dark:text-amber-400' :
            'text-gray-600 dark:text-gray-400'
          }`}>
            {isRenewingToday ? '' : // Hidden when renewing today since we have prominent badge
             `${daysUntilRenewal}d`}
          </span>
        </div>

        {/* Compact Actions */}
        <div className="flex space-x-2 pt-3 mt-3 border-t dark:border-gray-700">
          <button
            onClick={() => onEdit(subscription)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-500 border border-primary-600 dark:border-primary-400 rounded transition-all duration-200 min-h-[32px] active:scale-95"
            title="Edit"
            aria-label={`Edit ${subscription.name}`}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(subscription.id)}
            className="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-400 rounded transition-all duration-200 min-h-[32px] min-w-[32px] active:scale-95"
            title="Delete"
            aria-label={`Delete ${subscription.name}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
    </div>
  );
};

