'use client';

import Link from 'next/link';

interface HeroSectionProps {
  user: any;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white min-h-[60vh] sm:min-h-[75vh] md:min-h-screen flex items-center pt-24 sm:pt-24 md:pt-16 pb-8 sm:pb-12 md:pb-16" aria-labelledby="hero-heading">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Vibrant gradient orbs */}
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary-400/40 via-primary-300/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-accent-400/40 via-brand-accent-300/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary-200/20 to-brand-accent-200/20 blur-3xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge - 0s delay */}
          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-primary-50 via-brand-accent-50 to-primary-50 border border-primary-200/60 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-700 mb-4 sm:mb-5 md:mb-6 shadow-md shadow-primary-100/50 animate-fade-in-up animate-delay-0 hover:shadow-lg hover:shadow-primary-200/50 transition-shadow duration-300">
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
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-500 via-brand-accent-600 to-brand-accent-500 px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-brand-accent-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent-500/50 hover:scale-105 hover:from-brand-accent-600 hover:via-brand-accent-700 hover:to-brand-accent-600 w-full sm:w-auto min-h-[44px] sm:min-h-[48px] overflow-hidden"
              aria-label={user ? 'Go to dashboard' : 'Start free trial - No credit card required'}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative z-10">{user ? 'Dashboard' : 'Start Free Trial'}</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={user ? '/dashboard/subscriptions' : '#demo'}
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white/90 backdrop-blur-md px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-semibold text-slate-700 transition-all duration-300 hover:bg-white hover:border-primary-400 hover:text-primary-600 hover:shadow-xl hover:shadow-primary-100/50 hover:-translate-y-0.5 w-full sm:w-auto min-h-[44px] sm:min-h-[48px]"
              aria-label={user ? 'View subscription insights' : 'Watch product demo'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {user ? 'View Insights' : 'Watch Demo'}
            </Link>
          </div>
          {/* Trust signals - 0.35s delay */}
          {!user && (
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700 animate-fade-in-up animate-delay-350">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14-day free trial
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </div>
          )}
          {/* User count social proof - 0.36s delay */}
          {/* {!user && (
            <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-600 animate-fade-in-up animate-delay-360">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
              <span className="font-medium text-slate-700">
                Join <strong className="text-slate-900">10,000+</strong> users managing their subscriptions
              </span>
            </div>
          )} */}
          {/* Dashboard Preview - 0.38s delay */}
          {/* Disabled for now - uncomment when dashboard screenshot is ready
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 max-w-5xl mx-auto px-4 sm:px-0 animate-fade-in-up animate-delay-380">
            <div className="relative rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden bg-white">
              <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-slate-500 font-medium">Dashboard Preview</p>
                  <p className="text-xs text-slate-400 mt-1">Replace with actual screenshot</p>
                </div>
                <img 
                  src="/dashboard-preview.png" 
                  alt="Subsy Dashboard - Track all your subscriptions in one place"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          */}

          {/* Trust indicators (stats) - 0.4s delay */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-4 sm:px-0 animate-fade-in-up animate-delay-400">
            <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-500 to-brand-accent-500 bg-clip-text text-transparent mb-2">99.9%</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Alert Delivery Rate</p>
            </div>
            <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-500 to-brand-accent-500 bg-clip-text text-transparent mb-2">24/7</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Real-time Monitoring</p>
            </div>
            <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-500 to-brand-accent-500 bg-clip-text text-transparent mb-2">3+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Notification Channels</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
