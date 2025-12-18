'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { AccountSwitcher } from './AccountSwitcher';
import { useAccountContext } from '@/lib/hooks/useAccountContext';
import { getUserAvatarUrl, getUserDisplayName } from '@/lib/utils/userUtils';

interface NavbarProps {
  onStartTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartTour }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { availableContexts } = useAccountContext();
  const accountType =
    (user?.user_metadata as { account_type?: string } | undefined)?.account_type ?? 'personal';
  const hasBusinessContext = availableContexts.some(c => c.context === 'business');
  const displayName = getUserDisplayName(user);
  const avatarUrl = getUserAvatarUrl(user);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    // Use click event instead of mousedown to avoid interfering with Link navigation
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 sticky top-0 z-[60] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center group" aria-label="Subsy Home">
              {/* Mobile Logo */}
              <img
                src={theme === 'dark' ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
                alt="Subsy logo"
                width={120}
                height={36}
                className="md:hidden h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                loading="eager"
                onError={(e) => {
                  // Fallback: try to reload or use a different path
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('data:')) {
                    target.src = theme === 'dark' 
                      ? '/subsy-logo-darktheme.png?t=' + Date.now()
                      : '/subsy-logo.png?t=' + Date.now();
                  }
                }}
              />
              {/* Desktop Logo */}
              <img
                src={theme === 'dark' ? '/subsy-full-logo-darktheme.png' : '/subsy-full-logo.png'}
                alt="Subsy logo"
                width={120}
                height={36}
                className="hidden md:block h-10 w-auto min-w-[100px] transition-transform duration-200 group-hover:scale-105"
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

                {/* {hasBusinessContext && (
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
                )} */}

                {/* Account Switcher */}
                {/* <AccountSwitcher /> */}

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
                <div
                  className="relative ml-4 pl-4 border-l dark:border-gray-700 flex items-center space-x-3"
                  ref={userMenuRef}
                >
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-primary-500/20 dark:ring-primary-400/20"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!avatarUrl && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-primary-500/20 dark:ring-primary-400/20">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="max-w-[140px] truncate">{displayName}</span>
                    <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden animate-scale-in z-[100]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                        <div className="flex items-center space-x-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20 dark:ring-primary-400/20"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {!avatarUrl && (
                            <div className="w-10 h-10 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-primary-500/20 dark:ring-primary-400/20">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push('/dashboard/settings');
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                           Settings
                        </button> 
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.97 10.97 0 0112 15c2.5 0 4.847.835 6.879 2.236M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/billing"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Billing
                        </Link>
                        <Link
                          href="/dashboard/change-password"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Change Password
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile header actions - Visible on mobile */}
              <div className="flex md:hidden items-center space-x-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
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
                {/* User Menu Button */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex items-center space-x-1.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-primary-500/20 dark:ring-primary-400/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!avatarUrl && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-primary-500/20 dark:ring-primary-400/20">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden animate-scale-in z-[100]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                        <div className="flex items-center space-x-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20 dark:ring-primary-400/20"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {!avatarUrl && (
                            <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-primary-500/20 dark:ring-primary-400/20">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-0.5">Signed in as</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push('/dashboard/settings');
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Reminder Settings
                        </button>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.97 10.97 0 0112 15c2.5 0 4.847.835 6.879 2.236M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/billing"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Billing
                        </Link>
                        <Link
                          href="/dashboard/change-password"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700/60 hover:text-primary-700 dark:hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Change Password
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

              <Link
                href="/dashboard/calendar"
                className={`block ${navLinkClass('/dashboard/calendar')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Calendar</span>
                </div>
              </Link>

              {hasBusinessContext && (
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
                  <div className="flex items-center space-x-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20 dark:ring-primary-400/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!avatarUrl && (
                      <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-primary-500/20 dark:ring-primary-400/20">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {displayName}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.97 10.97 0 0112 15c2.5 0 4.847.835 6.879 2.236M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/dashboard/settings');
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 mb-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span> Settings</span>
                </button>
                {onStartTour && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onStartTour();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-500 border border-primary-600 dark:border-primary-400 rounded-lg transition-all duration-200 mb-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Take Tour</span>
                  </button>
                )}
                <Link
                  href="/dashboard/change-password"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-500 border border-primary-600 dark:border-primary-400 rounded-lg transition-all duration-200 mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Password</span>
                </Link>
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

