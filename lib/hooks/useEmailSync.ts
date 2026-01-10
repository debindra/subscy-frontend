import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailSyncApi, EmailConnection, SyncResponse } from '@/lib/api/emailSync';
import { useAuth } from './useAuth';

const CONNECTIONS_KEY = ['email-sync', 'connections'] as const;

export const useEmailConnections = () => {
  const { user, loading, sessionReady } = useAuth();
  
  return useQuery<EmailConnection[]>({
    queryKey: CONNECTIONS_KEY,
    queryFn: async () => {
      const res = await emailSyncApi.getConnections();
      return res.data.connections;
    },
    enabled: !loading && !!user && sessionReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSyncEmails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params?: { connection_id?: string; months_back?: number; max_results?: number; auto_create?: boolean }) =>
      emailSyncApi.sync(params),
    onSuccess: () => {
      // Invalidate subscriptions to refresh list
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      // Refresh connections to update last_sync_at
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
};

export const useDisconnectEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (connectionId: string) => emailSyncApi.disconnect(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
};

