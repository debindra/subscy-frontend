import { useQuery } from '@tanstack/react-query';
import {
  analyticsApi,
  CategorySpending,
  CurrencySpendingSummary,
  MonthlyTrend,
  SpendingSummaryResponse,
} from '@/lib/api/analytics';

const DASHBOARD_SPENDING_KEY = (baseCurrency?: string) => ['dashboard', 'spending', baseCurrency] as const;
const DASHBOARD_MONTHLY_TREND_KEY = (months: number) => ['dashboard', 'monthlyTrend', months] as const;
const DASHBOARD_CATEGORY_KEY = ['dashboard', 'categorySpending'] as const;

export const useDashboardSpending = (baseCurrency?: string) =>
  useQuery<SpendingSummaryResponse | CurrencySpendingSummary[]>({
    queryKey: DASHBOARD_SPENDING_KEY(baseCurrency),
    queryFn: async () => {
      const res = await analyticsApi.getSpending(baseCurrency);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });

export const useDashboardMonthlyTrend = (months: number) =>
  useQuery<MonthlyTrend[]>({
    queryKey: DASHBOARD_MONTHLY_TREND_KEY(months),
    queryFn: async () => {
      const res = await analyticsApi.getMonthlyTrend(months);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });

export const useDashboardCategorySpending = (enabled: boolean) =>
  useQuery<CategorySpending[]>({
    queryKey: DASHBOARD_CATEGORY_KEY,
    queryFn: async () => {
      const res = await analyticsApi.getByCategory();
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });


