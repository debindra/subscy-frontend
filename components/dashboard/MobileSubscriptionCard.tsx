'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor } from '@/lib/utils/icons';
import { Card } from '../ui/Card';

interface MobileSubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  preferredCurrency?: string;
}

export const MobileSubscriptionCard: React.FC<MobileSubscriptionCardProps> = ({
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

  const handleCardClick = () => {
    // Only navigate on mobile devices
    router.push(`/dashboard/subscriptions/${subscription.id}`);
  };

  // Get days badge color based on status
  const getDaysBadgeColor = () => {
    if (isUpcoming) {
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    }
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
  };

  const daysBadgeText = daysUntilRenewal === 0 
    ? 'Today' 
    : `${daysUntilRenewal}d`;

  // Enhanced UI for renewing today - prominent badge and visual indicators
  const isRenewingToday = daysUntilRenewal === 0;
  const cardClassName = "hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in relative overflow-hidden group";

  return (
    <div className={isRenewingToday ? "relative rounded-2xl animate-pulse-glow" : ""}>
      {/* "RENEWS TODAY" Badge - Top Right Corner with Google-style shimmer animation (outside Card to avoid clipping) */}
      {isRenewingToday && (
        <div className="absolute -top-1.5 -right-1.5 z-20">
          <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-shimmer-glow overflow-hidden">
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
            <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
          </div>
        </div>
      )}
      <Card 
        className={`${cardClassName} cursor-pointer`} 
        padding="sm"
        variant="elevated"
        onClick={handleCardClick}
      >


      <div className="flex items-start gap-3">
        {/* Icon Container - rounded square */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconClasses} shrink-0 [&_svg]:!text-current [&_svg]:h-10 [&_svg]:w-10 shadow-md`}>
          {subscriptionIcon}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title - First Line */}
          <div className="mb-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-black dark:text-white leading-tight">
                {subscription.name}
              </h3>
              {/* Notification Needed Badge */}
              {subscription.needToNotify && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-700 animate-pulse"
                  aria-label="Notification reminder scheduled"
                >
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </span>
              )}
            </div>
            {subscription.plan && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subscription.plan}</p>
            )}
          </div>
          
          {/* Price and Days Badge - Second Line */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatCurrency(subscription.amount, subscription.currency)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                / {(() => {
                  const cycle = subscription.billingCycle.replace('ly', '');
                  return cycle.charAt(0).toUpperCase() + cycle.slice(1);
                })()}
              </span>
            </div>
            
            {/* Days Badge - aligned to the right (hidden when renewing today since we have prominent badge) */}
            {!isRenewingToday && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${getDaysBadgeColor()}`}>
              {daysBadgeText}
            </span>
            )}
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
};

