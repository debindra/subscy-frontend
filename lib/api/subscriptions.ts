import { apiClient } from './client';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  nextRenewalDate: string;
  lastRenewalDate?: string; // Track when subscription was last renewed
  category: string;
  description?: string;
  website?: string;
  email?: string;
  plan?: string; // Optional subscription plan (e.g., Basic, Pro, Premium)
  isActive: boolean;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  paymentMethod?: string;
  lastFourDigits?: string;
  cardBrand?: string;
  isTrial: boolean;
  trialEndDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionData {
  name: string;
  amount: number;
  currency?: string;
  billingCycle: string;
  nextRenewalDate?: string; // Optional - will be calculated automatically
  category: string;
  description?: string;
  website?: string;
  email?: string;
  plan?: string; // Optional subscription plan (e.g., Basic, Pro, Premium)
  isActive?: boolean;
  reminderEnabled?: boolean;
  reminderDaysBefore?: number;
  paymentMethod?: string;
  lastFourDigits?: string;
  cardBrand?: string;
  isTrial?: boolean;
  trialEndDate?: string;
}

export const subscriptionsApi = {
  getAll: (autoUpdate: boolean = true) => 
    apiClient.get<Subscription[]>('/subscriptions/', { params: { auto_update: autoUpdate } }),
  
  getById: (id: string, autoUpdate: boolean = true) => 
    apiClient.get<Subscription>(`/subscriptions/${id}`, { params: { auto_update: autoUpdate } }),
  
  getUpcoming: (days: number = 7, autoUpdate: boolean = true) => 
    apiClient.get<Subscription[]>('/subscriptions/upcoming', { params: { days, auto_update: autoUpdate } }),
  
  create: (data: CreateSubscriptionData) => apiClient.post<Subscription>('/subscriptions/', data),
  
  update: (id: string, data: Partial<CreateSubscriptionData>) =>
    apiClient.patch<Subscription>(`/subscriptions/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/subscriptions/${id}`),

  renew: (id: string) => apiClient.post<{ message: string; nextRenewalDate: string }>(`/subscriptions/${id}/renew`),
};

