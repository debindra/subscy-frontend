import { apiClient } from './client';

export interface CurrencySpendingSummary {
  currency: string;
  monthlyTotal: number;
  yearlyTotal: number;
  totalSubscriptions: number;
}

export interface ConvertedSpendingSummary {
  monthlyTotal: number;
  yearlyTotal: number;
  currency: string;
}

export interface SpendingSummaryResponse {
  converted?: ConvertedSpendingSummary;
  byCurrency: CurrencySpendingSummary[];
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  inactive: number;
  categories: number;
}

export const analyticsApi = {
  getSpending: (baseCurrency?: string) => {
    const config = baseCurrency ? { params: { baseCurrency } } : undefined;
    return apiClient.get<SpendingSummaryResponse | CurrencySpendingSummary[]>('/analytics/spending', config);
  },
  
  getByCategory: () => apiClient.get<CategorySpending[]>('/analytics/by-category'),
  
  getMonthlyTrend: (months: number = 12) =>
    apiClient.get<MonthlyTrend[]>(`/analytics/monthly-trend?months=${months}`),
  
  getStats: () => apiClient.get<SubscriptionStats>('/analytics/stats'),
};

