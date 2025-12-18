'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING } from '@/lib/constants/landing';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCheckout, useSubscription, useCustomerPortal, isPaidPlan, isActiveSubscription } from '@/lib/hooks/useBilling';
import { useToast } from '@/lib/context/ToastContext';

export function PricingSection() {
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

    // If user is on a paid plan and wants to change plan, redirect to portal
    if (user && isPaidPlan(subscription) && normalizedPlan !== currentPlan && (normalizedPlan === 'pro' || normalizedPlan === 'ultimate')) {
      try {
        await openPortal();
      } catch (error: any) {
        console.error('Portal error:', error);
        showToast('Failed to open billing portal. Please try again.', 'error');
      }
      return;
    }

    // For Starter plan, just redirect to signup or dashboard
    if (normalizedPlan === 'starter') {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/signup');
      }
      return;
    }

    // For paid plans, check if user is logged in
    if (!user) {
      // Store intended plan in session storage for post-signup redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'intendedPlan',
          JSON.stringify({
            plan: normalizedPlan,
            billingCycle: isAnnual ? 'annual' : 'monthly',
          })
        );
      }
      router.push('/auth/signup');
      return;
    }

    // User is logged in, initiate checkout
    if (normalizedPlan !== 'pro' && normalizedPlan !== 'ultimate') {
      showToast('Invalid plan selected', 'error');
      return;
    }

    setLoadingPlan(planName);
    try {
      await initiateCheckout(
        normalizedPlan as 'pro' | 'ultimate',
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
        // User is on Pro/Ultimate, viewing Starter - they can't downgrade to free
        return 'Go to Dashboard';
      }
      // User can upgrade/downgrade through portal
      if (normalizedPlan === 'pro' && currentPlan === 'ultimate') {
        return 'Downgrade to Pro';
      }
      if (normalizedPlan === 'ultimate' && currentPlan === 'pro') {
        return 'Upgrade to Ultimate';
      }
    }

    // Default button text
    if (normalizedPlan === 'starter') {
      return user ? 'Go to Dashboard' : 'Get Started Free';
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

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
            Pricing
          </span>
          <h2 id="pricing-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Simple, transparent pricing</h2>
          <p className="mt-4 sm:mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
            Start free with Starter plan for essential tracking, or upgrade to Pro for unlimited subscriptions and advanced budgeting, or Ultimate for team collaboration and data exports.
          </p>
          <p className="mt-4 sm:mt-5 mx-auto max-w-2xl text-sm sm:text-base text-slate-500 px-4 sm:px-0">
            All plans include a 14-day free trial. No credit card required to start.
          </p>

          {/* Savings Message */}
          <div className="mt-6 sm:mt-8 mx-auto max-w-2xl px-4 sm:px-0">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-brand-accent-50 rounded-2xl border border-primary-200/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    💡 Pro Tip: Most users save $240+ per year
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    The average user prevents 3 unwanted renewals in their first month, making Pro plan pay for itself in savings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Toggle - Enhanced */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="relative inline-flex items-center gap-2 sm:gap-4 bg-slate-100 p-1 sm:p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                  !isAnnual
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Monthly billing"
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                  isAnnual
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Yearly billing"
              >
                Yearly
              </button>
            </div>
            {isAnnual && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Save 16%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {PRICING.map((tier) => {
            const normalizedPlan = tier.name.toLowerCase();
            const currentPlan = subscription?.plan?.toLowerCase() || 'starter';
            const isCurrentPlan = normalizedPlan === currentPlan;
            const isActive = isActiveSubscription(subscription);
            const isCurrentActivePlan = isCurrentPlan && isActive && user;

            return (
            <article
              key={tier.name}
              className={`relative rounded-2xl border bg-white p-6 sm:p-8 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-primary-300 shadow-lg md:scale-105'
                  : isCurrentActivePlan
                  ? 'border-green-300 shadow-md ring-2 ring-green-200'
                  : 'border-slate-200 hover:border-primary-200 hover:shadow-md'
              }`}
            >
              {isCurrentActivePlan ? (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold text-white shadow-md z-10">
                  Current Plan
                </span>
              ) : tier.highlighted ? (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg ring-2 ring-brand-accent-200 animate-pulse z-10">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Most Popular
                  </span>
                </span>
              ) : null}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-sm text-slate-600 mb-6">{tier.description}</p>
              {tier.highlighted && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs sm:text-sm font-semibold text-green-800 dark:text-green-200">
                    💰 Save an average of <strong>$240/year</strong> by preventing unwanted renewals
                  </p>
                </div>
              )}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                    {isAnnual && tier.annualPrice ? tier.annualPrice : (tier.monthlyPrice || '$0')}
                  </span>
                  {tier.monthlyPrice === '$0' ? (
                    <span className="text-sm sm:text-base text-slate-500">forever</span>
                  ) : (
                    <span className="text-sm sm:text-base text-slate-500">
                      {isAnnual && tier.annualPrice ? '/year' : '/month'}
                    </span>
                  )}
                </div>
                {tier.monthlyPrice !== '$0' && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600">
                    14-day free trial, then {isAnnual && tier.annualPrice ? tier.annualPrice + '/year' : tier.monthlyPrice + '/month'}
                  </p>
                )}
                {isAnnual && tier.annualSavings && (
                  <span className="inline-block mt-2 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {tier.annualSavings}
                  </span>
                )}
              </div>
              <ul className="mb-8 sm:mb-10 space-y-2 sm:space-y-3 text-sm text-slate-600">
                {tier.features.map((feature, index) => (
                  <li key={`${tier.name}-${feature}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                    <span>
                      {feature === 'Unlimited Subscription Tracking' || feature === 'Advanced Spending Analytics' ? (
                        <strong className="font-bold text-slate-900">{feature}</strong>
                      ) : feature === 'All Pro Features' || feature === 'Team Sharing (5 Users)' ? (
                        <strong className="font-semibold text-slate-900">{feature}</strong>
                      ) : (
                        feature
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(tier.name)}
                disabled={isButtonLoading(tier.name) || authLoading || subscriptionLoading || isPlanDisabled(tier.name)}
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  isCurrentActivePlan
                    ? 'bg-green-500 text-white shadow-md hover:bg-green-600 hover:shadow-lg'
                    : tier.highlighted
                    ? 'bg-brand-accent-500 text-white shadow-md hover:bg-brand-accent-600 hover:shadow-lg'
                    : 'border-2 border-primary-300 text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                }`}
                aria-label={isCurrentActivePlan ? `Manage ${tier.name} subscription` : `Get started with ${tier.name} plan`}
              >
                {getButtonText(tier.name)}
              </button>
            </article>
          );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2 flex-wrap">
            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure payment via Stripe</span>
            <span className="text-slate-300">•</span>
            <span>Cancel anytime</span>
            <span className="text-slate-300">•</span>
            <span>No hidden fees</span>
            <span className="text-slate-300">•</span>
            <span>14-day free trial</span>
          </p>
        </div>
      </div>
    </section>
  );
}
