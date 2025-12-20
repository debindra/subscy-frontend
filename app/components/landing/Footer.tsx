'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subscribeToNewsletter } from '@/lib/api/newsletter';
import { SOCIAL_LINKS } from '@/lib/constants/social';

export function Footer() {
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

  return (
    <footer className="border-t border-slate-200 bg-white py-8 sm:py-12" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content - Three Column Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="space-y-3" aria-label="Quick links">
              <Link
                href="/"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Home
              </Link>
              <Link
                href="#tour"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Newsletter Section - Smaller */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Get subscription management tips
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  aria-label="Email address for newsletter subscription"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {submitStatus.type && (
                <p
                  className={`text-xs ${
                    submitStatus.type === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                  role="alert"
                >
                  {submitStatus.message}
                </p>
              )}
            </form>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <nav className="space-y-3" aria-label="Footer resources">
              <Link
                href="/blog"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Blog
              </Link>
              <Link
                href="/help"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Help Center
              </Link>
              <Link
                href="/community"
                className="block text-sm text-slate-600 transition hover:text-primary-600"
              >
                Community
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section: Legal Links, Social Links, Copyright, Made with */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col gap-6">
            {/* Legal Links - Horizontal */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-label="Footer legal">
              <Link
                href="/privacy"
                className="text-sm text-slate-600 transition hover:text-primary-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-600 transition hover:text-primary-600"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund"
                className="text-sm text-slate-600 transition hover:text-primary-600"
              >
                Refund Policy
              </Link>
              <Link
                href="mailto:hello@subsy.tech"
                className="text-sm text-slate-600 transition hover:text-primary-600"
              >
                Contact
              </Link>
            </nav>

            {/* Copyright, Made with, and Social Links */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Copyright and Made with */}
              <div className="flex flex-col items-center sm:items-start gap-2 text-sm text-slate-500">
                <p>© {new Date().getFullYear()} Subsy. All rights reserved.</p>
                <p className="flex items-center gap-1">
                  Made with <span className="text-red-500">❤️</span> by Subsy
                </p>
              </div>

              {/* Social Links */}
              {activeSocialLinks.length > 0 && (
                <nav className="flex items-center gap-4" aria-label="Social media">
                  {activeSocialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 transition hover:text-primary-600"
                      aria-label={`Visit our ${link.name} page`}
                    >
                      {link.icon === 'twitter' && (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {link.icon === 'linkedin' && (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      )}
                      {link.icon === 'instagram' && (
                        <svg
                          className="h-5 w-5"
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
  );
}

