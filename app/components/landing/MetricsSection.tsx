'use client';

import { METRICS } from '@/lib/constants/landing';

export function MetricsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24" aria-labelledby="metrics-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="metrics-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 px-4 sm:px-0">Trusted by thousands of users worldwide</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Our alert system helps users stay on top of their subscriptions and avoid unwanted charges</p>
        </div>
        <div className="grid gap-6 sm:gap-8 rounded-2xl bg-slate-50 border border-slate-200/50 p-6 sm:p-8 md:p-12 md:grid-cols-3">
          {METRICS.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-4xl font-bold text-slate-900 mb-2">{metric.value}</p>
              <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
              <p className={`text-sm font-medium ${metric.trendColor}`}>
                {metric.trend}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
