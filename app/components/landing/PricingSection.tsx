'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING } from '@/lib/constants/landing';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCheckout } from '@/lib/hooks/useBilling';
import { useToast } from '@/lib/context/ToastContext';

const annualSavings = PRICING.find((tier) => tier.annualSavings)?.annualSavings;

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
        return 'Get started free';
      }
      return 'Start 14-day trial';
    }

    // For authenticated users, show simple text
    if (normalizedPlan === 'starter') {
      return 'Go to dashboard';
    }
    return 'View plans';
  };

  const isPlanDisabled = () => {
    // No plans are disabled on the landing page
    // Authenticated users will be redirected to /dashboard/plans
    return false;
  };

  return (
    <section id="pricing" className="scroll-mt-20 py-16 sm:py-20 md:py-24 bg-slate-50" aria-labelledby="pricing-heading">
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

          {/* Billing toggle */}
          <div className="mt-10 flex justify-center" role="group" aria-label="Billing period">
            <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                aria-pressed={!isAnnual}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:px-7 ${
                  !isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                aria-pressed={isAnnual}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:px-7 ${
                  isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly
                {annualSavings && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">{annualSavings}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {PRICING.map((tier) => {
            const normalizedPlan = tier.name.toLowerCase();
            const monthlyPriceNum = tier.monthlyPrice === '$0' ? 0 : parseFloat(tier.monthlyPrice?.replace('$', '') || '0');
            const annualPriceNum = tier.annualPrice ? parseFloat(tier.annualPrice.replace('$', '')) : null;
            const effectiveMonthlyPrice = isAnnual && annualPriceNum ? (annualPriceNum / 12).toFixed(2) : null;

            return (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl bg-white p-6 sm:p-8 ${
                tier.highlighted
                  ? 'border-2 border-primary-500 shadow-lg'
                  : 'border border-slate-200'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

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
                    <p className="text-xs text-slate-600">14-day free trial, cancel anytime</p>
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={`${tier.name}-${feature}-${index}`} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(tier.name)}
                disabled={isButtonLoading(tier.name) || authLoading || isPlanDisabled()}
                className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  tier.highlighted
                    ? 'bg-brand-accent-500 text-white hover:bg-brand-accent-600 focus-visible:ring-brand-accent-500'
                    : 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-primary-500'
                }`}
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
          </div>
        </div>
      </div>
    </section>
  );
}
