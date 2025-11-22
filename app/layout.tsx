import type { Metadata } from 'next';
import { Albert_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { PWASetup } from '@/components/layout/PWASetup';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Subsy - Subscription Finance Platform | Track & Optimize Recurring Spend',
    template: '%s | Subsy',
  },
  description: 'Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time. Track subscriptions, automate renewals, and optimize spend.',
  keywords: [
    'subscription management',
    'recurring spend tracking',
    'finance operations',
    'subscription analytics',
    'vendor management',
    'renewal automation',
    'spend optimization',
    'SaaS management',
    'subscription finance',
    'recurring revenue tracking',
  ],
  authors: [{ name: 'Subsy' }],
  creator: 'Subsy',
  publisher: 'Subsy',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://subsy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Subsy',
    title: 'Subsy - Subscription Finance Platform | Track & Optimize Recurring Spend',
    description: 'Subsy brings together payments, renewals, and vendor analytics so finance and operations teams can orchestrate every recurring dollar in real time.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Subsy - Subscription Finance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subsy - Subscription Finance Platform',
    description: 'Track subscriptions, automate renewals, and optimize spend with Subsy.',
    images: ['/og-image.png'],
    creator: '@subsy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Subsy',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${albertSans.variable} font-albert-sans bg-gray-50 dark:bg-gray-900 overflow-y-hidden`}>
        <PWASetup />
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

