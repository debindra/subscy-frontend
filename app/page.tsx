'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import Script from 'next/script';

const FEATURES = [
  {
    title: 'Unified Subscription Dashboard',
    description:
      'See every subscription, renewal date, and contract owner in a single command center.',
    icon: '📊',
  },
  {
    title: 'Predictive Spend Insights',
    description:
      'AI forecasts upcoming renewals, highlights anomalies, and spots duplicate tools instantly.',
    icon: '🔮',
  },
  {
    title: 'One-Tap Controls',
    description:
      'Pause, cancel, or downgrade directly from Subsy with automated approval flows.',
    icon: '⚡',
  },
];

const METRICS = [
  { label: 'Average ROI in Year One', value: '212%', trend: '▲ 27% vs industry', trendColor: 'text-primary-600' },
  { label: 'Hours Saved Each Month', value: '18 hrs', trend: 'Finance + Ops teams', trendColor: 'text-primary-600' },
  { label: 'Compliance Coverage', value: 'SOC 2, GDPR', trend: 'Audit-ready exports', trendColor: 'text-primary-600' },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect spend sources',
    description: 'Link cards, banks, and finance apps with secure OAuth or CSV import.',
  },
  {
    number: '02',
    title: 'Surface recurring spend',
    description: 'AI groups duplicate tools, flags zombie licenses, and tracks owners automatically.',
  },
  {
    number: '03',
    title: 'Automate renewal playbooks',
    description: 'Send renewal alerts, route approvals, and forecast impact in a single dashboard.',
  },
];

const INTEGRATIONS = ['Notion', 'Slack', 'Google', 'Salesforce', 'NetSuite', 'QuickBooks'];

const TESTIMONIALS = [
  {
    quote:
      'Subsy uncovered $6,800 in duplicate licenses our first week. We reinvested the savings into product R&D immediately.',
    name: 'Avery Collins',
    role: 'VP Finance, NovaLabs',
  },
  {
    quote:
      'The renewal alerts and vendor health scores feel like a co-pilot for finance ops. Our team finally has proactive visibility.',
    name: 'Jordan Kim',
    role: 'Head of Ops, Flowstack',
  },
];

const PRICING = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    description: 'Basic tracking and cost visibility.',
    features: [
      'Up to 5 subscriptions',
      'Monthly/Annual dashboard',
      'Basic alerts (7 days)',
      'Manual renewals',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$2.99',
    annualPrice: '$29.99',
    description: 'Automation and unlimited tracking.',
    features: [
      'Unlimited subscriptions',
      'Smart renewal management',
      'Categorization & filtering',
      'Cancellation notes',
      'Priority support',
    ],
    highlighted: true,
    annualSavings: 'Save 16%',
  },
  {
    name: 'Family',
    monthlyPrice: '$4.99',
    annualPrice: '$49.99',
    description: 'Share with household members.',
    features: [
      'All PRO features',
      '5 linked accounts',
      'Shared subscription list',
      'Individual dashboards',
    ],
    annualSavings: 'Save 16%',
  },
];

