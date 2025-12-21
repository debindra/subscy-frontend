'use client';

import { useRouter } from 'next/navigation';
import {
  useSubscription,
  useCustomerPortal,
  isPaidPlan,
} from '@/lib/hooks/useBilling';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function BillingPage() {
  const router = useRouter();
  const { data: subscription, isLoading } = useSubscription();
  const { openPortal, isLoading: isPortalLoading } = useCustomerPortal();

  const handleManageSubscription = async () => {
    try {
      await openPortal();
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'past_due':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string, isTrial: boolean) => {
    if (isTrial) return 'Trial';
    switch (status) {
      case 'active':
        return 'Active';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400" />
      </div>
    );
  }

  const isFreePlan = !isPaidPlan(subscription);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and billing details.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Plan
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subscription?.display_name || 'Starter'} Plan
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                subscription?.status || 'active'
              )}`}
            >
              {getStatusLabel(
                subscription?.status || 'active',
                subscription?.is_trial || false
              )}
            </span>
          </div>

          {subscription?.is_trial && subscription?.trial_ends_at && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-400">
                Your trial ends on{' '}
                <strong>{formatDate(subscription.trial_ends_at)}</strong>. After
                this, your card will be charged.
              </p>
            </div>
          )}

          {subscription?.cancel_at_period_end && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-amber-700 dark:text-amber-400">
                Your subscription will end on{' '}
                <strong>{formatDate(subscription.current_period_end)}</strong>.
                You can reactivate it before this date.
              </p>
            </div>
          )}

          {subscription?.status === 'past_due' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400">
                Your payment is past due. Please update your payment method to
                avoid service interruption.
              </p>
            </div>
          )}

          {!isFreePlan && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Billing Cycle
                </p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {subscription?.billing_cycle || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subscription?.is_trial ? 'Trial Ends' : 'Next Billing Date'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(
                    subscription?.is_trial
                      ? subscription?.trial_ends_at
                      : subscription?.current_period_end || null
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {isFreePlan ? (
              <Button
                onClick={() => router.push('/dashboard/plans')}
                variant="accent"
                fullWidth
              >
                Upgrade Plan
              </Button>
            ) : (
              <Button
                onClick={handleManageSubscription}
                disabled={isPortalLoading}
                variant="outline"
                fullWidth
              >
                {isPortalLoading ? 'Loading...' : 'Manage Subscription'}
              </Button>
            )}
          </div>
        </Card>

        {!isFreePlan && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What you can do in the Billing Portal
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <span>Update your payment method</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <span>View and download invoices</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <span>Change your billing cycle (monthly/annual)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <span>Upgrade or downgrade your plan</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <span>Cancel your subscription</span>
              </li>
            </ul>
          </Card>
        )}

        {isFreePlan && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Why Upgrade?
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Track unlimited subscriptions</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Advanced analytics and spending insights</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Push notifications for renewal reminders</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Export your data to CSV/PDF</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>14-day free trial, cancel anytime</span>
              </li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
