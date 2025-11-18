'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor, getCategoryIcon } from '@/lib/utils/icons';
import { Card } from '../ui/Card';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
}) => {
  const daysUntilRenewal = getDaysUntil(subscription.nextRenewalDate);
  const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
  const isOverdue = daysUntilRenewal < 0;
  const iconClasses = getSubscriptionColor(subscription.name, subscription.category);
  const subscriptionIcon = getSubscriptionIcon(subscription.name, subscription.category);

  return (
    <Card className="hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.7,-58.7C58.9,-49.1,69.2,-35.1,73.7,-19.3C78.1,-3.6,76.7,13.8,69.5,28.3C62.3,42.8,49.3,54.4,34.6,61.5C19.9,68.5,3.5,71,-13.2,71.1C-29.9,71.2,-47,68.9,-59.7,59.9C-72.4,50.9,-80.7,35.2,-83.5,18.3C-86.3,1.4,-83.6,-16.7,-75.8,-31.6C-68,-46.5,-55.1,-58.2,-40.3,-67.3C-25.5,-76.4,-9,-83,4.6,-88.6C18.2,-94.2,32.5,-68.3,45.7,-58.7Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative">
        {/* Header with Subscription Icon */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3.5 rounded-xl ${iconClasses} transition-transform group-hover:scale-105 shrink-0 [&_svg]:!text-current [&_svg]:h-10 [&_svg]:w-10`}>
            {subscriptionIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{subscription.name}</h3>
              {subscription.isTrial && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium shrink-0">
                  TRIAL
                </span>
              )}
              {!subscription.isActive && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium shrink-0">
                  Inactive
                </span>
              )}
              {isUpcoming && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium shrink-0">
                  Soon
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{subscription.category}</p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-4 p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
              {formatCurrency(subscription.amount, subscription.currency)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              / {subscription.billingCycle.replace('ly', '')}
            </span>
          </div>
        </div>

        {/* Renewal Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Next renewal</span>
            </div>
            <span className={`text-sm font-bold ${isOverdue ? 'text-red-600 dark:text-red-400' : isUpcoming ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatDate(subscription.nextRenewalDate)}
            </span>
          </div>

          {daysUntilRenewal >= 0 && (
            <div className={`flex items-center space-x-2 text-xs px-3 py-2 rounded-lg ${isUpcoming ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                {daysUntilRenewal === 0 ? 'Renews today!' : `${daysUntilRenewal} days remaining`}
              </span>
            </div>
          )}

          {isOverdue && (
            <div className="flex items-center space-x-2 text-xs px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Overdue by {Math.abs(daysUntilRenewal)} days</span>
            </div>
          )}
        </div>

        {/* Description */}
        {subscription.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {subscription.description}
          </p>
        )}

        {/* Website Link */}
        {subscription.website && (
          <a
            href={subscription.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Website
          </a>
        )}

        {/* Payment Method */}
        {subscription.paymentMethod && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
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
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => onEdit(subscription)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-500 border border-primary-600 dark:border-primary-400 rounded-lg transition-all duration-200 transform hover:scale-105"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(subscription.id)}
            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-400 rounded-lg transition-all duration-200 transform hover:scale-105"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

