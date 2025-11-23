'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import Script from 'next/script';

const FEATURES = [
  {
    title: 'Smart Alert System',
    description:
      'Get notified before renewals with customizable alert windows. Set reminders for 30, 14, 7, or 1 day before payments—never miss a subscription again.',
    icon: '🔔',
  },
  {
    title: 'Multi-Channel Notifications',
    description:
      'Receive alerts via email, SMS, and push notifications. Choose your preferred channels and get notified instantly when subscriptions are about to renew.',
    icon: '📱',
  },
  {
    title: 'Real-Time Monitoring',
    description:
      '24/7 monitoring of all your subscriptions with instant alerts for price changes, failed payments, and unexpected renewals. Stay in control, always.',
    icon: '⚡',
  },
];

const METRICS = [
  { label: 'Alerts Delivered', value: '2.5M+', trend: '▲ 99.9% delivery rate', trendColor: 'text-primary-600' },
  { label: 'Renewals Prevented', value: '94%', trend: 'Users avoid unwanted charges', trendColor: 'text-primary-600' },
  { label: 'Average Time Saved', value: '12 hrs', trend: 'Per month per user', trendColor: 'text-primary-600' },
];

const STEPS = [
  {
    number: '01',
    title: 'Add your subscriptions',
    description: 'Quickly add all your subscriptions manually or import from your accounts. Subsy automatically tracks renewal dates and payment schedules.',
  },
  {
    number: '02',
    title: 'Configure your alerts',
    description: 'Customize when and how you want to be notified. Set alert preferences for each subscription—email, SMS, or push notifications.',
  },
  {
    number: '03',
    title: 'Stay ahead of renewals',
    description: 'Receive timely notifications before every renewal. Never miss a payment or get surprised by unexpected charges again.',
  },
];

const NOTIFICATION_CHANNELS = [
  { 
    name: 'Email', 
    description: 'Get instant email alerts for all your subscription renewals',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    name: 'SMS', 
    description: 'Receive text messages directly to your phone',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  { 
    name: 'Push Notifications', 
    description: 'Real-time browser and mobile push alerts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Subsy\'s alert system saved me from three unwanted renewals in the first month. The SMS notifications are a game-changer—I never miss an alert now.',
    name: 'Sarah Martinez',
    role: 'Freelance Designer',
  },
  {
    quote:
      'The customizable alert windows are perfect for our team. We get notified 30 days before renewals, giving us plenty of time to review and cancel if needed.',
    name: 'Michael Chen',
    role: 'Small Business Owner',
  },
];

const PRICING = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    description: 'Basic alerts and tracking.',
    features: [
      'Up to 5 subscriptions',
      'Email alerts (7 days before)',
      'Basic renewal tracking',
      'Simple dashboard',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$2.99',
    annualPrice: '$29.99',
    description: 'Advanced alerts and unlimited tracking.',
    features: [
      'Unlimited subscriptions',
      'Multi-channel alerts (Email, SMS, Push)',
      'Customizable alert windows (30, 14, 7, 1 day)',
      'Real-time monitoring',
      'Price change alerts',
      'Priority support',
    ],
    highlighted: true,
    annualSavings: 'Save 16%',
  },
  {
    name: 'Family',
    monthlyPrice: '$4.99',
    annualPrice: '$49.99',
    description: 'Share alerts with household members.',
    features: [
      'All PRO features',
      '5 linked accounts',
      'Shared alert notifications',
      'Individual dashboards',
      'Family subscription management',
    ],
    annualSavings: 'Save 16%',
  },
];

