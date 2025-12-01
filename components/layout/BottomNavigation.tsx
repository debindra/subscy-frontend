'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  activePaths: string[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    activePaths: ['/dashboard'],
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {active ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        )}
      </svg>
    ),
  },
  {
    href: '/dashboard/subscriptions',
    label: 'Subscriptions',
    activePaths: ['/dashboard/subscriptions'],
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {active ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        )}
      </svg>
    ),
  },
  {
    href: '/dashboard/calendar',
    label: 'Calendar',
    activePaths: ['/dashboard/calendar'],
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {active ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        )}
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    activePaths: ['/dashboard/settings', '/dashboard/profile', '/dashboard/change-password'],
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {active ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        )}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    return item.activePaths.some((path) => {
      if (path === '/dashboard') {
        // For dashboard, only match exact path or dashboard root without subpaths
        return pathname === '/dashboard' || pathname === '/dashboard/';
      }
      return pathname === path || pathname.startsWith(path + '/');
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200/80 dark:border-gray-700/80 shadow-2xl"
         style={{
           paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
           paddingTop: '0.5rem'
         }}>
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full min-w-0 px-1 transition-all duration-200 ease-in-out ${
                active
                  ? 'text-primary-600 dark:text-primary-400 scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-102'
              }`}
              aria-label={item.label}
            >
              <div className="flex items-center justify-center mb-0.5">
                {item.icon(active)}
              </div>
              <span
                className={`text-[10px] font-semibold truncate w-full text-center tracking-tight ${
                  active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-primary-600 dark:bg-primary-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

