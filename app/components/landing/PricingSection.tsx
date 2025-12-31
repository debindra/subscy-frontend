'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING } from '@/lib/constants/landing';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCheckout } from '@/lib/hooks/useBilling';
import { useToast } from '@/lib/context/ToastContext';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { initiateCheckout, isLoading: checkoutLoading } = useCheckout();
  const { showToast } = useToast();

  const handlePlanSelect = async (planName: string) => {
    const normalizedPlan = planName.toLowerCase();
    
    // For unauthenticated users, redirect to signup
    if (!user) {
      // For Starter plan, just redirect to signup
      if (normalizedPlan === 'starter') {
        router.push('/auth/signup');
        return;
      }

      // For paid plans, store intended plan and redirect to signup
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

    // For authenticated users, redirect to plans page for upgrades
    if (normalizedPlan !== 'starter') {
      router.push('/dashboard/plans');
      return;
    }

    // Starter plan for authenticated users
    router.push('/dashboard');
  };

  const isButtonLoading = (planName: string) => {
    return loadingPlan === planName || (checkoutLoading && loadingPlan === planName);
  };

  const getButtonText = (planName: string) => {
    const normalizedPlan = planName.toLowerCase();
    
    if (!user) {
      if (normalizedPlan === 'starter') {
        return 'Get Started Free';
      }
      return 'Start 14-Day Trial';
    }

    // For authenticated users, show simple text
    if (normalizedPlan === 'starter') {
      return 'Go to Dashboard';
    }
    return 'View Plans';
  };

  const isPlanDisabled = () => {
    // No plans are disabled on the landing page
    // Authenticated users will be redirected to /dashboard/plans
    return false;
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white to-slate-50" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 mb-6">
            Pricing
          </span>
          <h2 id="pricing-heading" className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 sm:mt-6 mx-auto max-w-3xl text-lg sm:text-xl leading-8 text-slate-600 px-4 sm:px-0">
            Start free with essential tracking, or unlock unlimited subscriptions and advanced features with Pro.
          </p>

          {/* Billing Toggle - Enhanced Design */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-4">
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
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-2 max-w-5xl mx-auto">
          {PRICING.map((tier) => {
            const normalizedPlan = tier.name.toLowerCase();
            const monthlyPriceNum = tier.monthlyPrice === '$0' ? 0 : parseFloat(tier.monthlyPrice?.replace('$', '') || '0');
            const annualPriceNum = tier.annualPrice ? parseFloat(tier.annualPrice.replace('$', '')) : null;
            const effectiveMonthlyPrice = isAnnual && annualPriceNum ? (annualPriceNum / 12).toFixed(2) : null;

            return (
            <article
              key={tier.name}
              className={`relative rounded-2xl border-2 bg-white p-6 sm:p-7 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-primary-400 shadow-2xl lg:scale-[1.02] lg:-mt-4 lg:mb-4'
                  : 'border-slate-200 hover:border-primary-300 hover:shadow-xl'
              }`}
            >
              {/* Badge */}
              {tier.highlighted ? (
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
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{tier.description}</p>
              </div>

              {/* Value Proposition for Pro */} 
              {/* //TODO: Add this back in */}
              {/* {tier.highlighted && (
                <div className="mb-5 p-3 bg-gradient-to-r from-primary-50 to-brand-accent-50 rounded-lg border border-primary-200/50">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Save an average of <span className="text-primary-600">$240/year</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">by preventing unwanted renewals</p>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Pricing Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                    {isAnnual && tier.annualPrice ? tier.annualPrice : (tier.monthlyPrice || '$0')}
                  </span>
                  {tier.monthlyPrice === '$0' ? (
                    <span className="text-base text-slate-500 font-medium">forever</span>
                  ) : (
                    <span className="text-base text-slate-500 font-medium">
                      {isAnnual && tier.annualPrice ? '/year' : '/month'}
                    </span>
                  )}
                </div>
                {effectiveMonthlyPrice && (
                  <p className="text-xs text-slate-600 mb-1.5">
                    <span className="font-semibold">${effectiveMonthlyPrice}/month</span> when billed annually
                  </p>
                )}
                {tier.monthlyPrice !== '$0' && (
                  <div className="flex items-center gap-2 mt-2">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-xs text-slate-600">
                      14-day free trial • No credit card required
                    </p>
                  </div>
                )}
                {isAnnual && tier.annualSavings && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary-100 px-2.5 py-1">
                    <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-xs font-bold text-primary-700">{tier.annualSavings}</span>
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
                    <span className="text-sm text-slate-700 leading-relaxed">
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

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(tier.name)}
                disabled={isButtonLoading(tier.name) || authLoading || isPlanDisabled()}
                className={`inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white shadow-lg hover:from-brand-accent-600 hover:to-brand-accent-700 hover:shadow-xl hover:scale-[1.02]'
                    : 'border-2 border-primary-500 text-primary-600 bg-white hover:border-primary-600 hover:bg-primary-50 hover:scale-[1.02]'
                }`}
                aria-label={`Get started with ${tier.name} plan`}
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
              </button>
            </article>
          );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Secure payment via Stripe</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Cancel anytime</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">No hidden fees</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">14-day free trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
