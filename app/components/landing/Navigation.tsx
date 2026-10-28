'use client';

import Link from 'next/link';

interface NavigationProps {
  user: any;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const SECTION_LINKS = [
  { href: '#demo', label: 'Demo' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

// Smooth-scrolls to an in-page section. Sections carry scroll-margin so the
// fixed header never covers their heading.
function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>) {
  const id = e.currentTarget.getAttribute('href')?.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

export function Navigation({ user, mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  // The landing page is designed for a light surface only, so the header does not
  // follow the app theme (which previously left a dark header over light sections).
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
            <img src="/subsy-full-logo.png" alt="Subsy" width={220} height={220} className="h-8 w-auto sm:h-9" loading="eager" />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={scrollToSection}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg bg-brand-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-500 focus-visible:ring-offset-2 sm:inline-flex"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="whitespace-nowrap rounded-lg bg-brand-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-500 focus-visible:ring-offset-2"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div id="landing-mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  scrollToSection(e);
                  setMobileMenuOpen(false);
                }}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-2">
              <Link
                href={user ? '/dashboard' : '/auth/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {user ? 'Go to dashboard' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
