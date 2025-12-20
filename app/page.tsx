'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Script from 'next/script';
import { FAQ_ITEMS } from '@/lib/constants/landing';
import { Navigation } from '@/app/components/landing/Navigation';
import { HeroSection } from '@/app/components/landing/HeroSection';
import { MetricsSection } from '@/app/components/landing/MetricsSection';
import { NotificationChannelsSection } from '@/app/components/landing/NotificationChannelsSection';
import { FeaturesSection } from '@/app/components/landing/FeaturesSection';
// import { StepsSection } from '@/app/components/landing/StepsSection';
// import { TestimonialsSection } from '@/app/components/landing/TestimonialsSection';
import { PricingSection } from '@/app/components/landing/PricingSection';
import { FAQSection } from '@/app/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';
// import { ContactSection } from '@/app/components/landing/ContactSection';

export default function Home() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToFaq = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] text-slate-900">
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
    description: 'Track and manage all your subscriptions in one place. Get timely alerts via email and push notifications, never miss a renewal, and optimize your recurring spend. Free plan available with 14-day free trial.',
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
      'Unlimited Subscription Tracking',
      'Customizable Email Alerts',
      'App Push Notifications',
      'Advanced Spending Analytics',
      'Category-Wise Budgeting',
      'Smart Renewal Management',
      // DISABLED: Ultimate plan features - can be re-enabled when Ultimate plan is restored
      // 'Multi-Currency Support',
      // 'Team Sharing & Collaboration',
      // 'Data Export (CSV/PDF)',
      // 'Priority Support',
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
    email: 'hello@subsy.tech',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello@subsy.tech',
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
    slogan: 'Master Your Subscriptions. Never Miss a Payment',
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
    mainEntity: FAQ_ITEMS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Breadcrumb structured data for better navigation
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://subsy.com',
      },
    ],
  };

  // Enhanced pricing structured data
  const pricingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Subsy Subscription Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter Plan',
        description: 'Basic organization, critical reminders. 5 Subscriptions, Email Alerts (7 days before renewal), Basic Spending Summary, Overall Budget Tracking.',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://subsy.com/auth/signup',
        category: 'Free',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        description: 'Unlimited tracking, Advanced budgeting, App Push Notifications. Unlimited Subscription Tracking, Customizable Reminder Timing (1-30 days), Email & Push Notifications, Advanced Spending Analytics, Category-Based Budgeting, Auto-Renewal Date Calculation, Cancellation Link Storage.',
        price: '4.99',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '4.99',
          priceCurrency: 'USD',
          billingIncrement: 'P1M',
          unitCode: 'MON',
        },
        availability: 'https://schema.org/InStock',
        url: 'https://subsy.com/auth/signup',
        category: 'Paid',
      },
    ],
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
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="structured-data-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
      />
      <div className="relative bg-[#F9FAFB] text-slate-900" itemScope itemType="https://schema.org/WebPage">
        {/* Simplified background - removed multiple animated blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-50/40 blur-3xl" />
        </div>

        <Navigation
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          scrollToPricing={scrollToPricing}
          scrollToFaq={scrollToFaq}
          isSticky={isSticky}
        />

        <main className="relative z-10">
          <HeroSection user={user} />
          {/* <MetricsSection /> */}
          {/* <NotificationChannelsSection /> */}
          <FeaturesSection />
          {/* <StepsSection /> */}
          {/* <TestimonialsSection /> */}
          <PricingSection />
          <FAQSection />
          {/* <ContactSection /> */}
        </main>

        <Footer />
      </div>
    </>
  );
}
