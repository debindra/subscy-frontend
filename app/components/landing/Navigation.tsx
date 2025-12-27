'use client';

import Link from 'next/link';
import { useTheme } from '@/lib/context/ThemeContext';

interface NavigationProps {
  user: any;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollToPricing: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  scrollToFaq: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  scrollToDemo: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isSticky: boolean;
}

export function Navigation({
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToPricing,
  scrollToFaq,
  scrollToDemo,
  isSticky,
}: NavigationProps) {
  const { theme } = useTheme();

  return (
    <>
      {/* Cleaner header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="Subsy Home">
              <span className="sr-only">Subsy</span>
              <img
                src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
                alt="Subsy logo"
                width={220}
                height={220}
                className="sm:h-10 h-8 w-auto"
                loading="eager"
                onError={(e) => {
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
              <>
                <a
                  href="#demo"
                  onClick={scrollToDemo}
                  className="hidden sm:inline-block rounded-lg px-3 sm:px-4 py-2 text-slate-700 transition hover:text-primary-600 text-sm font-medium"
                >
                  Demo
                </a>
                <a
                  href="#pricing"
                  onClick={scrollToPricing}
                  className="hidden sm:inline-block rounded-lg px-3 sm:px-4 py-2 text-slate-700 transition hover:text-primary-600 text-sm font-medium"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={scrollToFaq}
                  className="hidden sm:inline-block rounded-lg px-3 sm:px-4 py-2 text-slate-700 transition hover:text-primary-600 text-sm font-medium"
                >
                  FAQs
                </a>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="group hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-4 sm:px-5 py-2 text-white font-semibold transition-all hover:from-brand-accent-600 hover:to-brand-accent-700 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                >
                  Dashboard
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
                    href="#demo"
                    onClick={(e) => {
                      scrollToDemo(e);
                      setMobileMenuOpen(false);
                    }}
                    className="block rounded-lg px-4 py-2 text-slate-700 transition hover:text-primary-600 hover:bg-slate-50 text-sm font-medium"
                  >
                    Demo
                  </a>
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
                  <a
                    href="#faq"
                    onClick={(e) => {
                      scrollToFaq(e);
                      setMobileMenuOpen(false);
                    }}
                    className="block rounded-lg px-4 py-2 text-slate-700 transition hover:text-primary-600 hover:bg-slate-50 text-sm font-medium"
                  >
                    FAQs
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
                  className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-4 py-2 text-white font-semibold transition-all hover:from-brand-accent-600 hover:to-brand-accent-700 hover:shadow-lg"
                >
                  Dashboard
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
                  <a href="#demo" className="hover:text-primary-600 transition-colors">Demo</a>
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
    </>
  );
}
