import { apiClient } from './client';

export interface EmailConnection {
  id: string;
  provider: string;
  email_address: string;
  is_active: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
  created_at: string;
}

export interface ParsedSubscription {
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextRenewalDate: string;
  confidence?: number;
  source?: string;
  sender_email?: string;
}

export interface SyncResponse {
  message: string;
  new_subscriptions: ParsedSubscription[];
  updates: Array<{
    subscription_id: string;
    data: ParsedSubscription;
  }>;
  total_parsed: number;
}

export interface AuthUrlResponse {
  auth_url: string;
  state: string;
  provider: string;
}

export interface CallbackResponse {
  message: string;
  connection: EmailConnection;
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  email_connection_id?: string;
  sync_id?: string;
  operation_type: string;
  status: 'success' | 'failed' | 'skipped' | 'warning';
  details?: Record<string, any>;
  changes?: Record<string, any>;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
  filters: {
    sync_id?: string;
    connection_id?: string;
    operation_type?: string;
  };
}

export interface SyncSummary {
  sync_id: string;
  user_id: string;
  operations: AuditLogEntry[];
  total_operations: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  started_at?: string;
  completed_at?: string;
}

export interface ForwardedEmail {
  id: string;
  message_id: string;
  provider_message_id: string;
  subject: string;
  sender_email: string;
  sender_name?: string;
  received_at: string;
  processing_status: 'pending' | 'processed' | 'failed' | 'skipped';
  processing_reason?: string;
  parsed_data?: Record<string, any>;
  subscription_id?: string;
  created_at: string;
  processed_at?: string;
}

export interface ForwardedEmailsResponse {
  emails: ForwardedEmail[];
  total: number;
  limit: number;
  offset: number;
  forwarding_email: string;
}

export interface HostingerPollResponse {
  success: boolean;
  emails_found: number;
  emails_processed: number;
  emails: Array<{
    id: string;
    message_id: string;
    sender_email: string;
    sender_name?: string;
    subject: string;
    receiver_email: string;
    received_at: string;
    status: string;
    subscriptions_created?: number;
    subscriptions_updated?: number;
    user_id?: string;
    error?: string;
  }>;
  message: string;
}

export const emailSyncApi = {
  // Get OAuth URL
  getAuthUrl: () => 
    apiClient.get<AuthUrlResponse>('/email-sync/connect'),
  
  // Handle OAuth callback
  handleCallback: (code: string, state: string) =>
    apiClient.post<CallbackResponse>('/email-sync/callback', {
      code,
      state,
    }),
  
  // List connections
  getConnections: () =>
    apiClient.get<{ connections: EmailConnection[] }>('/email-sync/connections'),
  
  // Disconnect
  disconnect: (connectionId: string) =>
    apiClient.delete(`/email-sync/connections/${connectionId}`),
  
  // Sync emails
  sync: (params?: { connection_id?: string; months_back?: number; max_results?: number; auto_create?: boolean }) =>
    apiClient.post<SyncResponse>('/email-sync/sync', params || {}),
  
  // Get audit log
  getAuditLog: (params?: {
    sync_id?: string;
    connection_id?: string;
    operation_type?: string;
    limit?: number;
    offset?: number;
  }) =>
    apiClient.get<AuditLogResponse>('/email-sync/audit-log', { params }),
  
  // Get sync summary
  getSyncSummary: (syncId: string) =>
    apiClient.get<SyncSummary>(`/email-sync/audit-log/${syncId}/summary`),
  
  // Get forwarded emails
  getForwardedEmails: (params?: { limit?: number; offset?: number }) =>
    apiClient.get<ForwardedEmailsResponse>('/email-sync/forwarded-emails', { params }),
  
  // Trigger Hostinger IMAP poll
  pollHostinger: () =>
    apiClient.post<HostingerPollResponse>('/email-sync/poll-hostinger'),
};

