import { useQuery } from '@tanstack/react-query';
import {
  analyticsApi,
  CategorySpending,
  CurrencySpendingSummary,
  MonthlyTrend,
  SpendingSummaryResponse,
} from '@/lib/api/analytics';
import { useAuth } from './useAuth';

const DASHBOARD_SPENDING_KEY = (baseCurrency?: string) => ['dashboard', 'spending', baseCurrency] as const;
const DASHBOARD_MONTHLY_TREND_KEY = (months: number) => ['dashboard', 'monthlyTrend', months] as const;
const DASHBOARD_CATEGORY_KEY = ['dashboard', 'categorySpending'] as const;

export const useDashboardSpending = (baseCurrency?: string) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<SpendingSummaryResponse | CurrencySpendingSummary[]>({
    queryKey: DASHBOARD_SPENDING_KEY(baseCurrency),
    queryFn: async (): Promise<SpendingSummaryResponse | CurrencySpendingSummary[]> => {
      const res = await analyticsApi.getSpending(baseCurrency);
      return res.data;
    },
    enabled: !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useDashboardMonthlyTrend = (months: number) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<MonthlyTrend[]>({
    queryKey: DASHBOARD_MONTHLY_TREND_KEY(months),
    queryFn: async (): Promise<MonthlyTrend[]> => {
      const res = await analyticsApi.getMonthlyTrend(months);
      return res.data;
    },
    enabled: !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useDashboardCategorySpending = (enabled: boolean) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<CategorySpending[]>({
    queryKey: DASHBOARD_CATEGORY_KEY,
    queryFn: async (): Promise<CategorySpending[]> => {
      const res = await analyticsApi.getByCategory();
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: enabled && !loading && !!user && sessionReady, // Only run when enabled AND user is authenticated AND session token is ready
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};


