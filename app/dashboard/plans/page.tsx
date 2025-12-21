'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING } from '@/lib/constants/landing';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCheckout, useSubscription, useCustomerPortal, isPaidPlan, isActiveSubscription } from '@/lib/hooks/useBilling';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PlansPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { initiateCheckout, isLoading: checkoutLoading } = useCheckout();
  const { data: subscription, isLoading: subscriptionLoading } = useSubscription();
  const { openPortal, isLoading: isPortalLoading } = useCustomerPortal();
  const { showToast } = useToast();

  const handlePlanSelect = async (planName: string) => {
    const normalizedPlan = planName.toLowerCase();
    const currentPlan = subscription?.plan?.toLowerCase() || 'starter';
    const isCurrentPlan = normalizedPlan === currentPlan;
    const isActive = isActiveSubscription(subscription);

    // If user is already on this plan and it's active, open customer portal
    if (isCurrentPlan && isActive && user) {
      try {
        await openPortal();
      } catch (error: any) {
        console.error('Portal error:', error);
        showToast('Failed to open billing portal. Please try again.', 'error');
      }
      return;
    }

    // For paid plan changes, use portal
    if (user && isPaidPlan(subscription) && normalizedPlan !== currentPlan) {
      try {
        await openPortal();
      } catch (error: any) {
        console.error('Portal error:', error);
        showToast('Failed to open billing portal. Please try again.', 'error');
      }
      return;
    }

    // For Starter plan, just redirect to dashboard
    if (normalizedPlan === 'starter') {
      router.push('/dashboard');
      return;
    }

    // User is logged in, initiate checkout
    // DISABLED: Ultimate plan - can be re-enabled when Ultimate plan is restored
    if (normalizedPlan !== 'pro') {
      showToast('Invalid plan selected', 'error');
      return;
    }

    setLoadingPlan(planName);
    try {
      await initiateCheckout(
        normalizedPlan as 'pro',
        isAnnual ? 'annual' : 'monthly'
      );
    } catch (error: any) {
      console.error('Checkout error:', error);
      showToast(
        error?.response?.data?.detail || 'Failed to start checkout. Please try again.',
        'error'
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const isButtonLoading = (planName: string) => {
    return loadingPlan === planName || (checkoutLoading && loadingPlan === planName) || isPortalLoading;
  };

  const getButtonText = (planName: string) => {
    const normalizedPlan = planName.toLowerCase();
    const currentPlan = subscription?.plan?.toLowerCase() || 'starter';
    const isCurrentPlan = normalizedPlan === currentPlan;
    const isActive = isActiveSubscription(subscription);

    if (isButtonLoading(planName)) {
      return 'Processing...';
    }

    // If user is on this plan and it's active
    if (isCurrentPlan && isActive && user) {
      return 'Manage Subscription';
    }

    // If user is on Starter and viewing Starter
    if (normalizedPlan === 'starter' && currentPlan === 'starter' && user) {
      return 'Current Plan';
    }

    // If user is on a paid plan and viewing a lower tier
    if (user && isPaidPlan(subscription)) {
      if (normalizedPlan === 'starter') {
        return 'Go to Dashboard';
      }
    }

    // Default button text
    if (normalizedPlan === 'starter') {
      return 'Current Plan';
    }
    return 'Start 14-Day Trial';
  };

  const isPlanDisabled = (planName: string) => {
    if (!user) return false;
    const normalizedPlan = planName.toLowerCase();
    const currentPlan = subscription?.plan?.toLowerCase() || 'starter';
    const isCurrentPlan = normalizedPlan === currentPlan;
    const isActive = isActiveSubscription(subscription);

    // Disable if it's the current active plan (user should use "Manage Subscription" instead)
    // But allow if they want to upgrade/downgrade
    if (isCurrentPlan && isActive) {
      return false; // Allow clicking to open portal
    }

    return false;
  };

  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the plan that best fits your needs. All paid plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="relative inline-flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`relative px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  !isAnnual
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Monthly billing"
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`relative px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  isAnnual
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Yearly billing"
              >
                Yearly
                {isAnnual && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-0.5 shadow-md">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
            {isAnnual && (
              <p className="text-sm text-slate-600 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="font-semibold text-primary-600">Save $12.00 per year</span> with annual billing
              </p>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {PRICING.map((tier) => {
            const normalizedPlan = tier.name.toLowerCase();
            const currentPlan = subscription?.plan?.toLowerCase() || 'starter';
            const isCurrentPlan = normalizedPlan === currentPlan;
            const isActive = isActiveSubscription(subscription);
            const isCurrentActivePlan = isCurrentPlan && isActive && user;
            const monthlyPriceNum = tier.monthlyPrice === '$0' ? 0 : parseFloat(tier.monthlyPrice?.replace('$', '') || '0');
            const annualPriceNum = tier.annualPrice ? parseFloat(tier.annualPrice.replace('$', '')) : null;
            const effectiveMonthlyPrice = isAnnual && annualPriceNum ? (annualPriceNum / 12).toFixed(2) : null;

            return (
              <Card
                key={tier.name}
                className={`relative p-6 sm:p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? 'border-primary-400 shadow-2xl lg:scale-[1.02]'
                    : isCurrentActivePlan
                    ? 'border-primary-300 shadow-xl ring-2 ring-primary-200'
                    : 'border-slate-200 hover:border-primary-300 hover:shadow-xl'
                }`}
              >
                {/* Badge */}
                {isCurrentActivePlan ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Current Plan
                    </span>
                  </div>
                ) : tier.highlighted ? (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl ring-4 ring-brand-accent-200/50">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Most Popular
                    </span>
                  </div>
                ) : null}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{tier.description}</p>
                </div>

                {/* Pricing Display */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                      {isAnnual && tier.annualPrice ? tier.annualPrice : (tier.monthlyPrice || '$0')}
                    </span>
                    {tier.monthlyPrice === '$0' ? (
                      <span className="text-base text-slate-500 dark:text-gray-400 font-medium">forever</span>
                    ) : (
                      <span className="text-base text-slate-500 dark:text-gray-400 font-medium">
                        {isAnnual && tier.annualPrice ? '/year' : '/month'}
                      </span>
                    )}
                  </div>
                  {effectiveMonthlyPrice && (
                    <p className="text-xs text-slate-600 dark:text-gray-400 mb-1.5">
                      <span className="font-semibold">${effectiveMonthlyPrice}/month</span> when billed annually
                    </p>
                  )}
                  {tier.monthlyPrice !== '$0' && (
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        14-day free trial • No credit card required
                      </p>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={`${tier.name}-${feature}-${index}`} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePlanSelect(tier.name)}
                  disabled={isButtonLoading(tier.name) || isPlanDisabled(tier.name)}
                  variant={isCurrentActivePlan ? 'accent' : tier.highlighted ? 'accent' : 'outline'}
                  fullWidth
                  className="mt-auto"
                >
                  {isButtonLoading(tier.name) ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    getButtonText(tier.name)
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

