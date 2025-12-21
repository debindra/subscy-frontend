'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor } from '@/lib/utils/icons';
import { Card } from '../ui/Card';
import { useOptimizedCurrencyConversion } from '@/lib/hooks/useOptimizedCurrencyConversion';

interface DesktopSubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  preferredCurrency?: string;
}

export const DesktopSubscriptionCard: React.FC<DesktopSubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  preferredCurrency = 'USD',
}) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDoubleClick = () => {
    router.push(`/dashboard/subscriptions/${subscription.id}`);
  };

  // Lazy loading: only fetch conversion when card is flipped
  const { data: convertedAmount, isLoading: isConverting } = useOptimizedCurrencyConversion({
    amount: subscription.amount,
    fromCurrency: subscription.currency,
    toCurrency: preferredCurrency,
  });

  const daysUntilRenewal = getDaysUntil(subscription.nextRenewalDate);
  const isUpcoming = daysUntilRenewal > 0 && daysUntilRenewal <= 7;
  const iconClasses = getSubscriptionColor(subscription.name, subscription.category);
  const subscriptionIcon = getSubscriptionIcon(subscription.name, subscription.category);

  // Enhanced UI for renewing today - prominent badge, glow effect, and visual indicators
  const isRenewingToday = daysUntilRenewal === 0;
  const cardClassName = "hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in relative overflow-hidden group cursor-pointer";
  
  const wrapperClassName = isRenewingToday
    ? "relative rounded-2xl animate-pulse-glow"
    : "";

  return (
    <div className={wrapperClassName}>
      {/* "TODAY" Badge - Top Right Corner with Google-style shimmer animation (outside Card to avoid clipping) */}
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
        className={cardClassName} 
        variant="elevated"
        onDoubleClick={handleDoubleClick}
      >


      {/* Background Pattern */}
      {/* <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.7,-58.7C58.9,-49.1,69.2,-35.1,73.7,-19.3C78.1,-3.6,76.7,13.8,69.5,28.3C62.3,42.8,49.3,54.4,34.6,61.5C19.9,68.5,3.5,71,-13.2,71.1C-29.9,71.2,-47,68.9,-59.7,59.9C-72.4,50.9,-80.7,35.2,-83.5,18.3C-86.3,1.4,-83.6,-16.7,-75.8,-31.6C-68,-46.5,-55.1,-58.2,-40.3,-67.3C-25.5,-76.4,-9,-83,4.6,-88.6C18.2,-94.2,32.5,-68.3,45.7,-58.7Z" transform="translate(100 100)" />
        </svg>
      </div> */}

      <div className="relative">
        {/* Header with Subscription Icon */}
        <div className="flex items-center space-x-4 mb-5">
          <div className={`p-3 md:p-3.5 rounded-2xl ${iconClasses} transition-transform group-hover:scale-105 shrink-0 [&_svg]:!text-current [&_svg]:h-10 [&_svg]:w-10 md:[&_svg]:h-12 md:[&_svg]:w-12 shadow-md`}>
            {subscriptionIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight">{subscription.name}</h3>

              {/* Unified Status Indicator System */}
              <div className="flex flex-wrap gap-1.5" role="status" aria-label="Subscription status indicators">
                {/* Primary Status - Active/Inactive */}
                {/* <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full font-semibold border shadow-sm transition-all duration-200 ${
                    !subscription.isActive
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                  }`}
                  aria-label={`${subscription.isActive ? 'Active' : 'Inactive'} subscription`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    {!subscription.isActive ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    )}
                  </svg>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </span> */}

                {/* Trial Status */}
                {subscription.isTrial && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-700 shadow-sm transition-all duration-200"
                    aria-label="Trial subscription"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Trial
                  </span>
                )}

                {/* Renewal Status - Upcoming */}
                {/* {isUpcoming && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-700 shadow-sm transition-all duration-200"
                    aria-label="Subscription renewing soon"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Soon
                  </span>
                )} */}

                {/* Notification Needed Badge */}
                {/* {subscription.needToNotify && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-700 shadow-sm animate-pulse"
                    aria-label="Notification reminder scheduled"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Reminder
                  </span>
                )} */}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">{subscription.category}</p>
              {subscription.plan && (
                <>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{subscription.plan}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Pricing Section with Flip Animation */}
        <div
          className="mb-4 p-4 bg-gradient-to-br  dark:from-primary-900/25 dark:to-primary-800/25 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-primary-200/50 dark:border-primary-700/30 relative overflow-hidden"
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click to convert to your preferred currency"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-primary-300/20 dark:from-primary-600/10 dark:to-primary-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative w-full h-12">
            {/* Original Currency (Front) */}
            <div className={`absolute inset-0 flex items-baseline space-x-1 transition-all duration-500 ${isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100'}`}>
              <span className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                {formatCurrency(subscription.amount, subscription.currency)}
              </span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                / {(() => {
                  const cycle = subscription.billingCycle.replace('ly', '');
                  return cycle.charAt(0).toUpperCase() + cycle.slice(1);
                })()}
              </span>
            </div>

            {/* Converted Currency (Back) */}
            <div className={`absolute inset-0 flex items-baseline space-x-1 transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 rotate-y-180'}`}>
              <span className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                {isConverting ? (
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Converting...</span>
                  </div>
                ) : convertedAmount ? (
                  formatCurrency(convertedAmount, preferredCurrency)
                ) : (
                  formatCurrency(subscription.amount, subscription.currency)
                )}
              </span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                / {(() => {
                  const cycle = subscription.billingCycle.replace('ly', '');
                  return cycle.charAt(0).toUpperCase() + cycle.slice(1);
                })()}
              </span>
            </div>
          </div>

          {/* Enhanced Flip Indicator */}
          <div className="absolute top-2 right-2 flex items-center space-x-1.5 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full border border-primary-200 dark:border-primary-700 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800">
            <svg className="w-3 h-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {isFlipped ? 'Original' : 'Convert'}
            </span>
          </div>
        </div>

        {/* Renewal Information */}
        <div className="space-y-2 mb-4">
          {/* Next Renewal Date */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            isRenewingToday 
              ? 'bg-brand-accent-50 dark:bg-brand-accent-900/30 border-2 border-brand-accent-200 dark:border-brand-accent-700' 
              : 'bg-gray-50 dark:bg-gray-700/50'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <svg className={`w-4 h-4 ${isRenewingToday ? 'text-brand-accent-600 dark:text-brand-accent-400' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`font-medium ${isRenewingToday ? 'text-brand-accent-700 dark:text-brand-accent-300 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                {isRenewingToday ? 'Renewing Today!' : 'Next renewal'}
              </span>
            </div>
            <span className={`text-sm font-bold ${isRenewingToday ? 'text-brand-accent-700 dark:text-brand-accent-300' : isUpcoming ? 'text-brand-accent-600 dark:text-brand-accent-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatDate(subscription.nextRenewalDate)}
            </span>
          </div>

          {/* Days Remaining Status (hidden when renewing today since we have prominent badge) */}
          {daysUntilRenewal > 0 && !isRenewingToday && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-semibold ${
                isUpcoming
                  ? 'bg-brand-accent-50 dark:bg-brand-accent-900/20 text-brand-accent-700 dark:text-brand-accent-400 border border-brand-accent-200 dark:border-brand-accent-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
              }`}
              role="status"
              aria-label={`${daysUntilRenewal} days remaining`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>
                {`${daysUntilRenewal} days remaining`}
              </span>
            </div>
          )}
        </div>

        {/* Expandable Details Section */}
        {(subscription.description || subscription.website || subscription.paymentMethod) && (
          <div className="mb-4">
            {/* Expand/Collapse Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-2 transition-colors"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} additional details`}
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>

            {/* Expandable Content */}
            <div className={`space-y-3 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {/* Description */}
              {subscription.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {subscription.description}
                  </p>
                </div>
              )}

              {/* Website Link */}
              {subscription.website && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Website</p>
                  <a
                    href={subscription.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              )}

              {/* Payment Method */}
              {subscription.paymentMethod && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>💳</span>
                    <span>
                      {subscription.paymentMethod === 'credit_card' && 'Credit Card'}
                      {subscription.paymentMethod === 'debit_card' && 'Debit Card'}
                      {subscription.paymentMethod === 'paypal' && 'PayPal'}
                      {subscription.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                      {subscription.paymentMethod === 'apple_pay' && 'Apple Pay'}
                      {subscription.paymentMethod === 'google_pay' && 'Google Pay'}
                      {subscription.paymentMethod === 'other' && 'Other'}
                    </span>
                    {subscription.lastFourDigits && (
                      <span>•••• {subscription.lastFourDigits}</span>
                    )}
                    {subscription.cardBrand && (
                      <span>({subscription.cardBrand})</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reminder Information */}
        {subscription.reminderEnabled && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Reminder set for {subscription.reminderDaysBefore} days before
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => onEdit(subscription)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-500 border border-primary-600 dark:border-primary-400 rounded-lg transition-all duration-200 min-h-[44px] active:scale-95"
            title="Edit"
            aria-label={`Edit ${subscription.name}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="whitespace-nowrap">Edit</span>
          </button>

          <button
            onClick={() => onDelete(subscription.id)}
            className="flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-400 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] active:scale-95"
            title="Delete"
            aria-label={`Delete ${subscription.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
    </div>
  );
};

