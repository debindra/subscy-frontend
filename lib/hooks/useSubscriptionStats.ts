import { useQuery } from '@tanstack/react-query';
import { analyticsApi, SubscriptionStats } from '@/lib/api/analytics';

const SUBSCRIPTION_STATS_KEY = ['subscription-stats'] as const;

const defaultStats: SubscriptionStats = {
  total: 0,
  active: 0,
  inactive: 0,
  categories: 0,
};

export const useSubscriptionStats = () =>
  useQuery<SubscriptionStats>({
    queryKey: SUBSCRIPTION_STATS_KEY,
    queryFn: async () => {
      const res = await analyticsApi.getStats();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true, // Ensure it fetches on mount even with cached data
    placeholderData: defaultStats, // Use placeholderData instead of initialData to allow fetching
  });