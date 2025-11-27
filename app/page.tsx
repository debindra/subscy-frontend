'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import Script from 'next/script';
import { getNotificationChannelIcon } from '@/lib/utils/icons';

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
    icon: getNotificationChannelIcon('email')
  },
  { 
    name: 'SMS', 
    description: 'Receive text messages directly to your phone',
    icon: getNotificationChannelIcon('sms')
  },
  { 
    name: 'Push Notifications', 
    description: 'Real-time browser and mobile push alerts',
    icon: getNotificationChannelIcon('push notifications')
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Subsy\'s alert system saved me from three unwanted renewals in the first month. The SMS notifications are a game-changer—I never miss an alert now.',
    name: 'Sarah Martinez',
    role: 'Freelance Designer',
    rating: 5,
    timestamp: '1 month ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The customizable alert windows are perfect for our team. We get notified 30 days before renewals, giving us plenty of time to review and cancel if needed.',
    name: 'Michael Chen',
    role: 'Small Business Owner',
    rating: 5,
    timestamp: '2 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'I was spending hours tracking my subscriptions manually. Subsy automated everything and now I get alerts exactly when I need them. It\'s saved me both time and money.',
    name: 'Emily Rodriguez',
    role: 'Marketing Manager',
    rating: 5,
    timestamp: '3 weeks ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The price change alerts are incredible! I caught a subscription price increase before it renewed and was able to cancel. This tool pays for itself.',
    name: 'David Kim',
    role: 'Software Engineer',
    rating: 5,
    timestamp: '4 days ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'As someone with multiple subscriptions across different services, Subsy keeps everything organized in one place. The dashboard is clean and easy to use.',
    name: 'Jessica Thompson',
    role: 'Content Creator',
    rating: 5,
    timestamp: '1 week ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The multi-channel notifications mean I never miss an alert. Whether I\'m at my desk or on the go, I always know when a subscription is about to renew.',
    name: 'Robert Williams',
    role: 'Entrepreneur',
    rating: 5,
    timestamp: '2 weeks ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'As a student on a tight budget, Subsy has helped me save over $200 in the past 6 months by catching subscriptions I forgot about. Essential tool!',
    name: 'Alex Johnson',
    role: 'University Student',
    rating: 5,
    timestamp: '3 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'Our finance team uses Subsy to track all company subscriptions. The export features and analytics have made our expense reporting so much easier.',
    name: 'Priya Sharma',
    role: 'Finance Director',
    rating: 5,
    timestamp: '5 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'Being a digital nomad, I need reliable notifications across time zones. Subsy\'s international support and mobile app keep me connected everywhere.',
    name: 'Carlos Silva',
    role: 'Remote Developer',
    rating: 5,
    timestamp: '2 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  },
];

const TESTIMONIAL_GAP_REM = 1.5;

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
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

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


  // Track window width for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Simplified testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Simplified carousel transform
  const getCarouselTransform = () => {
    if (windowWidth === 0) return 'translateX(0)';

    if (windowWidth >= 1024) {
      // Desktop: 3 cards visible
      return `translateX(-${currentTestimonialIndex * (100 / 3)}%)`;
    } else if (windowWidth >= 768) {
      // Tablet: 2 cards visible
      return `translateX(-${currentTestimonialIndex * 50}%)`;
    } else {
      // Mobile: 1 card visible
      return `translateX(-${currentTestimonialIndex * 100}%)`;
    }
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

  // Enhanced structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Subsy',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://subsy.com',
    description: 'Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0',
        priceCurrency: 'USD',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: '1'
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Unified Subscription Dashboard',
      'Predictive Spend Insights',
      'One-Tap Controls',
      'Automated Renewal Alerts',
      'Vendor Health Monitoring',
      'Multi-Channel Notifications',
      'Real-time Monitoring',
      'Customizable Alert Windows',
    ],
    screenshot: [
      {
        '@type': 'ImageObject',
        url: 'https://subsy.com/screenshot-dashboard.png',
        caption: 'Subsy Dashboard - Track all your subscriptions in one place'
      }
    ],
    applicationSubCategory: 'Subscription Management',
    permissions: 'Free',
    releaseNotes: 'Latest version with enhanced notification system',
    softwareVersion: '1.0.0',
    downloadUrl: 'https://subsy.com/auth/signup',
    installUrl: 'https://subsy.com/auth/signup',
    countriesSupported: 'Worldwide',
    publisher: {
      '@type': 'Organization',
      name: 'Subsy',
      url: 'https://subsy.com'
    }
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Subsy',
    url: 'https://subsy.com',
    logo: 'https://subsy.com/logo.png',
    description: 'Subscription finance platform for modern finance operations. Track, manage, and optimize your recurring subscriptions with intelligent alerts and analytics.',
    email: 'hello@subsy.com',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello@subsy.com',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: 'English',
      },
    ],
    sameAs: [
      'https://twitter.com/subsy',
      'https://linkedin.com/company/subsy',
      'https://github.com/subsy',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    founder: [
      {
        '@type': 'Person',
        name: 'Subsy Team',
      },
    ],
    foundingDate: '2024',
    numberOfEmployees: '1-10',
    slogan: 'Never miss a subscription payment again',
    knowsAbout: [
      'Subscription Management',
      'Finance Operations',
      'SaaS Analytics',
      'Recurring Payments',
      'Vendor Management',
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
                  width={220}
                  height={220}
                  className="h-14 w-auto"
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

        {/* Sticky Navigation */}
        {!user && (
          <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isSticky
              ? 'translate-y-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
              : '-translate-y-full'
          }`}>
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-2">
                    <img
                      src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
                      alt="Subsy logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
                    <a href="#tour" className="hover:text-primary-600 transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
                    <a href="#faq" className="hover:text-primary-600 transition-colors">FAQ</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-brand-accent-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-accent-600 hover:shadow-md"
                  >
                    Start Free
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}

        <main className="relative z-10">
          {/* Simplified Hero Section */}
          <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white min-h-[85vh] sm:min-h-screen flex items-center pt-20 sm:pt-24 md:pt-16 pb-12 sm:pb-16" aria-labelledby="hero-heading">
            {/* Simplified Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Minimal gradient orbs */}
              <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-accent-200/30 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
            </div>
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-6 sm:py-8 md:py-12">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-brand-accent-50 border border-primary-200/50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 mb-4 sm:mb-6 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Intelligent Subscription Alerts
                </span>
                <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.2]!important px-2 sm:px-0" style={{ lineHeight: '1.2!important' }}>
                  Never miss a{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">
                      subscription payment
                    </span>
                    <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-3 bg-primary-100/40 -z-0 transform -skew-x-12"></span>
                  </span>
                  {' '}again
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-7 text-slate-600 max-w-3xl mx-auto  sm:px-0">
                  Subsy tracks all your subscriptions and sends smart alerts before renewals. Save money, avoid unwanted charges, and stay in control with our multi-channel notification system.
                </p>
                <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
                  <Link
                    href={user ? '/dashboard' : '/auth/signup'}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-5 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 text-base font-bold text-white shadow-xl shadow-brand-accent-500/30 transition-all hover:shadow-2xl hover:shadow-brand-accent-500/40 hover:scale-105 hover:from-brand-accent-600 hover:to-brand-accent-700 w-full sm:w-auto min-h-[48px]"
                    aria-label={user ? 'Go to dashboard' : 'Start free trial'}
                  >
                    {user ? 'Dashboard' : 'Start Free Trial'}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href={user ? '/dashboard/subscriptions' : '#tour'}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 text-base font-semibold text-slate-700 transition-all hover:bg-white hover:border-primary-300 hover:text-primary-600 hover:shadow-lg w-full sm:w-auto min-h-[48px]"
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
                    {/* <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                        <path strokeLinejoin="round" strokeMiterlimit="10" d="M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M14.5 8a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z" />
                      </svg>
                    </div> */}
           
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">99.9%</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider">Alert Delivery Rate</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    {/* <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-accent-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent-600" fill="currentColor" viewBox="0 0 2048 2048">
                        <path d="m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 384v512h384v128H896V384zm-64 1408q16 0 32-1t32-2l114 114q-45 8-89 12t-89 5q-132 0-254-34t-230-97t-194-150t-150-195t-97-229T0 960q0-132 34-254t97-230t150-194t195-150t229-97T960 0q132 0 254 34t230 97t194 150t150 195t97 229t35 255q0 50-6 101l-168 169q46-133 46-270q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30" />
                      </svg>
                    </div> */}
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-brand-accent-500 bg-clip-text text-transparent">24/7</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider">Real-time Monitoring</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                    {/* <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 7h1v1a1 1 0 0 0 2 0V7h1a1 1 0 0 0 0-2h-1V4a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2m2 9a3 3 0 0 0-1.73.56l-2.45-1.45A3.7 3.7 0 0 0 16 14a4 4 0 0 0-3-3.86V7.82a3 3 0 1 0-2 0v2.32A4 4 0 0 0 8 14a3.7 3.7 0 0 0 .18 1.11l-2.45 1.45A3 3 0 0 0 4 16a3 3 0 1 0 3 3a3 3 0 0 0-.12-.8l2.3-1.37a4 4 0 0 0 5.64 0l2.3 1.37A3 3 0 1 0 20 16M4 20a1 1 0 1 1 1-1a1 1 0 0 1-1 1m8-16a1 1 0 1 1-1 1a1 1 0 0 1 1-1m0 12a2 2 0 1 1 2-2a2 2 0 0 1-2 2m8 4a1 1 0 1 1 1-1a1 1 0 0 1-1 1" />
                      </svg>
                    </div> */}
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
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-50 to-brand-accent-50 text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
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
          {/*
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
          *}

          {/* Testimonials -  Carousel */}
          <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white" aria-label="Customer testimonials">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                  What Users Say About Subsy
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                  Hear what users who stay on top of their subscriptions with Subsy have to say.
                </p>
              </div>
              
              {/* Carousel Container - Infinite Loop */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex gap-6"
                    style={{
                      transform: getCarouselTransform(),
                      transition: 'transform 0.6s ease-in-out'
                    }}
                  >
                    {TESTIMONIALS.map((testimonial, index) => (
                      <div
                        key={`${testimonial.name}-${index}`}
                        className="w-full md:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333333%_-_1rem)] flex-shrink-0"
                      >
                        <article className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all hover:shadow-lg h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < testimonial.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-slate-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <blockquote className="text-sm sm:text-base leading-relaxed text-slate-700 mb-4">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{testimonial.timestamp}</span>
                            {testimonial.verified && (
                              <>
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Verified User</span>
                              </>
                            )}
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
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
         { /*
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
          */}
          {/* FAQ - Cleaner */}
          <section id="faq" className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-labelledby="faq-heading">
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
                        className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl min-h-[60px] sm:min-h-[70px]"
                        aria-expanded={isExpanded}
                        aria-controls={`faq-answer-${index}`}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} question: ${faq.question}`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-4">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
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
                    <div className="w-8 h-8 text-primary-600 [&>svg]:w-8 [&>svg]:h-8">
                      {getNotificationChannelIcon('email')}
                    </div> 
                    {/* <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg> */}
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
