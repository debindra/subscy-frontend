'use client';

import Link from 'next/link';

interface HeroSectionProps {
  user: any;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white min-h-[60vh] sm:min-h-[75vh] md:min-h-screen flex items-center pt-24 sm:pt-24 md:pt-16 pb-8 sm:pb-12 md:pb-16" aria-labelledby="hero-heading">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Minimal gradient orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-accent-200/30 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge - 0s delay */}
          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-primary-50 to-brand-accent-50 border border-primary-200/50 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-700 mb-3 sm:mb-4 md:mb-6 shadow-sm animate-fade-in-up animate-delay-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Intelligent Subscription Alerts
          </span>
          {/* Main heading - 0.1s delay */}
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.2] px-2 sm:px-0 animate-fade-in-up animate-delay-100" style={{ lineHeight: '1.15!important' }}>
            <span className="bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">
              Master Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Subscriptions.</span>
                <span className="absolute bottom-0.5 sm:bottom-0.5 md:bottom-1 left-0 w-full h-1 sm:h-1 md:h-1.5 bg-green-200/50 -z-0 transform -skew-x-12"></span>
              </span>
            </span>
            <br />
            Never Miss a Payment.
          </h1>
          {/* Description paragraph - 0.2s delay */}
          <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 text-slate-600 max-w-3xl mx-auto px-2 sm:px-0 animate-fade-in-up animate-delay-200">
            Subsy centralizes <span className="font-semibold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">all</span> your recurring expenses and keeps you informed with <span className="font-semibold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">timely, multi-channel</span> alerts—so you avoid <span className="font-semibold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">unexpected charges</span> and stay in <span className="font-semibold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">full control</span> of your spending.
          </p>
          {/* Action buttons - 0.3s delay */}
          <div className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 flex flex-col items-center justify-center gap-2.5 sm:gap-3 md:gap-4 sm:flex-row px-4 sm:px-0 animate-fade-in-up animate-delay-300">
            <Link
              href={user ? '/dashboard' : '/auth/signup'}
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-brand-accent-500/30 transition-all hover:shadow-2xl hover:shadow-brand-accent-500/40 hover:scale-105 hover:from-brand-accent-600 hover:to-brand-accent-700 w-full sm:w-auto min-h-[44px] sm:min-h-[48px]"
              aria-label={user ? 'Go to dashboard' : 'Start free trial'}
            >
              {user ? 'Dashboard' : 'Start Free Trial'}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={user ? '/dashboard/subscriptions' : '#tour'}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white/80 backdrop-blur-sm px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold text-slate-700 transition-all hover:bg-white hover:border-primary-300 hover:text-primary-600 hover:shadow-lg w-full sm:w-auto min-h-[44px] sm:min-h-[48px]"
              aria-label={user ? 'View subscription insights' : 'Watch product walkthrough'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {user ? 'View Insights' : 'Watch Demo'}
            </Link>
          </div>
          {/* Trust indicators (stats) - 0.4s delay */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 max-w-3xl mx-auto px-4 sm:px-0 animate-fade-in-up animate-delay-400">
            <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">99.9%</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">Alert Delivery Rate</p>
            </div>
            <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">24/7</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">Real-time Monitoring</p>
            </div>
            <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">3+</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">Notification Channels</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
