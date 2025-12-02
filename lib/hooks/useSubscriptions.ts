import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';

const SUBSCRIPTIONS_KEY = ['subscriptions'] as const;
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'] as const;

export const useSubscriptions = () => {
  return useQuery<Subscription[]>({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: async () => {
      const res = await subscriptionsApi.getAll();
      return res.data;
    },
  });
};

export const useUpcomingSubscriptions = () => {
  return useQuery<Subscription[]>({
    queryKey: UPCOMING_SUBSCRIPTIONS_KEY,
    queryFn: async () => {
      const res = await subscriptionsApi.getUpcoming();
      return res.data;
    },
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
  });
};


