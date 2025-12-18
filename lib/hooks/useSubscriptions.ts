import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';

const SUBSCRIPTIONS_KEY = ['subscriptions'] as const;
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'] as const;

export const useSubscriptions = (options?: { enabled?: boolean }) => {
  return useQuery<Subscription[]>({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: async () => {
      const res = await subscriptionsApi.getAll();
      return res.data;
    },
    enabled: options?.enabled !== false, // Default to true, but allow disabling
    staleTime: 5 * 60 * 1000, // cache as fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpcomingSubscriptions = () => {
  return useQuery<Subscription[]>({
    queryKey: UPCOMING_SUBSCRIPTIONS_KEY,
    queryFn: async () => {
      const res = await subscriptionsApi.getUpcoming();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useSubscription = (id: string) => {
  return useQuery<Subscription>({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const res = await subscriptionsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};


