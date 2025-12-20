'use client';

import { useState } from 'react';
import { FEATURES, PRICING } from '@/lib/constants/landing';
import { getFeatureIcon } from '@/lib/utils/icons';

export function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // DISABLED: Plan comparison data - can be re-enabled if comparison section is restored
  // const comparisonFeatures = [
  //   { name: 'Unlimited Subscription Tracking', starter: false, pro: true },
  //   { name: 'Customizable Reminder Timing', starter: false, pro: true },
  //   { name: 'Email & Push Notifications', starter: false, pro: true },
  //   { name: 'Advanced Spending Analytics', starter: false, pro: true },
  //   { name: 'Category-Based Budgeting', starter: false, pro: true },
  // ];

  return (
    <section id="tour" className="py-12 sm:py-16 md:py-24" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
            Key Features
          </span>
          <h2 id="features-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
            Everything you need to master your subscriptions
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
            From unlimited tracking to advanced analytics, Subsy provides the tools you need to stay in control of your recurring expenses.
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mb-16 sm:mb-20 md:mb-24">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1"
              onMouseEnter={() => setHoveredFeature(feature.title)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Icon with gradient background */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-brand-accent-50 text-primary-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {getFeatureIcon(feature.iconName)}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              
              {/* Benefit headline */}
              <p className="text-base sm:text-lg font-semibold text-primary-600 mb-4">
                {feature.benefit}
              </p>
              
              {/* Description */}
              <p className="text-base leading-relaxed text-slate-600">{feature.description}</p>
              
              {/* Mini-demo preview on hover */}
              {hoveredFeature === feature.title && feature.hoverImage && (
                <div className="absolute top-full left-0 right-0 mt-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="rounded-lg shadow-2xl border border-slate-200 overflow-hidden bg-white">
                    <img 
                      src={feature.hoverImage} 
                      alt={`${feature.title} preview`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* DISABLED: Plan Comparison Table - can be re-enabled if needed */}
        {/* <div className="mt-16 sm:mt-20 md:mt-24">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Starter vs Pro
            </h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Compare plans to find the perfect fit for your subscription management needs
            </p>
          </div>
          
          {/* Desktop Table */}
          {/* <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-900 border-b-2 border-slate-200">Feature</th>
                  {PRICING.map((tier) => (
                    <th
                      key={tier.name}
                      className={`text-center p-4 font-semibold text-slate-900 border-b-2 ${
                        tier.highlighted ? 'border-brand-accent-500 bg-brand-accent-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{tier.name}</span>
                        {tier.highlighted && (
                          <span className="text-xs font-normal text-brand-accent-600">Most Popular</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                  >
                    <td className="p-4 text-sm sm:text-base text-slate-700 font-medium">{feature.name}</td>
                    <td className="p-4 text-center">
                      {feature.starter ? (
                        <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`p-4 text-center ${PRICING[1]?.highlighted ? 'bg-brand-accent-50/50' : ''}`}>
                      {feature.pro ? (
                        <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          {/* <div className="md:hidden space-y-6">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border-2 p-6 ${
                  tier.highlighted
                    ? 'border-brand-accent-500 bg-brand-accent-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900">{tier.name}</h4>
                  {tier.highlighted && (
                    <span className="text-xs font-semibold text-brand-accent-600 bg-brand-accent-100 px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {comparisonFeatures.map((feature) => {
                    const hasFeature =
                      (tier.name === 'Starter' && feature.starter) ||
                      (tier.name === 'Pro' && feature.pro);
                    
                    return (
                      <div key={feature.name} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{feature.name}</span>
                        {hasFeature ? (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
