'use client';

import { STEPS } from '@/lib/constants/landing';

export function StepsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
            How it works
          </span>
          <h2 id="how-it-works-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
            Set up alerts in three simple steps
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
            Get started in minutes. Add your subscriptions, configure your alerts, and never worry about missing a renewal again.
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all hover:border-primary-300 hover:shadow-md"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
