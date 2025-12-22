import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { useAuth } from './useAuth';

const SUBSCRIPTIONS_KEY = ['subscriptions'] as const;
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'] as const;

export const useSubscriptions = (options?: { enabled?: boolean }) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<Subscription[]>({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: async () => {
      const res = await subscriptionsApi.getAll();
      return res.data;
    },
    enabled: options?.enabled !== false && !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 0, // Always consider data stale - ensures immediate refetch after invalidation
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true, // Override global setting - ensure refetch when component mounts or query becomes active
    placeholderData: (previousData) => previousData, // Keep previous data while refetching (v5 syntax)
  });
};

export const useUpcomingSubscriptions = (days: number = 7) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<Subscription[]>({
    queryKey: [...UPCOMING_SUBSCRIPTIONS_KEY, days],
    queryFn: async () => {
      const res = await subscriptionsApi.getUpcoming(days);
      return res.data;
    },
    enabled: !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 0, // Always consider data stale - ensures immediate refetch after invalidation
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true, // Override global setting - ensure refetch when component mounts or query becomes active
    placeholderData: (previousData) => previousData, // Keep previous data while refetching (v5 syntax)
  });
};

export const useSubscription = (id: string) => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<Subscription>({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const res = await subscriptionsApi.getById(id);
      return res.data;
    },
    enabled: !!id && !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 0, // Always consider data stale - ensures immediate refetch after invalidation
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true, // Override global setting - ensure refetch when component mounts or query becomes active
    placeholderData: (previousData) => previousData, // Keep previous data while refetching (v5 syntax)
  });
};


