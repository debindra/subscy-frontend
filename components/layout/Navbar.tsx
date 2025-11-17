'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountType =
    (user?.user_metadata as { account_type?: string } | undefined)?.account_type ?? 'personal';

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      active
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    }`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center group">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-lg transform group-hover:scale-110 transition-transform duration-200 shadow-md">
                <span className="text-xl">💳</span>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Subsy
              </span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                  {isActive('/dashboard') && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600"></div>
                  )}
                </Link>

                <Link href="/dashboard/subscriptions" className={navLinkClass('/dashboard/subscriptions')}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Subscriptions</span>
                  </div>
                  {isActive('/dashboard/subscriptions') && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600"></div>
                  )}
                </Link>

                <Link href="/dashboard/calendar" className={navLinkClass('/dashboard/calendar')}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Calendar</span>
                  </div>
                  {isActive('/dashboard/calendar') && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600"></div>
                  )}
                </Link>

                {accountType === 'business' && (
                  <Link href="/dashboard/business" className={navLinkClass('/dashboard/business')}>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m4 6V7a2 2 0 00-2-2H7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2z" />
                      </svg>
                      <span>Business</span>
                    </div>
                    {isActive('/dashboard/business') && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600"></div>
                    )}
                  </Link>
                )}

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>

                {/* User Menu */}
                <div className="ml-4 pl-4 border-l dark:border-gray-700 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-400 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                  title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
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
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700 animate-fade-in">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className={`block ${navLinkClass('/dashboard')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                href="/dashboard/subscriptions"
                className={`block ${navLinkClass('/dashboard/subscriptions')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Subscriptions</span>
                </div>
              </Link>

              {accountType === 'business' && (
                <Link
                  href="/dashboard/business"
                  className={`block ${navLinkClass('/dashboard/business')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m4 6V7a2 2 0 00-2-2H7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2z" />
                    </svg>
                    <span>Business</span>
                  </div>
                </Link>
              )}

              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-400 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

