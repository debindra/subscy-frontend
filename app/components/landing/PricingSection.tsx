'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRICING } from '@/lib/constants/landing';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

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
          {PRICING.map((tier) => (
            <article
              key={tier.name}
              className={`relative rounded-2xl border bg-white p-6 sm:p-8 transition-all duration-300 ${
                tier.highlighted 
                  ? 'border-primary-300 shadow-lg md:scale-105' 
                  : 'border-slate-200 hover:border-primary-200 hover:shadow-md'
              }`}
            >
              {tier.highlighted ? (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-sm text-slate-600 mb-6">{tier.description}</p>
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
              <Link
                href="/auth/signup"
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-brand-accent-500 text-white shadow-md hover:bg-brand-accent-600 hover:shadow-lg'
                    : 'border-2 border-primary-300 text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                }`}
                aria-label={`Get started with ${tier.name} plan`}
              >
                {tier.highlighted ? 'Get Started' : 'Start Trial'}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
