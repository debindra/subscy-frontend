'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useBilling';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isUpgrade = searchParams.get('upgrade') === 'success';
  const { data: subscription, refetch } = useSubscription();
  const [isVerifying, setIsVerifying] = useState(!isUpgrade);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    // Poll for subscription status update
    const timer = setInterval(async () => {
      const result = await refetch();
      setPollCount((prev) => prev + 1);

      // Stop polling if we have a paid plan or we've polled too many times
      if (
        result.data &&
        (result.data.plan === 'pro' || result.data.plan === 'ultimate')
      ) {
        setIsVerifying(false);
        clearInterval(timer);
      }
    }, 2000);

    // Stop polling after 30 seconds (15 attempts)
    const timeout = setTimeout(() => {
      setIsVerifying(false);
      clearInterval(timer);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [refetch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Card className="max-w-md w-full text-center space-y-6 p-8">
        {isVerifying ? (
          <>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Setting up your subscription...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your payment.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isUpgrade ? 'Upgrade Successful!' : `Welcome to ${subscription?.display_name || 'Pro'}!`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isUpgrade
                ? `Your subscription has been upgraded to ${subscription?.display_name || 'Ultimate'}. Enjoy all premium features!`
                : subscription?.is_trial
                ? 'Your 14-day free trial has started. Enjoy all premium features!'
                : 'Your subscription is now active. Enjoy all premium features!'}
            </p>
            {subscription?.is_trial && subscription?.trial_ends_at && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Your trial ends on{' '}
                  <strong>
                    {new Date(subscription.trial_ends_at).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </strong>
                </p>
              </div>
            )}
            <div className="pt-4">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="accent"
                fullWidth
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