const FAQS = [
  {
    question: 'Is our data secure?',
    answer:
      'Absolutely. We partner with SOC 2 Type II providers, encrypt data end-to-end, and never store credentials on our servers.',
  },
  {
    question: 'Can we invite our team?',
    answer:
      'Collaborate across finance, IT, and procurement with shared workspaces, granular roles, and audit trails.',
  },
  {
    question: 'Do you support custom integrations?',
    answer:
      'Yes—connect via API, webhook automations, or request white-glove onboarding for bespoke workflows.',
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);

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
      <div className="relative flex flex-col bg-white text-slate-900" itemScope itemType="https://schema.org/WebPage">
        {/* Simplified background - removed multiple animated blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-50/40 blur-3xl" />
        </div>

        {/* Cleaner header */}
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-3" aria-label="Subsy Home">
              <span className="sr-only">Subsy</span>
              <img
                src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
                alt="Subsy logo"
                width={140}
                height={40}
                className="h-10 w-auto scale-125"
                loading="eager"
              />
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-primary-600 px-5 py-2 text-white font-semibold transition-all hover:bg-primary-700 hover:shadow-md"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-lg px-4 py-2 text-slate-700 transition hover:text-primary-600"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-brand-accent-500 px-6 py-2 text-white font-semibold transition-all hover:bg-brand-accent-600 hover:shadow-md"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          {/* Simplified Hero Section */}
          <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pt-20 pb-24 md:pt-28 md:pb-32" aria-labelledby="hero-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700 mb-8">
                  Modern finance ops
                </span>
                <h1 id="hero-heading" className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  The subscription finance platform built to move as fast as your team.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl max-w-2xl mx-auto">
                  Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href={user ? '/dashboard' : '/auth/signup'}
                    className="rounded-lg bg-brand-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
                    aria-label={user ? 'Go to dashboard' : 'Start free trial'}
                  >
                    {user ? 'Dashboard' : 'Get Started'}
                  </Link>
                  <Link
                    href={user ? '/dashboard/subscriptions' : '#tour'}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400"
                    aria-label={user ? 'View subscription insights' : 'Watch product walkthrough'}
                  >
                    <span className="text-lg">▶</span>
                    {user ? 'View Insights' : 'Watch Demo'}
                  </Link>
                </div>
                {/* Simplified stats */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">$3.2M</p>
                    <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wider">Spend optimized</p>
                  </div>
                  <div className="hidden h-12 w-px bg-slate-200 sm:block" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">94%</p>
                    <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wider">Renewals automated</p>
                  </div>
                  <div className="hidden h-12 w-px bg-slate-200 sm:block" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">4.9★</p>
                    <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Section - Cleaner */}
          <section className="py-16 md:py-24" aria-labelledby="metrics-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 id="metrics-heading" className="text-3xl font-bold text-slate-900 sm:text-4xl">Trusted by finance teams worldwide</h2>
              </div>
              <div className="grid gap-8 rounded-2xl bg-slate-50 border border-slate-200/50 p-12 md:grid-cols-3">
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
          <section className="py-16 md:py-24 bg-slate-50" aria-label="Integrations">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Integrations
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Works with your finance stack</h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {INTEGRATIONS.map((brand) => (
                  <span key={brand} className="text-base font-semibold text-slate-600 hover:text-primary-600 transition-colors">{brand}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section - Cleaner */}
          <section id="tour" className="py-16 md:py-24" aria-labelledby="features-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Platform overview
                </span>
                <h2 id="features-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Everything you need to run lean, modern finance operations.
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Subsy gives finance, ops, and IT leaders a single hub to spot duplicate spend, enforce policy, and negotiate better renewals.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {FEATURES.map((feature, index) => (
                  <article
                    key={feature.title}
                    className="group rounded-2xl bg-white border border-slate-200 p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
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
          <section className="py-16 md:py-24 bg-slate-50" aria-labelledby="how-it-works-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center mb-16">
                <span className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  How it works
                </span>
                <h2 id="how-it-works-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Put subscription governance on autopilot in three steps
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Bring every contract, owner, and renewal into one workspace with guided automations from day one.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {STEPS.map((step) => (
                  <article
                    key={step.title}
                    className="rounded-2xl bg-white border border-slate-200 p-8 transition-all hover:border-primary-300 hover:shadow-md"
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
          <section className="py-16 md:py-24" aria-labelledby="security-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Trust & security
                </span>
                <h2 id="security-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Enterprise-grade controls from day one
                </h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                  Compliance isn't an add-on. We build security, privacy, and data residency guarantees directly into every workflow.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <article className="rounded-xl bg-white border border-slate-200 p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">SOC 2 Type II</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Continuous monitoring, least-privilege access, and audit-ready evidence exports.
                  </p>
                </article>
                <article className="rounded-xl bg-white border border-slate-200 p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Global compliance</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    GDPR, CCPA, and ISO-aligned workflows with regional hosting options.
                  </p>
                </article>
                <article className="rounded-xl bg-white border border-slate-200 p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade encryption</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    256-bit encryption in transit and at rest, plus hardware-backed key management.
                  </p>
                </article>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
                <span className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">CSA STAR</span>
                <span className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">GDPR READY</span>
                <span className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">SOX COMPLIANT</span>
              </div>
            </div>
          </section>

          {/* Testimonials - Cleaner */}
          <section className="py-16 md:py-24 bg-slate-50" aria-label="Customer testimonials">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Testimonials
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Loved by finance teams</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {TESTIMONIALS.map((testimonial) => (
                  <article
                    key={testimonial.name}
                    className="rounded-2xl bg-white border border-slate-200 p-8 transition-all hover:shadow-lg"
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
          <section className="py-16 md:py-24" aria-labelledby="pricing-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Pricing
                </span>
                <h2 id="pricing-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Simple, transparent pricing</h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                  Start for free with instant onboarding, then graduate to the plan that fits your team.
                </p>
                
                {/* Billing Toggle */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                    Monthly
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      isAnnual ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle billing period"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAnnual ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                    Yearly
                  </span>
                  {isAnnual && (
                    <span className="ml-2 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      Save 16%
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {PRICING.map((tier) => (
                  <article
                    key={tier.name}
                    className={`relative rounded-2xl border bg-white p-8 transition-all duration-300 ${
                      tier.highlighted 
                        ? 'border-primary-300 shadow-lg scale-105' 
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
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-slate-900">
                          {isAnnual && tier.annualPrice ? tier.annualPrice : (tier.monthlyPrice || '$0')}
                        </span>
                        {tier.monthlyPrice !== '$0' && (
                          <span className="text-base text-slate-500">
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
                    <ul className="mb-10 space-y-3 text-sm text-slate-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/signup"
                      className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all ${
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
          <section className="py-16 md:py-24" aria-labelledby="cta-heading">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-12 text-center text-white shadow-xl">
                <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Cut subscription waste in days, not quarters.</h2>
                <p className="mt-6 text-lg leading-8 text-white/90">
                  Join thousands of finance leaders orchestrating every recurring dollar with confidence.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-brand-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
                    aria-label="Create your free account"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="rounded-lg border-2 border-white/70 bg-white/10 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/20"
                    aria-label="Schedule a live demo"
                  >
                    Book Demo
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ - Cleaner */}
          <section className="py-16 md:py-24 bg-slate-50" aria-labelledby="faq-heading">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
                  FAQ
                </span>
                <h2 id="faq-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Frequently asked questions</h2>
              </div>
              <div className="space-y-6">
                {FAQS.map((faq) => (
                  <article key={faq.question} className="rounded-xl bg-white border border-slate-200 p-6 transition-all hover:shadow-md">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h3>
                    <p className="text-base leading-relaxed text-slate-600">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Contact - Cleaner */}
          <section className="py-16 md:py-24" aria-labelledby="contact-heading">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
                  Contact
                </span>
                <h2 id="contact-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Get in touch with us
                </h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-600">
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
              <div className="mt-12 text-center">
                <Link
                  href="mailto:hello@subsy.tech"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
                >
                  Send us a message
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Cleaner Footer */}
        <footer className="border-t border-slate-200 bg-white py-12" role="contentinfo">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row lg:px-8">
            <p className="text-base">© {new Date().getFullYear()} Subsy. All rights reserved.</p>
            <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
              <Link href="/privacy" className="text-base transition hover:text-primary-600">
                Privacy
              </Link>
              <Link href="/terms" className="text-base transition hover:text-primary-600">
                Terms
              </Link>
              <Link href="mailto:hello@subsy.tech" className="text-base transition hover:text-primary-600">
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
