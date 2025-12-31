'use client';

import { useState, useEffect } from 'react';
import { getSubscriptionIcon } from '@/lib/utils/icons';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useTheme } from '@/lib/context/ThemeContext';
import { addDays, format } from 'date-fns';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Helper function to get renewal date based on days
function getRenewalDate(days: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewalDate = addDays(today, days);
  return format(renewalDate, 'MMM dd, yyyy');
}

// Mobile Dashboard Component
function MobileDashboard({ isDarkMode, dark, viewport }: { isDarkMode: boolean; dark: (light: string, dark: string) => string; viewport: 'desktop' | 'mobile' }) {
  return (
    <div className={`w-full ${dark('bg-white', 'bg-slate-900')} pb-4`}>
      {/* Header */}
      <div className={`px-4 pt-4 pb-2 ${dark('bg-white', 'bg-slate-900')}`}>
        <div className="flex items-center justify-between mb-4">
          <img
            src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
            alt="Subsy logo"
            width={40}
            height={40}
            className="w-10 h-10"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('data:')) {
                target.src = isDarkMode 
                  ? '/subsy-logo-darktheme.png?t=' + Date.now()
                  : '/subsy-logo.png?t=' + Date.now();
              }
            }}
          />
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg ${viewport === 'mobile' ? dark('active:bg-slate-100', 'active:bg-slate-800') : dark('hover:bg-slate-100', 'hover:bg-slate-800')} active:opacity-70 transition-colors`} style={{ touchAction: 'manipulation' }}>
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <svg className={`w-5 h-5 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
        <div className="mb-4">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark('text-primary-700', 'text-primary-300')}`}>
            {getGreeting()}
          </p>
          <h1 className={`text-2xl font-extrabold mb-1 ${dark('text-slate-900', 'text-white')}`}>
            John Doe! 👋
          </h1>
          <p className={`text-sm mt-2 ${dark('text-slate-600', 'text-slate-400')}`}>
            Here's your subscription overview
          </p>
        </div>
        <button className="mt-4 w-full bg-orange-500 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 active:opacity-80 active:scale-98 transition-all" style={{ touchAction: 'manipulation' }}>
          Manage Subscriptions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Total Spending Card */}
      <div className={`mx-4 mt-4 rounded-xl p-4 ${dark('bg-green-50 border border-green-200', 'bg-green-900/20 border border-green-800')}`}>
        <h2 className={`text-sm font-semibold mb-3 ${dark('text-slate-900', 'text-white')}`}>
          TOTAL SPENDING (CONVERTED TO USD)
        </h2>
        <div className="mb-3">
          <p className={`text-3xl font-bold ${dark('text-slate-900', 'text-white')}`}>$8,672.66</p>
          <p className={dark('text-sm text-slate-600', 'text-sm text-slate-400')}>per month</p>
          <p className={`text-xl font-semibold mt-1 ${dark('text-slate-900', 'text-white')}`}>$104,133 per year</p>
        </div>
        <p className={`text-xs mb-3 ${dark('text-slate-600', 'text-slate-400')}`}>
          Based on all active subscriptions, converted using your base currency.
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className={dark('text-slate-700', 'text-slate-300')}>EUR: €3,001.27 / month</span>
            <span className={dark('text-slate-600', 'text-slate-400')}>€36,015.24 / year</span>
          </div>
          <div className="flex justify-between">
            <span className={dark('text-slate-700', 'text-slate-300')}>USD: $2,449.22 / month</span>
            <span className={dark('text-slate-600', 'text-slate-400')}>$29,390.64 / year</span>
          </div>
        </div>
      </div>

      {/* Upcoming Renewals */}
      <div className="mx-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className={`text-lg font-bold ${dark('text-slate-900', 'text-white')}`}>Upcoming renewals</h2>
            <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>
              Subscriptions renewing and trials expiring in the next 7 days.
            </p>
          </div>
          <select className={`px-2 py-1 text-xs border rounded ${dark('border-slate-300 bg-white', 'border-slate-600 bg-slate-800 text-white')}`}>
            <option>7 Days</option>
          </select>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Netlify 131', price: '$19.00 / month', days: '0d', icon: getSubscriptionIcon('Netlify', 'Design') },
            { name: 'DigitalOcean 57', price: '$22.00 / month', days: '0d', icon: getSubscriptionIcon('DigitalOcean', 'Development') },
            { name: 'Stripe 125', price: '€439 / month', days: '1d', icon: getSubscriptionIcon('Stripe', 'Cloud Services') },
            { name: 'AWS 184', price: '$43.00 / month', days: '2d', icon: getSubscriptionIcon('AWS', 'Cloud Services') },
            { name: 'Canva 240', price: '$16.00 / month', days: '3d', icon: getSubscriptionIcon('Canva', 'Design') },
            { name: 'Disney+ 153', price: '€484 / month', days: '5d', icon: getSubscriptionIcon('Disney+', 'Entertainment') },
          ].map((sub, i) => {
            const isRenewingToday = sub.days === '0d';
            return (
              <div key={i} className={`relative rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')} ${isRenewingToday ? 'animate-pulse-glow' : ''}`}>
                {/* "Today" Badge - Top Right Corner */}
                {isRenewingToday && (
                  <div className="absolute -top-1.5 -right-1.5 z-20">
                    <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-shimmer-glow overflow-hidden">
                      {/* Shimmer overlay effect */}
                      <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
                      <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark('bg-slate-100', 'bg-slate-700')}`}>
                    {sub.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${dark('text-slate-900', 'text-white')}`}>{sub.name}</p>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>{sub.price}</p>
                  </div>
                  {!isRenewingToday && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${dark('bg-slate-100 text-slate-700', 'bg-slate-700 text-slate-300')}`}>
                      {sub.days}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Tracking */}
      <div className={`mx-4 mt-4 rounded-xl p-4 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
        <h3 className={`text-base font-bold mb-2 ${dark('text-slate-900', 'text-white')}`}>Budget Tracking</h3>
        <p className={`text-xs mb-3 ${dark('text-slate-600', 'text-slate-400')}`}>
          See how your current monthly spending compares to your budget.
        </p>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={dark('text-slate-600', 'text-slate-400')}>Monthly Budget</span>
            <span className={`font-semibold ${dark('text-slate-900', 'text-white')}`}>8.1% used</span>
          </div>
          <div className={`w-full rounded-full h-2 ${dark('bg-slate-200', 'bg-slate-700')}`}>
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '8.1%' }}></div>
          </div>
          <p className={`text-xs mt-1 text-right ${dark('text-slate-600', 'text-slate-400')}`}>
            16,301,327.24 remaining
          </p>
        </div>
      </div>

      {/* Subscription Summary */}
      <div className="mx-4 mt-4 space-y-2">
        <div className={`rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${dark('text-slate-900', 'text-white')}`}>TOTAL SUBSCRIPTIONS</p>
              <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>253 (220 active, 33 inactive)</p>
            </div>
            <svg className={`w-5 h-5 ${dark('text-slate-400', 'text-slate-500')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <div className={`rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${dark('text-slate-900', 'text-white')}`}>ACTIVE SUBSCRIPTIONS</p>
              <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>220 (87% of total)</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className={`rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${dark('text-slate-900', 'text-white')}`}>UPCOMING RENEWALS</p>
              <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>12 (next 7 days)</p>
            </div>
            <svg className={`w-5 h-5 text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Subscriptions Component
function MobileSubscriptions({ isDarkMode, dark, viewport }: { isDarkMode: boolean; dark: (light: string, dark: string) => string; viewport: 'desktop' | 'mobile' }) {
  return (
    <div className={`w-full ${dark('bg-white', 'bg-slate-900')} pb-4`}>
      {/* Header */}
      <div className={`px-4 pt-4 pb-2 ${dark('bg-white', 'bg-slate-900')}`}>
        <div className="flex items-center justify-between mb-2">
          <img
            src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
            alt="Subsy logo"
            width={40}
            height={40}
            className="w-10 h-10"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('data:')) {
                target.src = isDarkMode 
                  ? '/subsy-logo-darktheme.png?t=' + Date.now()
                  : '/subsy-logo.png?t=' + Date.now();
              }
            }}
          />
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg ${viewport === 'mobile' ? dark('active:bg-slate-100', 'active:bg-slate-800') : dark('hover:bg-slate-100', 'hover:bg-slate-800')} active:opacity-70 transition-colors`} style={{ touchAction: 'manipulation' }}>
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <svg className={`w-5 h-5 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <h1 className={`text-2xl font-bold ${dark('text-slate-900', 'text-white')}`}>Subscriptions</h1>
        <p className={`text-sm ${dark('text-slate-600', 'text-slate-400')}`}>Manage all your subscriptions</p>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-4 flex gap-2">
        <button className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium active:opacity-70 active:scale-98 transition-all ${dark('border-teal-500 text-teal-600', 'border-teal-400 text-teal-400')}`} style={{ touchAction: 'manipulation' }}>
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
        <button className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium active:opacity-70 active:scale-98 transition-all ${dark('border-slate-300 text-slate-700', 'border-slate-600 text-slate-300')}`} style={{ touchAction: 'manipulation' }}>
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Add Subscription Button */}
      <div className="px-4 mt-3">
        <button className="w-full bg-orange-500 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 active:opacity-80 active:scale-98 transition-all" style={{ touchAction: 'manipulation' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Subscription
        </button>
      </div>

      {/* View Toggle */}
      <div className="px-4 mt-3 flex justify-end gap-2">
        <button className={`p-2 rounded active:opacity-70 active:scale-95 transition-all ${dark('bg-teal-100 text-teal-600', 'bg-teal-900/50 text-teal-400')}`} style={{ touchAction: 'manipulation' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className={`p-2 rounded active:opacity-70 active:scale-95 transition-all ${dark('text-slate-400', 'text-slate-500')}`} style={{ touchAction: 'manipulation' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>

      {/* Subscription List */}
      <div className="px-4 mt-4 space-y-2">
        {[
          { name: 'Netlify 131', price: '$4.75 / Week', days: '0d', icon: getSubscriptionIcon('Netlify', 'Design') },
          { name: 'DigitalOcean 67', price: '$5.50 / Week', days: '0d', icon: getSubscriptionIcon('DigitalOcean', 'Development') },
          { name: 'Stripe 125', price: '£14.39 / Month', days: '1d', icon: getSubscriptionIcon('Stripe', 'Cloud Services') },
          { name: 'AWS 184', price: '$49.09 / Week', days: '2d', icon: getSubscriptionIcon('AWS', 'Cloud Services') },
          { name: 'ExpressVPN 255', price: '£4.24 / Week', days: '3d', icon: getSubscriptionIcon('ExpressVPN', 'Security') },
          { name: 'Canva 240', price: '$3.80 / Week', days: '5d', icon: getSubscriptionIcon('Canva', 'Design') },
          { name: 'Disney+ 153', price: '€4.84 / Week', days: '7d', icon: getSubscriptionIcon('Disney+', 'Entertainment') },
          { name: 'Spotify Premium', price: '$9.99 / Month', days: '10d', icon: getSubscriptionIcon('Spotify', 'Entertainment') },
          { name: 'Adobe Creative Cloud', price: '$52.99 / Month', days: '14d', icon: getSubscriptionIcon('Adobe', 'Design') },
          { name: 'Microsoft 365', price: '$6.99 / Month', days: '21d', icon: getSubscriptionIcon('Microsoft', 'Productivity') },
        ].map((sub, i) => {
          const isRenewingToday = sub.days === '0d';
          return (
            <div key={i} className={`relative overflow-visible ${isRenewingToday ? 'animate-pulse-glow' : ''}`}>
              <div className={`rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
                {/* "Today" Badge - Top Right Corner */}
                {isRenewingToday && (
                  <div className="absolute -top-1.5 -right-1.5 z-20">
                    <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-shimmer-glow overflow-hidden">
                      {/* Shimmer overlay effect */}
                      <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
                      <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dark('bg-slate-100', 'bg-slate-700')}`}>
                    {sub.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${dark('text-slate-900', 'text-white')}`}>{sub.name}</p>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className={`text-xs ${dark('text-slate-600', 'text-slate-400')}`}>{sub.price}</p>
                  </div>
                  {!isRenewingToday && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${dark('bg-slate-100 text-slate-700', 'bg-slate-700 text-slate-300')}`}>
                      {sub.days}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mobile Calendar Component
function MobileCalendar({ isDarkMode, dark, viewport }: { isDarkMode: boolean; dark: (light: string, dark: string) => string; viewport: 'desktop' | 'mobile' }) {
  return (
    <div className={`w-full ${dark('bg-white', 'bg-slate-900')} pb-4`}>
      {/* Header */}
      <div className={`px-4 pt-4 pb-2 ${dark('bg-white', 'bg-slate-900')}`}>
        <div className="flex items-center justify-between mb-2">
          <img
            src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
            alt="Subsy logo"
            width={40}
            height={40}
            className="w-10 h-10"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('data:')) {
                target.src = isDarkMode 
                  ? '/subsy-logo-darktheme.png?t=' + Date.now()
                  : '/subsy-logo.png?t=' + Date.now();
              }
            }}
          />
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg ${viewport === 'mobile' ? dark('active:bg-slate-100', 'active:bg-slate-800') : dark('hover:bg-slate-100', 'hover:bg-slate-800')} active:opacity-70 transition-colors`} style={{ touchAction: 'manipulation' }}>
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <svg className={`w-5 h-5 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <h1 className={`text-2xl font-bold ${dark('text-slate-900', 'text-white')}`}>Calendar</h1>
        <p className={`text-sm ${dark('text-slate-600', 'text-slate-400')}`}>Renewals and trial end dates</p>
      </div>

      {/* Calendar Navigation */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <button className={`px-3 py-2 border rounded-lg text-sm active:opacity-70 active:scale-95 transition-all ${dark('border-slate-300 text-slate-700', 'border-slate-600 text-slate-300')}`} style={{ touchAction: 'manipulation' }}>
          Prev
        </button>
        <h2 className={`text-lg font-bold ${dark('text-slate-900', 'text-white')}`}>January 2026</h2>
        <button className={`px-3 py-2 border rounded-lg text-sm active:opacity-70 active:scale-95 transition-all ${dark('border-slate-300 text-slate-700', 'border-slate-600 text-slate-300')}`} style={{ touchAction: 'manipulation' }}>
          Next
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={`mx-4 mt-4 rounded-lg p-3 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className={`text-center text-xs font-semibold py-1 ${dark('text-slate-600', 'text-slate-400')}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {[29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((day, i) => {
            const hasRenewal = [1, 5, 10, 15, 20].includes(day);
            const hasTrial = [3, 7, 13].includes(day);
            return (
              <div
                key={i}
                className={`min-h-[50px] p-1 border rounded text-xs ${dark('border-slate-200', 'border-slate-700')} ${hasRenewal || hasTrial ? dark('bg-slate-50', 'bg-slate-700/50') : ''}`}
              >
                <div className={`text-xs font-semibold mb-1 ${day < 1 ? dark('text-slate-400', 'text-slate-600') : dark('text-slate-900', 'text-white')}`}>
                  {day > 0 ? day : ''}
                </div>
                {hasRenewal && (
                  <div className={`w-full h-1 rounded mb-1 ${dark('bg-green-500', 'bg-green-600')}`}></div>
                )}
                {hasTrial && (
                  <div className={`w-full h-1 rounded ${dark('bg-blue-500', 'bg-blue-600')}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'calendar'>('dashboard');
  const [loopCount, setLoopCount] = useState(0);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Detect if user is on mobile device
  const isMobileDevice = useMediaQuery('(max-width: 768px)');
  
  // Auto-set to mobile view on mobile devices (only on initial mount to allow manual toggle)
  useEffect(() => {
    if (isMobileDevice && viewport === 'desktop') {
      setViewport('mobile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function for dark mode classes
  const dark = (light: string, dark: string) => isDarkMode ? dark : light;

  // Auto-rotate tabs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === 'dashboard') {
          return 'subscriptions';
        }
        if (prev === 'subscriptions') {
          return 'calendar';
        }
        // When returning to dashboard, we've completed a loop
        setLoopCount((count) => count + 1);
        return 'dashboard';
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-12 sm:py-16 md:py-24 bg-white" aria-labelledby="demo-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
            System Demo
          </span>
          <h2 id="demo-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
            See Subsy in action
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
            Track all your subscriptions, manage spending, and get alerts—all in one dashboard.
          </p>
        </div>

        {/* Viewport Toggle - Only show on desktop */}
        {!isMobileDevice && (
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewport === 'desktop'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewport === 'mobile'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </button>
          </div>
        )}

        {/* Demo Preview Container */}
        <div className="mb-8 sm:mb-12">
          {viewport === 'desktop' ? (
            // Desktop View
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 overflow-hidden shadow-2xl max-w-7xl mx-auto">
            {/* Browser Chrome */}
            <div className={`border-b px-4 py-3 flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className={`flex-1 rounded-md px-3 py-1.5 text-xs text-center mx-4 ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500'}`}>
                subsy.tech/{activeTab}
              </div>
            </div>

            {/* Page Content - Conditional Rendering */}
            <div className={`relative overflow-x-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              {activeTab === 'dashboard' && (
                <div className={`min-w-[1200px] p-6 ${dark('bg-[#F9FAFB]', 'bg-slate-900')}`}>
                  {/* Top Navigation */}
                  <div className={`flex items-center justify-between mb-6 pb-4 border-b ${dark('border-slate-200', 'border-slate-700')}`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
                        alt="Subsy logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                        loading="eager"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('data:')) {
                            target.src = isDarkMode 
                              ? '/subsy-logo-darktheme.png?t=' + Date.now()
                              : '/subsy-logo.png?t=' + Date.now();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'dashboard'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'subscriptions'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Subscriptions
                      </button>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'calendar'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar
                      </button>
                      <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-lg transition-colors ${dark('hover:bg-slate-100', 'hover:bg-slate-700')}`}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      >
                        {isDarkMode ? (
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=12"
                          alt="John Doe"
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (!target.nextElementSibling?.classList.contains('avatar-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = `avatar-fallback w-8 h-8 rounded-full ${dark('bg-slate-300', 'bg-slate-600')} flex items-center justify-center text-white text-xs font-semibold`;
                              fallback.textContent = 'JD';
                              target.parentNode?.insertBefore(fallback, target.nextSibling);
                            }
                          }}
                        />
                        <span className={`text-sm ${dark('text-slate-700', 'text-slate-300')}`}>John Doe</span>
                        <svg className={`w-4 h-4 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div className="mb-6">
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark('text-primary-700', 'text-primary-300')}`}>
                      {getGreeting()}
                    </p>
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 ${dark('text-slate-900', 'text-white')}`}>
                      John Doe! 👋
                    </h1>
                    <p className={`text-base sm:text-sm mt-2 ${dark('text-slate-600', 'text-slate-400')}`}>
                      Here's your subscription overview
                    </p>
                  </div>

                  {/* Total Spending Card */}
                  <div className={`rounded-xl p-6 mb-6 ${dark('bg-green-50 border border-green-200', 'bg-green-900/20 border border-green-800')}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${dark('text-slate-900', 'text-white')}`}>TOTAL SPENDING (CONVERTED TO USD)</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className={`text-3xl font-bold ${dark('text-slate-900', 'text-white')}`}>$8,672.66</p>
                      <p className={dark('text-sm text-slate-600', 'text-sm text-slate-400')}>Monthly</p>
                    </div>
                    <div>
                      <p className={`text-3xl font-bold ${dark('text-slate-900', 'text-white')}`}>$104,131.39</p>
                      <p className={dark('text-sm text-slate-600', 'text-sm text-slate-400')}>Annual</p>
                    </div>
                  </div>
                  <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>Based on all active subscriptions, converted using your base currency.</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={dark('text-slate-700', 'text-slate-300')}>EUR: €3,051.27/month</span>
                      <span className={dark('text-slate-600', 'text-slate-400')}>€36,538.28/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={dark('text-slate-700', 'text-slate-300')}>USD: $2,449.22/month</span>
                      <span className={dark('text-slate-600', 'text-slate-400')}>$29,406.22/year</span>
                    </div>
                  </div>
                  </div>

                  {/* Upcoming Renewals */}
                  <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={`text-xl font-bold ${dark('text-slate-900', 'text-white')}`}>Upcoming renewals</h2>
                      <p className={dark('text-sm text-slate-600', 'text-sm text-slate-400')}>Subscriptions renewing and trials expiring in the next 7 days.</p>
                    </div>
                    <select className={`px-3 py-2 border rounded-lg text-sm ${dark('border-slate-300 bg-white', 'border-slate-600 bg-slate-800 text-white')}`}>
                      <option>Time range: 7 Days</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Netlify 131', category: 'Design', price: '$4.75 / Week', days: 0 },
                      { name: 'DigitalOcean 67', category: 'Development', price: '$5.50 / Week', days: 0 },
                      { name: 'Stripe 125', category: 'Cloud Services', price: '£14.39 / Month', days: 1 },
                      { name: 'AWS 184', category: 'Education', price: '$49.09 / Week', days: 2 },
                      { name: 'Canva 240', category: 'Finance', price: '$3.80 / Week', days: 3 },
                      { name: 'Disney+ 153', category: 'Design', price: '€4.84 / Week', days: 5, trial: true },
                    ].map((sub, i) => {
                      const renewal = getRenewalDate(sub.days);
                      const isRenewingToday = sub.days === 0;
                      return (
                        <div key={i} className={`relative rounded-lg p-4 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')} ${isRenewingToday ? 'animate-pulse-glow' : ''}`}>
                          {/* "Today" Badge - Top Right Corner */}
                          {isRenewingToday && (
                            <div className="absolute -top-1.5 -right-1.5 z-20">
                              <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-shimmer-glow overflow-hidden">
                                {/* Shimmer overlay effect */}
                                <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
                                <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark('bg-slate-100', 'bg-slate-700')}`}>
                              {getSubscriptionIcon(sub.name, sub.category)}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${dark('text-slate-900', 'text-white')}`}>{sub.name}</p>
                              <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>{sub.category}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className={dark('text-slate-600', 'text-slate-400')}>Cost:</span>
                              <span className={`font-semibold ${dark('text-slate-900', 'text-white')}`}>{sub.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={dark('text-slate-600', 'text-slate-400')}>Renewal:</span>
                              <span className={dark('text-slate-900', 'text-white')}>{renewal}</span>
                            </div>
                            {!isRenewingToday && (
                              <div className="flex justify-between">
                                <span className={dark('text-slate-600', 'text-slate-400')}>Remaining:</span>
                                <span className="text-orange-600 font-semibold">{sub.days} days</span>
                              </div>
                            )}
                          </div>
                          {sub.trial && (
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${dark('bg-blue-100 text-blue-700', 'bg-blue-900/50 text-blue-300')}`}>Trial</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  </div>

                  {/* Budget Tracking & Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className={`rounded-lg p-6 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${dark('text-slate-900', 'text-white')}`}>Budget Tracking</h3>
                        <p className={dark('text-sm text-slate-600', 'text-sm text-slate-400')}>See how your current monthly spending compares to your budget.</p>
                      </div>
                      <button className={`w-8 h-8 rounded-lg border flex items-center justify-center ${dark('border-slate-300 hover:bg-slate-50', 'border-slate-600 hover:bg-slate-700')}`}>
                        <svg className={`w-5 h-5 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={dark('text-slate-600', 'text-slate-400')}>Monthly Budget</span>
                        <span className={`font-semibold ${dark('text-slate-900', 'text-white')}`}>$8,672.66 of $9,000,000.00</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${dark('bg-slate-200', 'bg-slate-700')}`}>
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '0.1%' }}></div>
                      </div>
                      <div className={`flex justify-between text-xs mt-2 ${dark('text-slate-600', 'text-slate-400')}`}>
                        <span>0.1% used</span>
                        <span>$8,991,327.34 remaining</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className={`rounded-lg p-3 ${dark('bg-slate-50', 'bg-slate-700/50')}`}>
                        <p className={`text-2xl font-bold ${dark('text-slate-900', 'text-white')}`}>253</p>
                        <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>Total Subscriptions</p>
                        <p className={dark('text-xs text-slate-500', 'text-xs text-slate-500')}>220 active + 33 inactive</p>
                      </div>
                      <div className={`rounded-lg p-3 ${dark('bg-slate-50', 'bg-slate-700/50')}`}>
                        <p className={`text-2xl font-bold ${dark('text-slate-900', 'text-white')}`}>12</p>
                        <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>Upcoming Renewals</p>
                        <p className={dark('text-xs text-slate-500', 'text-xs text-slate-500')}>Next 7 days</p>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-6 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
                    <h3 className={`text-lg font-bold mb-4 ${dark('text-slate-900', 'text-white')}`}>Spending Insights</h3>
                    <div className={`flex items-center justify-center h-48 rounded-lg mb-4 ${dark('bg-slate-50', 'bg-slate-700/50')}`}>
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-2 relative">
                          <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke={dark('#E5E7EB', '#374151')} strokeWidth="8"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="8" strokeDasharray={`${25.12 * 0.3} ${25.12 * 0.7}`} strokeDashoffset="0"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray={`${25.12 * 0.2} ${25.12 * 0.8}`} strokeDashoffset={`-${25.12 * 0.3}`}/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="8" strokeDasharray={`${25.12 * 0.15} ${25.12 * 0.85}`} strokeDashoffset={`-${25.12 * 0.5}`}/>
                          </svg>
                        </div>
                        <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>Spending by Category</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className={dark('text-slate-600', 'text-slate-400')}>Finance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={dark('text-slate-600', 'text-slate-400')}>Development</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className={dark('text-slate-600', 'text-slate-400')}>Cloud Services</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className={`min-w-[1200px] p-6 ${dark('bg-[#F9FAFB]', 'bg-slate-900')}`}>
                  {/* Top Navigation */}
                  <div className={`flex items-center justify-between mb-6 pb-4 border-b ${dark('border-slate-200', 'border-slate-700')}`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
                        alt="Subsy logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                        loading="eager"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('data:')) {
                            target.src = isDarkMode 
                              ? '/subsy-logo-darktheme.png?t=' + Date.now()
                              : '/subsy-logo.png?t=' + Date.now();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'dashboard'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'subscriptions'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Subscriptions
                      </button>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'calendar'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar
                      </button>
                      <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-lg transition-colors ${dark('hover:bg-slate-100', 'hover:bg-slate-700')}`}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      >
                        {isDarkMode ? (
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=12"
                          alt="John Doe"
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (!target.nextElementSibling?.classList.contains('avatar-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = `avatar-fallback w-8 h-8 rounded-full ${dark('bg-slate-300', 'bg-slate-600')} flex items-center justify-center text-white text-xs font-semibold`;
                              fallback.textContent = 'JD';
                              target.parentNode?.insertBefore(fallback, target.nextSibling);
                            }
                          }}
                        />
                        <span className={`text-sm ${dark('text-slate-700', 'text-slate-300')}`}>John Doe</span>
                        <svg className={`w-4 h-4 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Page Header */}
                  <div className="mb-6">
                    <h1 className={`text-3xl font-bold mb-1 ${dark('text-slate-900', 'text-white')}`}>Subscriptions</h1>
                    <p className={dark('text-slate-600', 'text-slate-400')}>Manage all your subscriptions</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mb-4 flex items-center justify-end gap-3">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600">
                      + Add Subscription
                    </button>
                    <button className={`px-4 py-2 border rounded-lg text-sm font-semibold flex items-center gap-1 ${dark('border-blue-500 text-blue-600 hover:bg-blue-50', 'border-blue-400 text-blue-400 hover:bg-blue-900/20')}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mb-6 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search name, category, c..."
                        className={`w-full px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 bg-white', 'border-slate-600 bg-slate-800 text-white placeholder-slate-500')}`}
                      />
                    </div>
                    <button className={`px-4 py-2 border rounded-lg text-sm ${dark('bg-white border-slate-300 text-slate-700 hover:bg-slate-50', 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                      All (253)
                    </button>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">
                      Active (220)
                    </button>
                    <button className={`px-4 py-2 border rounded-lg text-sm ${dark('bg-white border-slate-300 text-slate-700 hover:bg-slate-50', 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                      Inactive (33)
                    </button>
                    <select className={`px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 bg-white', 'border-slate-600 bg-slate-800 text-white')}`}>
                      <option>Renewal Date (Earliest)</option>
                    </select>
                    <button className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-1 ${dark('bg-white border-slate-300 text-slate-700 hover:bg-slate-50', 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                      Show Advanced Filters
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Subscription Cards Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'ExpressVPN 255', category: 'Security', price: '£4.24 /Week', days: 0 },
                      { name: 'DigitalOcean 67', category: 'Development', price: '$5.50 /Week', days: 0 },
                      { name: 'Stripe 125', category: 'Cloud Services', price: '£14.39 /Month', days: 1 },
                      { name: 'AWS 184', category: 'Education', price: '$49.09 /Week', days: 2 },
                      { name: 'Canva 240', category: 'Finance', price: '$3.80 /Week', days: 3 },
                      { name: 'Disney+ 153', category: 'Design', price: '€4.84 /Week', days: 5, trial: true },
                    ].map((sub, i) => {
                      const renewal = getRenewalDate(sub.days);
                      const isRenewingToday = sub.days === 0;
                      return (
                        <div key={i} className={`relative rounded-lg p-4 hover:shadow-md transition-shadow ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')} ${isRenewingToday ? 'animate-pulse-glow' : ''}`}>
                          {/* "Today" Badge - Top Right Corner */}
                          {isRenewingToday && (
                            <div className="absolute -top-1.5 -right-1.5 z-20">
                              <div className="relative bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-shimmer-glow overflow-hidden">
                                {/* Shimmer overlay effect */}
                                <div className="absolute inset-0 animate-shimmer-sweep opacity-30"></div>
                                <svg className="w-3 h-3 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2s' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-wide relative z-10">Today</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark('bg-slate-100', 'bg-slate-700')}`}>
                                {getSubscriptionIcon(sub.name, sub.category)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-bold ${dark('text-slate-900', 'text-white')}`}>{sub.name}</p>
                                  {sub.trial && (
                                    <span className={`px-2 py-0.5 text-xs rounded font-semibold ${dark('bg-blue-100 text-blue-700', 'bg-blue-900/50 text-blue-300')}`}>Trial</span>
                                  )}
                                </div>
                                <p className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>{sub.category}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-lg font-bold ${dark('text-slate-900', 'text-white')}`}>{sub.price}</span>
                              <button className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${dark('text-slate-600 hover:bg-slate-100', 'text-slate-400 hover:bg-slate-700')}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Convert
                              </button>
                            </div>
                            <div className={dark('text-xs text-slate-600', 'text-xs text-slate-400')}>
                              <p>Next renewal {renewal}</p>
                              {!isRenewingToday && (
                                <p className="text-orange-600 font-semibold mt-1">{sub.days} days remaining</p>
                              )}
                            </div>
                            <div className={dark('text-xs text-slate-500', 'text-xs text-slate-500')}>
                              <p className={`flex items-center gap-1 cursor-pointer ${dark('hover:text-slate-700', 'hover:text-slate-300')}`}>
                                Show Details
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </p>
                              {!isRenewingToday && (
                                <p className="mt-1">Reminder set for {sub.days === 1 ? '3' : sub.days === 2 ? '7' : '5'} days before</p>
                              )}
                            </div>
                          </div>
                          <div className={`flex gap-2 pt-3 border-t ${dark('border-slate-100', 'border-slate-700')}`}>
                            <button className={`flex-1 px-3 py-2 border rounded-lg text-xs flex items-center justify-center gap-1 ${dark('border-slate-300 text-slate-700 hover:bg-slate-50', 'border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button className={`px-3 py-2 border rounded-lg text-xs ${dark('border-slate-300 text-slate-700 hover:bg-slate-50', 'border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className={`min-w-[1200px] p-6 ${dark('bg-[#F9FAFB]', 'bg-slate-900')}`}>
                  {/* Top Navigation */}
                  <div className={`flex items-center justify-between mb-6 pb-4 border-b ${dark('border-slate-200', 'border-slate-700')}`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={isDarkMode ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
                        alt="Subsy logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                        loading="eager"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('data:')) {
                            target.src = isDarkMode 
                              ? '/subsy-logo-darktheme.png?t=' + Date.now()
                              : '/subsy-logo.png?t=' + Date.now();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'dashboard'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'subscriptions'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Subscriptions
                      </button>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-1 pb-1 transition-all ${
                          activeTab === 'calendar'
                            ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                            : dark('text-slate-600 hover:text-slate-900', 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar
                      </button>
                      <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-lg transition-colors ${dark('hover:bg-slate-100', 'hover:bg-slate-700')}`}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      >
                        {isDarkMode ? (
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=12"
                          alt="John Doe"
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (!target.nextElementSibling?.classList.contains('avatar-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = `avatar-fallback w-8 h-8 rounded-full ${dark('bg-slate-300', 'bg-slate-600')} flex items-center justify-center text-white text-xs font-semibold`;
                              fallback.textContent = 'JD';
                              target.parentNode?.insertBefore(fallback, target.nextSibling);
                            }
                          }}
                        />
                        <span className={`text-sm ${dark('text-slate-700', 'text-slate-300')}`}>John Doe</span>
                        <svg className={`w-4 h-4 ${dark('text-slate-600', 'text-slate-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Page Header */}
                  <div className="mb-6">
                    <h1 className={`text-3xl font-bold mb-1 ${dark('text-slate-900', 'text-white')}`}>Calendar</h1>
                    <p className={dark('text-slate-600', 'text-slate-400')}>Renewals and trial end dates</p>
                  </div>

                  {/* Calendar Navigation */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className={`px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 text-slate-700 hover:bg-slate-50', 'border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                        Prev
                      </button>
                      <h2 className={`text-xl font-bold ${dark('text-slate-900', 'text-white')}`}>January 2026</h2>
                      <button className={`px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 text-slate-700 hover:bg-slate-50', 'border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                        Next
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className={`px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 text-slate-700 hover:bg-slate-50', 'border-slate-600 text-slate-300 hover:bg-slate-700')}`}>
                        Today
                      </button>
                      <select className={`px-4 py-2 border rounded-lg text-sm ${dark('border-slate-300 bg-white', 'border-slate-600 bg-slate-800 text-white')}`}>
                        <option>Month View</option>
                        <option>Week View</option>
                        <option>Day View</option>
                      </select>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className={`rounded-lg p-4 ${dark('bg-white border border-slate-200', 'bg-slate-800 border border-slate-700')}`}>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <div key={day} className={`text-center text-xs font-semibold py-2 ${dark('text-slate-600', 'text-slate-400')}`}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Empty cells for days before month starts */}
                      {[29, 30, 31].map((day) => (
                        <div key={`prev-${day}`} className={`min-h-[100px] p-2 border rounded-lg ${dark('border-slate-100 bg-slate-50', 'border-slate-700 bg-slate-800/50')}`}>
                          <div className="text-xs text-slate-400 mb-2">{day}</div>
                        </div>
                      ))}
                      
                      {/* January days */}
                      {[
                        { day: 1, subs: ['Trello 100', 'NordVPN 29'], trials: ['AWS 31'] },
                        { day: 2, subs: ['Netflix 228'] },
                        { day: 3, subs: [], trials: ['Spotify Premium'] },
                        { day: 4, subs: [] },
                        { day: 5, subs: ['Adobe Creative Cloud'] },
                        { day: 6, subs: [] },
                        { day: 7, subs: ['Google Cloud'], trials: ['Figma Pro'], more: 4 },
                        { day: 8, subs: [] },
                        { day: 9, subs: [], trials: ['Notion Plus'] },
                        { day: 10, subs: ['Microsoft 365'] },
                        { day: 11, subs: [] },
                        { day: 12, subs: [] },
                        { day: 13, subs: ['Amazon Prime'], trials: ['Canva Pro'] },
                        { day: 14, subs: [] },
                        { day: 15, subs: ['Disney+'], trials: ['Zoom Pro'], more: 1 },
                      ].map(({ day, subs, trials = [], more }) => (
                        <div key={day} className={`min-h-[100px] p-2 border rounded-lg transition-colors ${dark('border-slate-200 hover:bg-slate-50', 'border-slate-700 hover:bg-slate-700/50')}`}>
                          <div className={`text-sm font-semibold mb-2 ${dark('text-slate-900', 'text-white')}`}>{day}</div>
                          <div className="space-y-1">
                            {subs.map((sub, i) => (
                              <div
                                key={`sub-${i}`}
                                className={`px-2 py-1 text-xs rounded cursor-pointer ${dark('bg-green-100 text-green-800 hover:bg-green-200', 'bg-green-900/50 text-green-300 hover:bg-green-900/70')}`}
                              >
                                {sub}
                              </div>
                            ))}
                            {trials.map((trial, i) => (
                              <div
                                key={`trial-${i}`}
                                className={`px-2 py-1 text-xs rounded cursor-pointer ${dark('bg-blue-100 text-blue-800 hover:bg-blue-200', 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/70')}`}
                              >
                                {trial} (Trial)
                              </div>
                            ))}
                            {more && (
                              <div className={dark('text-xs text-slate-500', 'text-xs text-slate-400')}>+{more} more</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : (
            // Mobile View - iPhone 17 Frame
            <div className="relative rounded-[3rem] bg-gradient-to-br from-slate-900 to-black border-[3px] border-slate-800 overflow-hidden shadow-2xl max-w-[375px] mx-auto">
              {/* iPhone 17 Dynamic Island and Status Bar */}
              <div className={`${dark('bg-slate-900', 'bg-black')} rounded-t-[3rem] pt-2 pb-3 px-5 flex items-center justify-center relative`}>
                {/* Dynamic Island - iPhone 17 style (pill-shaped) */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-10">
                  {/* Camera and speaker */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                    {/* Camera */}
                    <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    {/* Speaker */}
                    <div className="w-8 h-1.5 bg-slate-800 rounded-full"></div>
                  </div>
                </div>
                {/* Status bar icons - iPhone 17 style */}
                <div className="flex items-center justify-between w-full text-white text-[13px] font-semibold mt-1 px-1">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    {/* Signal bars */}
                    <div className="flex items-end gap-0.5">
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-2.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-3 bg-white rounded-sm"></div>
                    </div>
                    {/* WiFi icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    {/* Battery icon */}
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-3 border border-white/60 rounded-sm relative">
                        <div className="absolute left-0.5 top-0.5 bottom-0.5 w-4 bg-white rounded-sm"></div>
                      </div>
                      <div className="w-0.5 h-1.5 bg-white/60 rounded-r-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Content - iPhone 17 */}
              <div 
                className={`relative overflow-y-auto ${dark('bg-white', 'bg-slate-900')}`} 
                style={{ 
                  height: '800px',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
                }}
              >
                {activeTab === 'dashboard' && (
                  <MobileDashboard isDarkMode={isDarkMode} dark={dark} viewport={viewport} />
                )}
                {activeTab === 'subscriptions' && (
                  <MobileSubscriptions isDarkMode={isDarkMode} dark={dark} viewport={viewport} />
                )}
                {activeTab === 'calendar' && (
                  <MobileCalendar isDarkMode={isDarkMode} dark={dark} viewport={viewport} />
                )}
              </div>

              {/* Bottom Navigation Bar - iPhone 17 style */}
              <div className={`border-t ${dark('bg-white border-slate-200', 'bg-slate-900 border-slate-700')} px-4 py-2.5 rounded-b-[3rem]`} style={{ touchAction: 'manipulation' }}>
                <div className="flex items-center justify-around">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex flex-col items-center gap-1 active:opacity-70 active:scale-95 transition-transform ${activeTab === 'dashboard' ? 'text-teal-600' : dark('text-slate-600', 'text-slate-400')}`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs">Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('subscriptions')}
                    className={`flex flex-col items-center gap-1 active:opacity-70 active:scale-95 transition-transform ${activeTab === 'subscriptions' ? 'text-teal-600' : dark('text-slate-600', 'text-slate-400')}`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-xs">Subscriptions</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`flex flex-col items-center gap-1 active:opacity-70 active:scale-95 transition-transform ${activeTab === 'calendar' ? 'text-teal-600' : dark('text-slate-600', 'text-slate-400')}`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Calendar</span>
                  </button>
                  <button className={`flex flex-col items-center gap-1 active:opacity-70 active:scale-95 transition-transform ${dark('text-slate-600', 'text-slate-400')}`} style={{ touchAction: 'manipulation' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-base sm:text-lg text-slate-600 mb-6">
            Ready to take control of your subscriptions?
          </p>
          <a
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-brand-accent-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent-500/50 hover:scale-105"
          >
            Start Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

