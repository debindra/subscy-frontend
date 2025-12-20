import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { subscriptionsApi, CreateSubscriptionData } from '@/lib/api/subscriptions';

const SUBSCRIPTIONS_KEY = ['subscriptions'];
const UPCOMING_SUBSCRIPTIONS_KEY = ['subscriptions', 'upcoming'];

/**
 * Invalidates all analytics queries that depend on subscription data.
 * This includes:
 * - Spending summaries (with any currency parameter)
 * - Monthly trends (with any months parameter)
 * - Category spending breakdowns
 * - Subscription statistics
 * - All subscription queries (including upcoming renewals and individual subscription details)
 * 
 * Using prefix matching to catch all variations with different parameters.
 */
const invalidateAllAnalyticsQueries = (queryClient: QueryClient) => {
  // Invalidate all dashboard analytics queries (catches all variations with parameters)
  queryClient.invalidateQueries({ 
    queryKey: ['dashboard'],
    exact: false, // Match all queries starting with 'dashboard'
  });
  
  // Invalidate subscription stats
  queryClient.invalidateQueries({ 
    queryKey: ['subscription-stats'],
  });
  
  // Invalidate all subscription queries (includes upcoming renewals, individual subscriptions, etc.)
  queryClient.invalidateQueries({ 
    queryKey: ['subscriptions'],
    exact: false, // Match all queries starting with 'subscriptions'
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionsApi.create(data),
    onSuccess: async () => {
      // Invalidate subscription list queries (all subscriptions and upcoming renewals list)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY }),
        queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY }), // Upcoming renewals list
      ]);
      
      // Explicitly refetch upcoming subscriptions to ensure UI updates immediately
      // New subscriptions might appear in the upcoming list if they're renewing soon
      await queryClient.refetchQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      invalidateAllAnalyticsQueries(queryClient);
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<CreateSubscriptionData> }) =>
      subscriptionsApi.update(payload.id, payload.data),
    onSuccess: async () => {
      // Invalidate subscription list queries (all subscriptions and upcoming renewals list)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY }),
        queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY }), // Upcoming renewals list
      ]);
      
      // Explicitly refetch upcoming subscriptions to ensure UI updates immediately
      // This is critical because renewal date changes affect what appears in the upcoming list
      await queryClient.refetchQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      invalidateAllAnalyticsQueries(queryClient);
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: async () => {
      // Invalidate subscription list queries (all subscriptions and upcoming renewals list)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY }),
        queryClient.invalidateQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY }), // Upcoming renewals list
      ]);
      
      // Explicitly refetch upcoming subscriptions to ensure UI updates immediately
      // Deleted subscriptions should be removed from the upcoming list
      await queryClient.refetchQueries({ queryKey: UPCOMING_SUBSCRIPTIONS_KEY });
      
      // Invalidate all analytics queries that depend on subscriptions
      invalidateAllAnalyticsQueries(queryClient);
    },
  });
};


