'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscriptions';
import { useUpdateSubscription, useDeleteSubscription } from '@/lib/hooks/useSubscriptionMutations';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor } from '@/lib/utils/icons';
import { useToast } from '@/lib/context/ToastContext';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import Link from 'next/link';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: subscription, isLoading } = useSubscription(id);
  const updateMutation = useUpdateSubscription();
  const deleteMutation = useDeleteSubscription();
  const [showEditForm, setShowEditForm] = useState(false);
  const { showToast } = useToast();

  usePageTitle(subscription?.name || 'Subscription Details');

  const handleDelete = async () => {
    if (!subscription) return;

    if (confirm(`Are you sure you want to delete "${subscription.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(subscription.id);
        showToast('Subscription deleted successfully', 'success');
        router.push('/dashboard/subscriptions');
      } catch (error) {
        showToast('Failed to delete subscription', 'error');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    if (!subscription) return;

    try {
      await updateMutation.mutateAsync({ id: subscription.id, data });
      setShowEditForm(false);
      showToast('Subscription updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update subscription', 'error');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="mt-4 text-sm text-slate-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Subscription not found</h2>
          <Link
            href="/dashboard/subscriptions"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2 text-white font-semibold transition-all hover:bg-primary-700"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const daysUntil = getDaysUntil(subscription.nextRenewalDate);
  const isUpcoming = daysUntil >= 0 && daysUntil <= 7;
  const isOverdue = daysUntil < 0;
  const subscriptionIcon = getSubscriptionIcon(subscription.name || '', subscription.category || '');
  const subscriptionIconColor = getSubscriptionColor(subscription.name || '', subscription.category || '');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/dashboard/subscriptions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Subscriptions
        </Link>

        {/* Hero Section with Icon and Main Info */}
        <Card className="mb-6" padding="lg">
          <div className="flex flex-row items-start gap-3 sm:gap-6 mb-4">
            {/* Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center ${subscriptionIconColor} shrink-0 [&_svg]:!text-current [&_svg]:h-10 [&_svg]:w-10 sm:[&_svg]:h-12 sm:[&_svg]:w-12 shadow-md`}>
              {subscriptionIcon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {subscription.name}
                </h1>
                {subscription.isTrial && (
                  <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md">
                    Trial
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                  subscription.isActive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing - Full Width */}
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200/80 dark:border-primary-700/50 w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary-700 dark:text-primary-400">
                {formatCurrency(subscription.amount, subscription.currency)}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize font-semibold">
                / {(subscription.billingCycle || 'monthly').replace('ly', '')}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Category: {subscription.category || 'Uncategorized'}
              </p>
              {subscription.plan && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Plan: {subscription.plan}
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Renewal Info */}
        <Card className="mb-6" padding="md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Renewal Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-slate-600 dark:text-slate-400">Next Renewal</span>
              </div>
              <span className="text-base font-semibold text-slate-900 dark:text-white">
                {formatDate(subscription.nextRenewalDate)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <svg className={`w-5 h-5 ${
                  isOverdue ? 'text-red-500' : isUpcoming ? 'text-amber-500' : 'text-blue-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    isOverdue ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" :
                    isUpcoming ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" :
                    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  } />
                </svg>
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-md ${
                isOverdue 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                  : isUpcoming 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {isOverdue 
                  ? `${Math.abs(daysUntil)} days overdue` 
                  : daysUntil === 0 
                    ? 'Today' 
                    : daysUntil === 1 
                      ? 'Tomorrow' 
                      : `${daysUntil} days`}
              </span>
            </div>

            {subscription.reminderEnabled && (
              <div className="flex items-center justify-between py-3 border-t border-slate-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Reminder</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {subscription.reminderDaysBefore} days before
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Details */}
        {(subscription.description || subscription.website || subscription.paymentMethod || subscription.email) && (
          <Card className="mb-6" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Additional Details</h2>
            </div>
            
            <div className="space-y-4">
              {subscription.description && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{subscription.description}</p>
                </div>
              )}
              
              {subscription.website && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Website</span>
                  </div>
                  <a
                    href={subscription.website.startsWith('http') ? subscription.website : `https://${subscription.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                  >
                    {subscription.website}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
              
              {subscription.email && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{subscription.email}</p>
                </div>
              )}
              
              {subscription.paymentMethod && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Payment Method</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 capitalize mb-1">
                    {(subscription.paymentMethod || '').replace('_', ' ')}
                  </p>
                  {subscription.lastFourDigits && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      •••• {subscription.lastFourDigits}
                      {subscription.cardBrand && ` (${subscription.cardBrand})`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Trial Info */}
        {subscription.isTrial && subscription.trialEndDate && (
          <Card className="mb-6" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Trial Information</h2>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trial Ends</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {formatDate(subscription.trialEndDate)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowEditForm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-accent-500 hover:bg-brand-accent-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Subscription
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)} title="Edit Subscription">
        <SubscriptionForm
          subscription={subscription}
          onSubmit={handleSubmit}
          onCancel={() => setShowEditForm(false)}
        />
      </Modal>
    </div>
  );
}

