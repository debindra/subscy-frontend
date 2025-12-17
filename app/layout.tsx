import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import dynamicImport from 'next/dynamic';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { ViewModeProvider } from '@/lib/context/ViewModeContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

// Dynamically import PWASetup to prevent webpack module loading issues
// ssr: false ensures it only loads on the client side
const PWASetup = dynamicImport(
  () => import('@/components/layout/PWASetup').then((mod) => ({ default: mod.PWASetup })),
  { ssr: false }
);

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Subsy - Track & Manage Your Subscriptions',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://subsy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Subsy',
    title: 'Subsy - Track & Manage Your Subscriptions',
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
    title: 'Subsy - Track & Manage Your Subscriptions',
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
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Force dynamic rendering for all pages to prevent static generation errors
// This is safe with 'standalone' output mode as pages are server-rendered
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${poppins.variable} font-poppins bg-gray-50 dark:bg-gray-900`}>
        <PWASetup />
        <PostHogProvider>
          <ThemeProvider>
            <ToastProvider>
              <QueryProvider>
                <ViewModeProvider>
                  {children}
                </ViewModeProvider>
              </QueryProvider>
            </ToastProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

