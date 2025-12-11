// Landing page constants and TypeScript interfaces

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Metric {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface NotificationChannel {
  name: string;
  description: string;
  channel: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
  timestamp: string;
  verified: boolean;
  image: string;
}

export interface PricingTier {
  name: string;
  monthlyPrice: string;
  annualPrice: string | null;
  description: string;
  features: string[];
  highlighted?: boolean;
  annualSavings?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const FEATURES: Feature[] = [
  {
    title: 'Unlimited Subscription Tracking',
    description:
      'Track unlimited subscriptions with Pro plan. Organize everything in one centralized dashboard with smart categorization and advanced analytics.',
    icon: '🔔',
  },
  {
    title: 'Customizable Alerts & Notifications',
    description:
      'Set custom reminder windows and receive alerts via email and push notifications. Pro and Ultimate plans offer flexible timing options for every subscription.',
    icon: '📱',
  },
  {
    title: 'Advanced Budgeting & Analytics',
    description:
      'Monitor spending with advanced analytics, category-wise budgeting, and smart renewal management. Export data and collaborate with your team on Ultimate plan.',
    icon: '⚡',
  },
];

export const METRICS: Metric[] = [
  { label: 'Alerts Delivered', value: '2.5M+', trend: '▲ 99.9% delivery rate', trendColor: 'text-primary-600' },
  { label: 'Renewals Prevented', value: '94%', trend: 'Users avoid unwanted charges', trendColor: 'text-primary-600' },
  { label: 'Average Time Saved', value: '12 hrs', trend: 'Per month per user', trendColor: 'text-primary-600' },
];

export const STEPS: Step[] = [
  {
    number: '01',
    title: 'Add your subscriptions',
    description: 'Quickly add all your subscriptions manually or import from your accounts. Subsy automatically tracks renewal dates and payment schedules.',
  },
  {
    number: '02',
    title: 'Configure your alerts',
    description: 'Customize when and how you want to be notified. Set alert preferences for each subscription—email, SMS, or push notifications.',
  },
  {
    number: '03',
    title: 'Stay ahead of renewals',
    description: 'Receive timely notifications before every renewal. Never miss a payment or get surprised by unexpected charges again.',
  },
];

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  { 
    name: 'Email', 
    description: 'Get instant email alerts for all your subscription renewals',
    channel: 'email'
  },
  { 
    name: 'SMS', 
    description: 'Receive text messages directly to your phone',
    channel: 'sms'
  },
  { 
    name: 'Push Notifications', 
    description: 'Real-time browser and mobile push alerts',
    channel: 'push notifications'
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Subsy\'s alert system saved me from three unwanted renewals in the first month. The SMS notifications are a game-changer—I never miss an alert now.',
    name: 'Sarah Martinez',
    role: 'Freelance Designer',
    rating: 5,
    timestamp: '1 month ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The customizable alert windows are perfect for our team. We get notified 30 days before renewals, giving us plenty of time to review and cancel if needed.',
    name: 'Michael Chen',
    role: 'Small Business Owner',
    rating: 5,
    timestamp: '2 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'I was spending hours tracking my subscriptions manually. Subsy automated everything and now I get alerts exactly when I need them. It\'s saved me both time and money.',
    name: 'Emily Rodriguez',
    role: 'Marketing Manager',
    rating: 5,
    timestamp: '3 weeks ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The price change alerts are incredible! I caught a subscription price increase before it renewed and was able to cancel. This tool pays for itself.',
    name: 'David Kim',
    role: 'Software Engineer',
    rating: 5,
    timestamp: '4 days ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'As someone with multiple subscriptions across different services, Subsy keeps everything organized in one place. The dashboard is clean and easy to use.',
    name: 'Jessica Thompson',
    role: 'Content Creator',
    rating: 5,
    timestamp: '1 week ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'The multi-channel notifications mean I never miss an alert. Whether I\'m at my desk or on the go, I always know when a subscription is about to renew.',
    name: 'Robert Williams',
    role: 'Entrepreneur',
    rating: 5,
    timestamp: '2 weeks ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'As a student on a tight budget, Subsy has helped me save over $200 in the past 6 months by catching subscriptions I forgot about. Essential tool!',
    name: 'Alex Johnson',
    role: 'University Student',
    rating: 5,
    timestamp: '3 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'Our finance team uses Subsy to track all company subscriptions. The export features and analytics have made our expense reporting so much easier.',
    name: 'Priya Sharma',
    role: 'Finance Director',
    rating: 5,
    timestamp: '5 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    quote:
      'Being a digital nomad, I need reliable notifications across time zones. Subsy\'s international support and mobile app keep me connected everywhere.',
    name: 'Carlos Silva',
    role: 'Remote Developer',
    rating: 5,
    timestamp: '2 months ago',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  },
];

export const TESTIMONIAL_GAP_REM = 1.5;

export const PRICING: PricingTier[] = [
  {
    name: 'Starter',
    monthlyPrice: '$0',
    annualPrice: null,
    description: 'Basic organization, critical reminders.',
    features: [
      '5 Subscriptions',
      'Email Alerts (7 days before renewal)',
      'Basic Spending Summary',
      'Overall Budget Tracking',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$4.99',
    annualPrice: '$47.88',
    description: 'Unlimited tracking, Advanced budgeting, App Push Notifications.',
    features: [
      'Unlimited Subscription Tracking',
      'Customizable Reminder Timing (1-30 days)',
      'Email & Push Notifications',
      'Advanced Spending Analytics',
      'Category-Based Budgeting',
      'Data Import & Batch Upload',
      'Auto-Renewal Date Calculation',
      'Cancellation Link Storage',
    ],
    highlighted: true,
    annualSavings: 'Save 20%',
  },
  {
    name: 'Ultimate',
    monthlyPrice: '$9.99',
    annualPrice: '$95.88',
    description: 'Sharing, Data Export, Multi-Currency, Priority Support.',
    features: [
      'All Pro Features',
      'Data Export (CSV/PDF)',
      'Multi-Currency Support',
      'Team Sharing (5 Users)',
      'Individual User Dashboards',
      'Priority Support',
    ],
    annualSavings: 'Save 20%',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How reliable are the subscription alerts?',
    answer:
      'Our alert system has a 99.9% delivery rate. We use multiple notification channels (email, SMS, push) to ensure you never miss a renewal. If one channel fails, we automatically try the others.',
  },
  {
    question: 'Can I customize when I receive alerts?',
    answer:
      'Yes! Pro and Ultimate plans allow you to set custom alert windows—get notified 30, 14, 7, or 1 day before renewals. You can also set different preferences for each subscription.',
  },
  {
    question: 'What happens if I miss an alert?',
    answer:
      'We send multiple reminders as the renewal date approaches. You\'ll receive alerts at your chosen intervals, plus a final notification 24 hours before the renewal. All alerts are logged in your dashboard.',
  },
  {
    question: 'Do you support SMS notifications?',
    answer:
      'Yes! Push notifications are available on Pro and Ultimate plans. You can choose to receive alerts via email, push notifications, or both channels for maximum reliability.',
  },
];
