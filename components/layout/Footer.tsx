'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { subscribeToNewsletter } from '@/lib/api/newsletter';
import { SOCIAL_LINKS } from '@/lib/constants/social';

interface FooterProps {
  showNewsletter?: boolean;
}

export function Footer({ showNewsletter = true }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await subscribeToNewsletter(email);
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for subscribing!',
      });
      setEmail('');
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSocialLinks = SOCIAL_LINKS.filter((link) => link.active);

  // Generate comprehensive structured data for SEO
  const footerStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Footer Navigation',
    description: 'Main navigation links and resources for Subsy subscription management platform',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://subsy.com',
  };

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://subsy.com/#organization',
    name: 'Subsy',
    url: 'https://subsy.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://subsy.com/logo.png',
      width: 200,
      height: 60,
    },
    image: 'https://subsy.com/logo.png',
    description: 'Subscription finance platform for modern finance operations. Track, manage, and optimize your recurring subscriptions with intelligent alerts and analytics.',
    email: 'hello@subsy.tech',
    foundingDate: '2024',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello@subsy.tech',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        email: 'hello@subsy.tech',
        contactType: 'technical support',
        areaServed: 'Worldwide',
        availableLanguage: ['English'],
      },
    ],
    sameAs: activeSocialLinks.map((link) => link.url),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://subsy.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb structured data for footer navigation
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: typeof window !== 'undefined' ? window.location.origin : 'https://subsy.com',
      },
    ],
  };

  return (
    <>
      <Script
        id="footer-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footerStructuredData) }}
      />
      <Script
        id="footer-organization-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <Script
        id="footer-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <footer 
        className="relative border-t border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16" 
        role="contentinfo"
        itemScope 
        itemType="https://schema.org/WPFooter"
      >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content - Three Column Layout (Quick Links, Legal, Newsletter) */}
        <div className={`grid grid-cols-1 gap-10 ${showNewsletter ? 'md:grid-cols-3' : 'md:grid-cols-2'} mb-12`} itemScope itemType="https://schema.org/SiteNavigationElement">
          {/* Quick Links Section */}
          <section className="space-y-4" itemScope itemType="https://schema.org/SiteNavigationElement">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-gradient-to-r from-primary-500 to-brand-accent-500" aria-hidden="true"></span>
              Quick Links
            </h2>
            <nav className="space-y-3.5" aria-label="Quick links navigation" itemScope itemType="https://schema.org/ItemList" role="navigation">
              <Link
                href="/"
                title="Home - Subsy Subscription Management Platform"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="Navigate to home page"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Home</span>
              </Link>
              <Link
                href="#tour"
                title="Features - Subscription Management Features and Capabilities"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="View subscription management features"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Features</span>
              </Link>
              <Link
                href="#pricing"
                title="Pricing - Subscription Plans and Pricing Information"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="View pricing plans and subscription options"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Pricing</span>
              </Link>
              <Link
                href="#faq"
                title="FAQ - Frequently Asked Questions About Subsy"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="View frequently asked questions"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">FAQ</span>
              </Link>
            </nav>
          </section>

          {/* Legal Links Section */}
          <section className="space-y-4" itemScope itemType="https://schema.org/SiteNavigationElement">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-gradient-to-r from-primary-500 to-brand-accent-500" aria-hidden="true"></span>
              Legal
            </h2>
            <nav className="space-y-3.5" aria-label="Legal and policy links" itemScope itemType="https://schema.org/ItemList" role="navigation">
              <Link
                href="/privacy"
                title="Privacy Policy - How We Protect Your Data and Privacy"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="Read our privacy policy"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                title="Terms of Service - Terms and Conditions of Use"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="Read our terms of service"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Terms of Service</span>
              </Link>
              <Link
                href="/refund"
                title="Refund Policy - Refund and Cancellation Policy Information"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                aria-label="Read our refund policy"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Refund Policy</span>
              </Link>
              <Link
                href="mailto:hello@subsy.tech"
                title="Contact Us - Get in Touch with Subsy Support Team"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
                itemScope
                itemType="https://schema.org/ContactPoint"
                aria-label="Contact us via email"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Contact</span>
              </Link>
            </nav>
          </section>

          {/* Newsletter Section - Only show if showNewsletter is true */}
          {showNewsletter && (
            <section className="space-y-4" itemScope itemType="https://schema.org/Newsletter">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="h-0.5 w-6 bg-gradient-to-r from-primary-500 to-brand-accent-500" aria-hidden="true"></span>
                Newsletter
              </h2>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed" itemProp="description">
                Get subscription management tips delivered to your inbox
              </p>
              <form 
                onSubmit={handleNewsletterSubmit} 
                className="space-y-3" 
                itemScope 
                itemType="https://schema.org/SubscribeAction"
                aria-label="Newsletter subscription form"
                role="form"
              >
                <div className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    name="newsletter-email"
                    id="newsletter-email"
                    autoComplete="email"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:shadow-md disabled:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100"
                    aria-label="Email address for newsletter subscription"
                    aria-required="true"
                    itemProp="email"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
                {submitStatus.type && (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                    role="alert"
                  >
                    {submitStatus.type === 'success' ? (
                      <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {submitStatus.message}
                  </div>
                )}
              </form>
            </section>
          )}

          {/* DISABLED: Resources Section - can be re-enabled if needed */}
          {/* <section className="space-y-4" itemScope itemType="https://schema.org/SiteNavigationElement">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-gradient-to-r from-primary-500 to-brand-accent-500" aria-hidden="true"></span>
              Resources
            </h2>
            <nav className="space-y-3.5" aria-label="Footer resources" itemScope itemType="https://schema.org/ItemList">
              <Link
                href="/blog"
                title="Blog - Subscription Management Tips and Insights"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Blog</span>
              </Link>
              <Link
                href="/help"
                title="Help Center - Get Support and Documentation"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Help Center</span>
              </Link>
              <Link
                href="/community"
                title="Community - Join Our User Community"
                className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-primary-600 hover:translate-x-1"
                itemProp="url"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors" aria-hidden="true"></span>
                <span itemProp="name">Community</span>
              </Link>
            </nav>
          </section> */}
        </div>

        {/* Bottom Section: Social Links, Copyright, Made with */}
        <div className="border-t border-slate-200/60 pt-10" itemScope itemType="https://schema.org/WPFooter">
          <div className="flex flex-col gap-8">
            {/* Copyright, Made with, and Social Links */}
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              {/* Copyright and Made with */}
              <div className="flex flex-col items-center sm:items-start gap-2.5 text-sm" itemScope itemType="https://schema.org/Organization">
                <p className="font-medium text-slate-600" itemProp="copyrightHolder" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Subsy</span>
                </p>
                <p className="font-medium text-slate-600" itemProp="copyrightYear">
                  © {new Date().getFullYear()} <span itemProp="name">Subsy</span>. All rights reserved.
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  Made with <span className="text-red-500 animate-pulse" aria-label="love">❤️</span> by <span itemProp="name">Subsy</span>
                </p>
              </div>

              {/* Social Links */}
              {activeSocialLinks.length > 0 && (
                <nav className="flex items-center gap-3" aria-label="Social media" itemScope itemType="https://schema.org/Organization">
                  {activeSocialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 hover:scale-110 hover:shadow-md"
                      aria-label={`Visit our ${link.name} page - Opens in new tab`}
                      title={`Follow us on ${link.name}`}
                      itemProp="sameAs"
                    >
                      {link.icon === 'twitter' && (
                        <svg
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {link.icon === 'linkedin' && (
                        <svg
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      )}
                      {link.icon === 'instagram' && (
                        <svg
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

