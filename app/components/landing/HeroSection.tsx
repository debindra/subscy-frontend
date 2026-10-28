'use client';

import Link from 'next/link';

interface HeroSectionProps {
  user: any;
}

const STATS = [
  { value: '99.9%', label: 'Alert delivery rate' },
  { value: '24/7', label: 'Renewal monitoring' },
  { value: '3+', label: 'Notification channels' },
];

// Signing up creates a free Starter account; the 14-day trial applies to Pro and
// starts at checkout, so the reassurance copy keeps those two claims separate.
const REASSURANCES = ['Free plan, no card needed', '14-day Pro trial', 'Cancel anytime'];

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pt-28 pb-16 sm:pt-36 sm:pb-24" aria-labelledby="hero-heading">
      {/* Single static wash in the brand color; decoration only */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.primary.50),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 animate-fade-in-up animate-delay-0">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Intelligent subscription alerts
          </p>

          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl animate-fade-in-up animate-delay-100"
          >
            Master your <span className="text-primary-600">subscriptions.</span>
            <br className="hidden sm:block" /> Never miss a payment.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 animate-fade-in-up animate-delay-200">
            Subsy keeps all your recurring expenses in one place and alerts you before every renewal,
            so you avoid unexpected charges and stay in control of your spending.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center animate-fade-in-up animate-delay-300">
            <Link
              href={user ? '/dashboard' : '/auth/signup'}
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-accent-500 px-7 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-500 focus-visible:ring-offset-2"
            >
              {user ? 'Go to dashboard' : 'Get started free'}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={user ? '/dashboard/subscriptions' : '#demo'}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {user ? 'View subscriptions' : 'See how it works'}
            </Link>
          </div>

          {!user && (
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600 animate-fade-in-up animate-delay-300">
              {REASSURANCES.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:mt-20 animate-fade-in-up animate-delay-400">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse items-center gap-1 px-2 py-5 text-center sm:py-6">
              <dt className="text-xs font-medium text-slate-500 sm:text-sm">{stat.label}</dt>
              <dd className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
