'use client';

import { FEATURES } from '@/lib/constants/landing';

export function FeaturesSection() {
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
            From unlimited tracking to advanced analytics and team collaboration, Subsy provides the tools you need to stay in control of your recurring expenses.
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
