import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi, CreateSubscriptionData } from '@/lib/api/subscriptions';

const SUBSCRIPTIONS_KEY = ['subscriptions'];
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'];

// Analytics query keys that need to be invalidated when subscriptions change
const DASHBOARD_ANALYTICS_KEYS = [
  ['dashboard', 'spending'],
  ['dashboard', 'monthlyTrend'],
  ['dashboard', 'categorySpending'],
  ['subscription-stats'],
];

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionsApi.create(data),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      DASHBOARD_ANALYTICS_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<CreateSubscriptionData> }) =>
      subscriptionsApi.update(payload.id, payload.data),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      DASHBOARD_ANALYTICS_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      DASHBOARD_ANALYTICS_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};


