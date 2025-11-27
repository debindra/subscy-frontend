import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi, CreateSubscriptionData } from '@/lib/api/subscriptions';

const SUBSCRIPTIONS_KEY = ['subscriptions'];
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'];

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<CreateSubscriptionData> }) =>
      subscriptionsApi.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
    },
  });
};


