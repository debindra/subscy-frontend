import { apiClient } from './client';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  nextRenewalDate: string;
  category: string;
  description?: string;
  website?: string;
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
  nextRenewalDate: string;
  category: string;
  description?: string;
  website?: string;
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
  getAll: () => apiClient.get<Subscription[]>('/subscriptions/'),
  
  getById: (id: string) => apiClient.get<Subscription>(`/subscriptions/${id}`),
  
  getUpcoming: () => apiClient.get<Subscription[]>('/subscriptions/upcoming'),
  
  create: (data: CreateSubscriptionData) => apiClient.post<Subscription>('/subscriptions/', data),
  
  update: (id: string, data: Partial<CreateSubscriptionData>) =>
    apiClient.patch<Subscription>(`/subscriptions/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/subscriptions/${id}`),
};

