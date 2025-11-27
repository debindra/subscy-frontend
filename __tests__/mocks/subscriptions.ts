import { Subscription } from '@/lib/api/subscriptions';

const baseDate = new Date().toISOString();

export const mockActiveSubscription: Subscription = {
  id: 'sub-active',
  userId: 'user-1',
  name: 'Netflix',
  amount: 15.99,
  currency: 'USD',
  billingCycle: 'monthly',
  nextRenewalDate: baseDate,
  category: 'Entertainment',
  description: 'Streaming service',
  website: 'https://netflix.com',
  isActive: true,
  reminderEnabled: true,
  reminderDaysBefore: 7,
  paymentMethod: 'credit_card',
  lastFourDigits: '1234',
  cardBrand: 'Visa',
  isTrial: false,
  trialEndDate: null,
  createdAt: baseDate,
  updatedAt: baseDate,
};

export const mockTrialSubscription: Subscription = {
  ...mockActiveSubscription,
  id: 'sub-trial',
  name: 'Figma',
  category: 'Design',
  amount: 0,
  isTrial: true,
  trialEndDate: baseDate,
  isActive: true,
};

export const mockInactiveSubscription: Subscription = {
  ...mockActiveSubscription,
  id: 'sub-inactive',
  name: 'Gym Membership',
  category: 'Fitness',
  isActive: false,
};

export const mockSubscriptions: Subscription[] = [
  mockActiveSubscription,
  mockTrialSubscription,
  mockInactiveSubscription,
];

