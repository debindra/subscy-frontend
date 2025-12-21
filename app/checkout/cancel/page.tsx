'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Card className="max-w-md w-full text-center space-y-6 p-8">
        <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Checkout Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          No worries! Your checkout was cancelled and you weren&apos;t charged.
          You can try again whenever you&apos;re ready.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push('/dashboard/plans')}
            variant="outline"
            className="flex-1"
          >
            View Plans
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="accent"
            className="flex-1"
          >
            Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
