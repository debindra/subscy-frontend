import { useQuery } from '@tanstack/react-query';
import { analyticsApi, SubscriptionStats } from '@/lib/api/analytics';

const SUBSCRIPTION_STATS_KEY = ['subscription-stats'] as const;

export const useSubscriptionStats = () =>
  useQuery<SubscriptionStats>({
    queryKey: SUBSCRIPTION_STATS_KEY,
    queryFn: async () => {
      const res = await analyticsApi.getStats();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });