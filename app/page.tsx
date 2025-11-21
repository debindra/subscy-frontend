'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  { label: 'Average ROI in Year One', value: '212%', trend: '▲ 27% vs industry', trendColor: 'text-brand-accent-500' },
  { label: 'Hours Saved Each Month', value: '18 hrs', trend: 'Finance + Ops teams', trendColor: 'text-brand-accent-500' },
  { label: 'Compliance Coverage', value: 'SOC 2, GDPR', trend: 'Audit-ready exports', trendColor: 'text-brand-accent-500' },
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
    name: 'Starter',
    price: '$19',
    cadence: 'per month',
    description: 'For lean teams and solo operators getting proactive about spend.',
    features: [
      'Track up to 50 subscriptions',
      'Smart renewal reminders',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$49',
    cadence: 'per month',
    description: 'Purpose-built automations and controls for scaling teams.',
    features: [
      'Unlimited tracked subscriptions',
      'Workflow automations',
      'Policy & approval routing',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Let’s talk',
    cadence: '',
    description: 'Advanced security, SLAs, and integrations for complex finance ops.',
    features: [
      'SSO + SCIM provisioning',
      'Custom analytics workspaces',
      'Dedicated success partner',
    ],
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
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let animationFrame: number;
    let t = 0;

    const render = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const gradientA = ctx.createRadialGradient(
        width * 0.3,
        height * 0.35,
        80,
        width * 0.3,
        height * 0.35,
        320 + Math.sin(t) * 40,
      );
      gradientA.addColorStop(0, 'rgba(20, 184, 166, 0.45)'); // teal-500
      gradientA.addColorStop(1, 'rgba(15, 23, 42, 0)');

      const gradientB = ctx.createRadialGradient(
        width * 0.75,
        height * 0.65,
        120,
        width * 0.75,
        height * 0.65,
        360 + Math.cos(t * 0.9) * 50,
      );
      gradientB.addColorStop(0, 'rgba(45, 212, 191, 0.35)'); // teal-400
      gradientB.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = 'rgba(15, 23, 42, 0)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradientA;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradientB;
      ctx.fillRect(0, 0, width, height);

      t += 0.015;
      animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
      <div className="relative flex flex-col bg-slate-50 text-slate-900" itemScope itemType="https://schema.org/WebPage">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-[-18rem] mx-auto h-[32rem] w-[32rem] rounded-full bg-primary-200/60 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-12rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-primary-100/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3" aria-label="Subsy Home">
            <span className="sr-only">Subsy</span>
            <Image
              src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
              alt="Subsy logo"
              width={200}
              height={300}
              priority
              className="h-16 w-auto scale-110"
            />
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
            {user ? (
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-primary-600 px-5 py-2.5 text-white font-semibold shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] transition-all hover:bg-primary-700 hover:shadow-[0_6px_20px_0_rgba(13,148,136,0.5)] hover:scale-105"
                  >
                    Dashboard
                  </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-slate-700 transition hover:text-primary-600 hover:bg-primary-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-brand-accent-500 px-6 py-2.5 text-white font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all hover:bg-brand-accent-600 hover:shadow-[0_6px_20px_0_rgba(249,115,22,0.5)] hover:scale-105"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* <section className="pb-12 md:pb-16 lg:pb-20 pt-6 md:pt-8 lg:pt-12" aria-labelledby="hero-heading"> */}
        <section className="pb-12 md:pb-16 lg:pb-20" aria-labelledby="hero-heading">
          <div className="relative overflow-hidden border-y border-primary-100/60 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 text-white shadow-[0_40px_120px_-32px_rgba(13,148,136,0.55)]">
            <canvas ref={heroCanvasRef} className="absolute inset-0 -z-10 h-full w-full" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.28),transparent_68%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.28),transparent_62%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />
            <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-12 pt-16 sm:px-10 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16 lg:px-16 lg:pt-20">
              <div className="space-y-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] md:tracking-[0.35em] text-white/80">
                  Modern finance ops
                </span>
                <div className="space-y-6">
                  <h1 id="hero-heading" className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                    The subscription finance platform built to move as fast as your team.
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                    Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={user ? '/dashboard' : '/auth/signup'}
                    className="group rounded-full bg-brand-accent-500 px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-20px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:bg-brand-accent-600 hover:shadow-[0_25px_55px_-20px_rgba(249,115,22,0.5)]"
                    aria-label={user ? 'Go to dashboard' : 'Start free trial'}
                  >
                    {user ? 'Dashboard' : 'Get Started'}
                  </Link>
                  <Link
                    href={user ? '/dashboard/subscriptions' : '#tour'}
                    className="group inline-flex items-center gap-3 text-base font-semibold text-white transition-all hover:scale-105 hover:text-primary-100"
                    aria-label={user ? 'View subscription insights' : 'Watch product walkthrough'}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg transition-all group-hover:bg-white/20 group-hover:scale-110">▶</span>
                    {user ? 'View Insights' : 'Watch Demo'}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6 text-left text-sm text-white/80">
                  <div>
                    <p className="text-2xl font-semibold text-white">$3.2M</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Spend optimized</p>
                  </div>
                  <div className="hidden h-10 w-px bg-white/20 sm:block" />
                  <div>
                    <p className="text-2xl font-semibold text-white">94%</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Renewals automated</p>
                  </div>
                  <div className="hidden h-10 w-px bg-white/20 sm:block" />
                  <div>
                    <p className="text-2xl font-semibold text-white">4.9★</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Customer rating</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 rounded-[36px] border border-white/20 bg-white/10 p-6 md:p-8 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Monthly spend</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">$28,430</p>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80">▼ 12%</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Renewals this week</p>
                    <p className="mt-2 text-2xl font-semibold">6</p>
                    <p className="mt-1 text-xs text-white/80">3 flagged as high impact</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Automations live</p>
                    <p className="mt-2 text-2xl font-semibold">14</p>
                    <p className="mt-1 text-xs text-white/80">Savings workflow active</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] md:tracking-[0.35em] text-white/70">
                    <span>Vendor health</span>
                    <span>92%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/20">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-white to-primary-200" />
                  </div>
                  <p className="mt-3 text-xs text-white/80">3 vendors require review</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="metrics-heading">
          <div className="text-center mb-8">
            <h2 id="metrics-heading" className="text-2xl font-bold text-slate-900 md:text-3xl">Trusted by finance teams worldwide</h2>
          </div>
          <div className="grid gap-6 rounded-[32px] border border-slate-200/80 bg-white/95 backdrop-blur-sm px-8 py-12 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)] md:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="space-y-3">
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{metric.label}</p>
                <p className={`text-xs font-medium ${metric.trendColor}`}>
                  {metric.trend}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-label="Integrations">
          <div className="text-center mb-8">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              Integrations
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Works with your finance stack</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 rounded-[32px] border border-slate-200/80 bg-white/95 backdrop-blur-sm px-10 py-12 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
            {INTEGRATIONS.map((brand) => (
              <span key={brand} className="text-sm font-semibold tracking-[0.35em] text-slate-600 hover:text-primary-600 transition-colors">{brand}</span>
            ))}
          </div>
        </section>

        <section id="tour" className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="features-heading">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
                Platform overview
              </span>
              <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Everything you need to run lean, modern finance operations.
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Subsy gives finance, ops, and IT leaders a single hub to spot duplicate spend, enforce policy, and negotiate better renewals.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full border-2 border-primary-300 bg-white px-6 py-2.5 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-50 hover:border-primary-400 hover:scale-105"
            >
              Explore
            </Link>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className="group flex h-full flex-col justify-between rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-2 hover:border-primary-200 hover:shadow-[0_32px_80px_-38px_rgba(15,23,42,0.5)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="text-4xl transition-transform group-hover:scale-110">{feature.icon}</div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">{feature.description}</p>
                </div>
                <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            ))}
          </div>
        </section>


        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="how-it-works-heading">
          <div className="rounded-[40px] border border-slate-200/80 bg-white/95 backdrop-blur-sm p-10 md:p-12 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)]">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
                How it works
              </span>
              <h2 id="how-it-works-heading" className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Put subscription governance on autopilot in three steps
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl">
                Bring every contract, owner, and renewal into one workspace with guided automations from day one.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <article
                  key={step.title}
                  className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-8 transition-all hover:border-primary-200 hover:shadow-lg"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-base font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="security-heading">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              Trust & security
            </span>
            <h2 id="security-heading" className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Enterprise-grade controls from day one
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Compliance isn't an add-on. We build security, privacy, and data residency guarantees directly into every workflow.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">SOC 2 Type II</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Continuous monitoring, least-privilege access, and audit-ready evidence exports.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global compliance</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                GDPR, CCPA, and ISO-aligned workflows with regional hosting options.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-primary-300 hover:shadow-md">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade encryption</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                256-bit encryption in transit and at rest, plus hardware-backed key management.
              </p>
            </article>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-200">CSA STAR</span>
            <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-200">GDPR READY</span>
            <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-200">SOX COMPLIANT</span>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-label="Customer testimonials">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">Loved by finance teams</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[32px] border border-slate-200/80 bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] transition-all hover:shadow-[0_28px_70px_-40px_rgba(15,23,42,0.55)]"
              >
                <blockquote className="text-lg leading-relaxed text-slate-700 md:text-xl">"{testimonial.quote}"</blockquote>
                <div className="mt-6 text-sm font-medium text-slate-500">
                  <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="mt-1">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="pricing-heading">
          <div className="text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              Pricing
            </span>
            <h2 id="pricing-heading" className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">Simple, transparent pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Start for free with instant onboarding, then graduate to the plan that fits your team.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {PRICING.map((tier) => (
              <article
                key={tier.name}
                className={`relative rounded-[32px] border bg-white p-8 md:p-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] transition-all duration-300 ${
                  tier.highlighted 
                    ? 'scale-[1.02] border-primary-300 bg-gradient-to-br from-white to-primary-50/30 shadow-[0_32px_90px_-45px_rgba(15,23,42,0.55)] hover:scale-[1.03]' 
                    : 'border-slate-200/80 hover:border-primary-200 hover:shadow-[0_28px_70px_-40px_rgba(15,23,42,0.5)]'
                }`}
              >
                {tier.highlighted ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <p className="mt-2 text-base text-slate-600">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-slate-900">{tier.price}</span>
                  <span className="text-base text-slate-500">{tier.cadence}</span>
                </div>
                <ul className="mt-8 space-y-4 text-base text-slate-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-all hover:scale-105 ${
                    tier.highlighted
                      ? 'bg-brand-accent-500 text-white shadow-lg hover:bg-brand-accent-600 hover:shadow-xl'
                      : 'border-2 border-primary-300 text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                  }`}
                  aria-label={`Get started with ${tier.name} plan`}
                >
                  {tier.highlighted ? 'Get Started' : 'Start Trial'}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="cta-heading">
          <div className="rounded-[40px] bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 p-10 md:p-12 text-center text-white shadow-[0_32px_90px_-45px_rgba(13,148,136,0.6)]">
            <h2 id="cta-heading" className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">Cut subscription waste in days, not quarters.</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/90 md:text-xl">
              Join thousands of finance leaders orchestrating every recurring dollar with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-full bg-brand-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-accent-600 hover:shadow-xl"
                aria-label="Create your free account"
              >
                Sign Up Free
              </Link>
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 hover:border-white hover:bg-white/10"
                aria-label="Schedule a live demo"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="faq-heading">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              FAQ
            </span>
            <h2 id="faq-heading" className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">Frequently asked questions</h2>
          </div>
          <div className="space-y-6 md:space-y-8">
            {FAQS.map((faq) => (
              <article key={faq.question} className="rounded-[32px] border border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 md:p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] transition-all hover:shadow-[0_28px_70px_-40px_rgba(15,23,42,0.5)]">
                <h3 className="text-lg font-bold text-slate-900 md:text-xl">{faq.question}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20" aria-labelledby="contact-heading">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.35em] text-slate-600">
              Contact
            </span>
            <h2 id="contact-heading" className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Get in touch with us
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="flex justify-center max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
              <a href="mailto:hello@subsy.tech" className="text-primary-600 hover:text-primary-700 transition-colors font-medium">
                hello@subsy.tech
              </a>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="mailto:hello@subsy.tech"
              className="inline-flex items-center justify-center rounded-full bg-brand-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
            >
              Send us a message
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/95 backdrop-blur-sm pt-10 pb-20 md:pb-24" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-start md:items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row">
          <p className="text-base">© {new Date().getFullYear()} Subsy. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-start md:justify-center gap-6" aria-label="Footer navigation">
            <Link href="/privacy" className="text-base transition hover:text-primary-600 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-base transition hover:text-primary-600 hover:underline">
              Terms
            </Link>
            <Link href="mailto:hello@subsy.tech" className="text-base transition hover:text-primary-600 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
    </>
  );
}

