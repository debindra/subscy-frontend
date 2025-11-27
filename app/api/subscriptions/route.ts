import { NextResponse } from 'next/server';

// Mock subscription data for testing
const mockSubscriptions = [
  {
    id: 'sub-1',
    userId: 'user-1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    userId: 'user-1',
    name: 'Spotify',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    category: 'Entertainment',
    description: 'Music streaming',
    website: 'https://spotify.com',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 3,
    paymentMethod: 'paypal',
    lastFourDigits: null,
    cardBrand: null,
    isTrial: false,
    trialEndDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    userId: 'user-1',
    name: 'Adobe Creative Cloud',
    amount: 52.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    category: 'Productivity',
    description: 'Design software suite',
    website: 'https://adobe.com',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: 'credit_card',
    lastFourDigits: '5678',
    cardBrand: 'Mastercard',
    isTrial: false,
    trialEndDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockSubscriptions);
}