const FAQS = [
  {
    question: 'How reliable are the subscription alerts?',
    answer:
      'Our alert system has a 99.9% delivery rate. We use multiple notification channels (email, SMS, push) to ensure you never miss a renewal. If one channel fails, we automatically try the others.',
  },
  {
    question: 'Can I customize when I receive alerts?',
    answer:
      'Yes! Pro and Family plans allow you to set custom alert windows—get notified 30, 14, 7, or 1 day before renewals. You can also set different preferences for each subscription.',
  },
  {
    question: 'What happens if I miss an alert?',
    answer:
      'We send multiple reminders as the renewal date approaches. You\'ll receive alerts at your chosen intervals, plus a final notification 24 hours before the renewal. All alerts are logged in your dashboard.',
  },
  {
    question: 'Do you support SMS notifications?',
    answer:
      'Yes! SMS notifications are available on Pro and Family plans. You can choose to receive alerts via email, SMS, push notifications, or all three channels for maximum reliability.',
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="mt-4 text-sm text-slate-600">Preparing your workspace…</p>
        </div>
      </div>
    );
  }

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Subsy',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '19',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
    },
    description: 'Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time.',
    featureList: [
      'Unified Subscription Dashboard',
      'Predictive Spend Insights',
      'One-Tap Controls',
      'Automated Renewal Alerts',
      'Vendor Health Monitoring',
    ],
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Subsy',
    url: 'https://subsy.tech',
    logo: 'https://subsy.tech/logo.png',
    description: 'Subscription finance platform for modern finance operations',
    email: 'hello@subsy.tech',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello@subsy.tech',
        contactType: 'General Inquiries',
      },
    ],
    sameAs: [
      'https://twitter.com/subsy',
      'https://linkedin.com/company/subsy',
    ],
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="structured-data-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="relative bg-white text-slate-900" itemScope itemType="https://schema.org/WebPage">
        {/* Simplified background - removed multiple animated blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-50/40 blur-3xl" />
        </div>

        {/* Cleaner header */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 lg:px-8" aria-label="Main navigation">
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="Subsy Home">
                <span className="sr-only">Subsy</span>
                <img
                  src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
                  alt="Subsy logo"
                  width={140}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                  loading="eager"
                  onError={(e) => {
                    // Fallback: try to reload or use a different path
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('data:')) {
                      target.src = theme === 'dark' 
                        ? '/subsy-full-logo-darktheme.png?t=' + Date.now()
                        : '/subsy-full-logo.png?t=' + Date.now();
                    }
                  }}
                />
              </Link>
              {!user && (
                <a
                  href="#pricing"
                  onClick={scrollToPricing}
                  className="hidden sm:inline-block rounded-lg px-3 sm:px-4 py-2 text-slate-700 transition hover:text-primary-600 text-sm font-medium"
                >
                  Pricing
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden sm:inline-flex rounded-lg bg-primary-600 px-4 sm:px-5 py-2 text-white font-semibold transition-all hover:bg-primary-700 hover:shadow-md text-sm sm:text-base"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="hidden sm:inline-flex rounded-lg px-3 sm:px-4 py-2 text-slate-700 transition hover:text-primary-600 text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-brand-accent-500 px-4 sm:px-6 py-2 text-white font-semibold transition-all hover:bg-brand-accent-600 hover:shadow-md text-sm sm:text-base whitespace-nowrap"
                  >
                    Start Free
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-2"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </>
              )}
            </div>
          </nav>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-slate-100 bg-white">
              <div className="px-4 py-4 space-y-3">
                {!user && (
                  <>
                    <a
                      href="#pricing"
                      onClick={(e) => {
                        scrollToPricing(e);
                        setMobileMenuOpen(false);
                      }}
                      className="block rounded-lg px-4 py-2 text-slate-700 transition hover:text-primary-600 hover:bg-slate-50 text-sm font-medium"
                    >
                      Pricing
                    </a>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-2 text-slate-700 transition hover:text-primary-600 hover:bg-slate-50 text-sm font-medium"
                    >
                      Sign in
                    </Link>
                  </>
                )}
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-primary-600 px-4 py-2 text-white font-semibold transition-all hover:bg-primary-700 text-center"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="relative z-10">
          {/* Simplified Hero Section */}
          <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white min-h-[85vh] sm:min-h-screen flex items-center pt-20 sm:pt-24 md:pt-16 pb-12 sm:pb-16" aria-labelledby="hero-heading">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Animated gradient orbs */}
              <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-accent-200/40 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary-100/30 blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
              
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
              
              {/* Subtle geometric shapes */}
              <div className="absolute top-20 right-20 w-32 h-32 border border-primary-200/30 rounded-lg rotate-12 animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-32 left-32 w-24 h-24 border border-brand-accent-200/30 rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
              
              {/* Subscription calendar-like pattern */}
              <div className="absolute top-1/4 right-1/4 opacity-5">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="60" y="10" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="110" y="10" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="160" y="10" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="10" y="60" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="60" y="60" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="110" y="60" width="40" height="40" rx="4" fill="currentColor" />
                  <rect x="160" y="60" width="40" height="40" rx="4" fill="currentColor" />
                </svg>
              </div>
              
              {/* Financial chart-like lines */}
              <div className="absolute bottom-1/4 left-1/4 opacity-5">
                <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 120 L50 100 L90 80 L130 60 L170 40 L210 50 L250 30 L290 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M10 140 L50 130 L90 110 L130 90 L170 70 L210 80 L250 60 L290 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
            </div>
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-6 sm:py-8 md:py-12">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-brand-accent-50 border border-primary-200/50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 mb-4 sm:mb-6 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Intelligent Subscription Alerts
                </span>
                <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight px-2 sm:px-0">
                  Stay ahead of every{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">
                      subscription renewal
                    </span>
                    <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-3 bg-primary-100/40 -z-0 transform -skew-x-12"></span>
                  </span>
                  {' '}with intelligent notifications
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-7 text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
                  Never miss a payment or renewal again. Subsy's advanced alert system delivers timely notifications across email, SMS, and push channels—keeping you informed and in control of every subscription.
                </p>
                <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
                  <Link
                    href={user ? '/dashboard' : '/auth/signup'}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-brand-accent-500/30 transition-all hover:shadow-2xl hover:shadow-brand-accent-500/40 hover:scale-105 hover:from-brand-accent-600 hover:to-brand-accent-700 w-full sm:w-auto"
                    aria-label={user ? 'Go to dashboard' : 'Start free trial'}
                  >
                    {user ? 'Dashboard' : 'Start Free Trial'}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href={user ? '/dashboard/subscriptions' : '#tour'}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold text-slate-700 transition-all hover:bg-white hover:border-primary-300 hover:text-primary-600 hover:shadow-lg w-full sm:w-auto"
                    aria-label={user ? 'View subscription insights' : 'Watch product walkthrough'}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {user ? 'View Insights' : 'Watch Demo'}
                  </Link>
                </div>
                {/* Enhanced stats */}
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-3xl mx-auto px-4 sm:px-0">
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">99.9%</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider">Alert Delivery Rate</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-accent-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">24/7</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider">Real-time Monitoring</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">3+</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider">Notification Channels</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Section - Cleaner */}
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

          {/* Integrations - Simplified */}
          <section className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-label="Integrations">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Notification Channels
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Get alerts where you need them</h2>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Receive notifications via email, SMS, and push notifications—choose what works best for you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                {NOTIFICATION_CHANNELS.map((channel) => (
                  <div 
                    key={channel.name} 
                    className="group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-brand-accent-50 text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {channel.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{channel.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{channel.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section - Cleaner */}
          <section id="tour" className="py-12 sm:py-16 md:py-24" aria-labelledby="features-heading">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-12 md:mb-16">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Alert Features
                </span>
                <h2 id="features-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
                  Powerful alert system to keep you in control
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
                  Never miss a renewal with our intelligent notification system. Get timely alerts, monitor changes, and stay ahead of every subscription payment.
                </p>
              </div>
              <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                {FEATURES.map((feature, index) => (
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

          {/* How It Works - Cleaner */}
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

          {/* Security Section - Cleaner */}
          <section className="py-12 sm:py-16 md:py-24" aria-labelledby="security-heading">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Trust & security
                </span>
                <h2 id="security-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
                  Enterprise-grade controls from day one
                </h2>
                <p className="mt-4 sm:mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
                  Compliance isn't an add-on. We build security, privacy, and data residency guarantees directly into every workflow.
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-8 sm:mb-12">
                <article className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">SOC 2 Type II</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Continuous monitoring, least-privilege access, and audit-ready evidence exports.
                  </p>
                </article>
                <article className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Global compliance</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    GDPR, CCPA, and ISO-aligned workflows with regional hosting options.
                  </p>
                </article>
                <article className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade encryption</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    256-bit encryption in transit and at rest, plus hardware-backed key management.
                  </p>
                </article>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium px-4 sm:px-0">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">CSA STAR</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">GDPR READY</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">SOX COMPLIANT</span>
              </div>
            </div>
          </section>

          {/* Testimonials - Cleaner */}
          <section className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-label="Customer testimonials">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Testimonials
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Loved by users who never miss a renewal</h2>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">See how Subsy's alert system helps users stay on top of their subscriptions</p>
              </div>
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                {TESTIMONIALS.map((testimonial) => (
                  <article
                    key={testimonial.name}
                    className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all hover:shadow-lg"
                  >
                    <blockquote className="text-lg leading-relaxed text-slate-700">"{testimonial.quote}"</blockquote>
                    <div className="mt-6">
                      <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing - Cleaner */}
          <section id="pricing" className="py-12 sm:py-16 md:py-24" aria-labelledby="pricing-heading">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <span className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Pricing
                </span>
                <h2 id="pricing-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Simple, transparent pricing</h2>
                <p className="mt-4 sm:mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
                  Start free with basic email alerts, or upgrade to Pro for multi-channel notifications and advanced alert customization.
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
                        {tier.monthlyPrice !== '$0' && (
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
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                          <span>{feature}</span>
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

          {/* CTA Section - Cleaner */}
          <section className="py-12 sm:py-16 md:py-24" aria-labelledby="cta-heading">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
                <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Never miss a subscription renewal again</h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-white/90">
                  Join thousands of users who stay ahead of their subscriptions with intelligent alerts and notifications.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                  <Link
                    href="/auth/signup"
                    className="w-full sm:w-auto rounded-lg bg-brand-accent-500 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
                    aria-label="Create your free account"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="w-full sm:w-auto rounded-lg border-2 border-white/70 bg-white/10 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white transition-all hover:border-white hover:bg-white/20"
                    aria-label="Schedule a live demo"
                  >
                    Book Demo
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ - Cleaner */}
          <section className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-labelledby="faq-heading">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  FAQ
                </span>
                <h2 id="faq-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Frequently asked questions about alerts</h2>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Everything you need to know about our subscription alert system</p>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, index) => {
                  const isExpanded = expandedFaqs.has(index);
                  return (
                    <article 
                      key={faq.question} 
                      className="rounded-xl bg-white border border-slate-200 transition-all hover:shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl"
                        aria-expanded={isExpanded}
                        aria-controls={`faq-answer-${index}`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-4">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        id={`faq-answer-${index}`}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <p className="text-sm sm:text-base leading-relaxed text-slate-600">{faq.answer}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact - Cleaner */}
          <section className="py-12 sm:py-16 md:py-24" aria-labelledby="contact-heading">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Contact
                </span>
                <h2 id="contact-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
                  Get in touch with us
                </h2>
                <p className="mt-4 sm:mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
                  <a href="mailto:hello@subsy.tech" className="text-primary-600 hover:text-primary-700 transition-colors font-medium text-lg">
                    hello@subsy.tech
                  </a>
                </div>
              </div>
              <div className="mt-8 sm:mt-12 text-center">
                <Link
                  href="mailto:hello@subsy.tech"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-accent-500 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
                >
                  Send us a message
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Cleaner Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 sm:py-12" role="contentinfo">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 text-sm text-slate-500 md:flex-row lg:px-8">
            <p className="text-sm sm:text-base text-center md:text-left">© {new Date().getFullYear()} Subsy. All rights reserved.</p>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-label="Footer navigation">
              <Link href="/privacy" className="text-sm sm:text-base transition hover:text-primary-600">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm sm:text-base transition hover:text-primary-600">
                Terms
              </Link>
              <Link href="mailto:hello@subsy.tech" className="text-sm sm:text-base transition hover:text-primary-600">
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
