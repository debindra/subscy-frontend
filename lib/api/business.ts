import { apiClient } from './client';

export interface BusinessProfilePayload {
  companyName: string;
  companyAddress?: string;
  companyTaxId?: string;
  companyPhone?: string;
}

export interface PlanAnalyticsLimits {
  monthly_trend?: {
    enabled?: boolean;
    max_months?: number | null;
  };
  category_breakdown?: boolean;
  advanced?: boolean;
}

export interface PlanExportLimits {
  csv?: boolean;
  pdf?: boolean;
}

export interface PlanLimits {
  max_subscriptions?: number | null;
  max_team_seats?: number | null;
  analytics?: PlanAnalyticsLimits;
  exports?: PlanExportLimits;
  business_profile?: boolean;
  priority_support?: boolean;
  categorization?: boolean;
  smart_renewal_management?: boolean;
  cancellation_notes?: boolean;
  shared_accounts?: boolean;
  individual_dashboards?: boolean;
}

export interface PlanResponse {
  accountType: 'free' | 'pro' | 'family' | 'personal' | 'business' | string;
  limits: PlanLimits;
}

export const businessApi = {
  getProfile: () => apiClient.get('/business/profile'),
  upsertProfile: (payload: BusinessProfilePayload) =>
    apiClient.put('/business/profile', payload),
  getCurrentPlan: () => apiClient.get<PlanResponse>('/business/plan'),
};

