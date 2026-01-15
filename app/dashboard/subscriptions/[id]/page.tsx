'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscriptions';
import { Subscription } from '@/lib/api/subscriptions';
import { useUpdateSubscription, useDeleteSubscription } from '@/lib/hooks/useSubscriptionMutations';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { getSubscriptionIcon, getSubscriptionColor } from '@/lib/utils/icons';
import { useToast } from '@/lib/context/ToastContext';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { calculateFutureRenewalDates } from '@/lib/utils/billingDates';
import { parseISO } from 'date-fns';
import Link from 'next/link';

// Calendar helper functions
function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // Monday start

  const weeks: Date[][] = [];
  let current = new Date(startDay);
  while (current <= lastDay || current.getDay() !== 1) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (current > lastDay && current.getDay() === 1) break;
  }
  return weeks;
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: subscription, isLoading } = useSubscription(id);
  const updateMutation = useUpdateSubscription();
  const deleteMutation = useDeleteSubscription();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(startOfMonth(new Date()));
  const { showToast } = useToast();

  usePageTitle(subscription?.name || 'Subscription Details');

  // Calculate future renewal dates including the current nextRenewalDate
  const futureRenewalDates = useMemo(() => {
    if (!subscription) return [];
    
    // Start with the current nextRenewalDate
    const currentRenewalDate = parseISO(subscription.nextRenewalDate);
    const dates: Date[] = [currentRenewalDate];
    
    // Calculate future renewals (adjust count based on billing cycle)
    const count = subscription.billingCycle === 'yearly' ? 3 : 
                  subscription.billingCycle === 'quarterly' ? 8 : 12;
    
    // Calculate additional future dates starting from the current nextRenewalDate
    const futureDates = calculateFutureRenewalDates(
      subscription.nextRenewalDate,
      subscription.billingCycle,
      count
    );
    
    // Combine current date with future dates
    return [...dates, ...futureDates];
  }, [subscription]);

  // Create a Set of renewal dates for quick lookup
  const renewalDatesSet = useMemo(() => {
    return new Set(
      futureRenewalDates.map(date => date.toDateString())
    );
  }, [futureRenewalDates]);

  // Calendar calculations - MUST be before any early returns
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const monthName = calendarMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const handleDelete = () => {
    if (!subscription) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subscription) return false;

    try {
      await deleteMutation.mutateAsync(subscription.id);
      showToast('Subscription deleted successfully', 'success');
      router.push('/dashboard/subscriptions');
      return true;
    } catch (error) {
      showToast('Failed to delete subscription', 'error');
      return false;
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
  const isUpcoming = daysUntil > 0 && daysUntil <= 7;
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {subscription.name}
                </h1>
              </div>
              {/* Unified Status Indicator System */}
              <div className="flex flex-wrap gap-1.5" role="status" aria-label="Subscription status indicators">
                {/* Primary Status - Active/Inactive */}
                <span
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
                </span>

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
                {isUpcoming && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-700 shadow-sm transition-all duration-200"
                    aria-label="Subscription renewing soon"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Soon
                  </span>
                )}

                {/* Notification Needed Badge */}
                {subscription.needToNotify && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-700 shadow-sm animate-pulse"
                    aria-label="Notification reminder scheduled"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Reminder
                  </span>
                )}
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
                  isUpcoming ? 'text-amber-500' : 'text-blue-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    isUpcoming ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" :
                    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  } />
                </svg>
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-md ${
                isUpcoming 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {daysUntil === 0 
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

        {/* Upcoming Renewals Calendar */}
        <Card className="mb-6" padding="md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Renewals Calendar</h2>
          </div>

          <div className="space-y-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
                className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
                aria-label="Previous month"
              >
                Prev
              </button>
              <div className="px-4 py-2 font-semibold text-gray-900 dark:text-white text-sm">
                {monthName}
              </div>
              <button
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
                aria-label="Next month"
              >
                Next
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid grid-cols-7 gap-px sm:gap-1 md:gap-2 w-full">
                {/* Day Headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div
                    key={d}
                    className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-2 text-center"
                  >
                    {d}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {matrix.flat().map((day) => {
                  const isCurrentMonth = day.getMonth() === month;
                  const isRenewalDate = renewalDatesSet.has(day.toDateString());
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={day.toDateString()}
                      className={`min-h-[80px] sm:min-h-[100px] rounded-lg border p-1 sm:p-2 flex flex-col transition-all ${
                        isCurrentMonth
                          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800'
                      } ${isRenewalDate ? 'ring-2 ring-primary-500 dark:ring-primary-400 shadow-md' : ''}`}
                    >
                      <div className={`text-xs sm:text-sm font-medium ${
                        isCurrentMonth 
                          ? isToday 
                            ? 'text-primary-600 dark:text-primary-400 font-bold' 
                            : 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {day.getDate()}
                      </div>
                      {isRenewalDate && (
                        <div className="mt-1 flex-1 flex items-center">
                          <div className="w-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate font-medium">
                            Renewal
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-primary-500 dark:border-primary-400"></div>
                <span>Renewal Date</span>
              </div>
            </div>
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
        <div className="flex flex-row gap-3">
          <Button
            onClick={() => setShowEditForm(true)}
            variant="accent"
            className="w-[70%] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Subscription
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="w-[30%] flex items-center justify-center gap-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={subscription?.name}
        title="Delete subscription"
        confirmLabel="Delete subscription"
      />
    </div>
  );
}

