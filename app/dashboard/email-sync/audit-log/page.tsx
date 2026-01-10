'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { emailSyncApi, AuditLogEntry } from '@/lib/api/emailSync';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

const PAGE_SIZE = 20;

// Icon component for audit log events
function AuditLogIcon({ operationType, className = "w-5 h-5" }: { operationType: string; className?: string }) {
  const getIcon = () => {
    switch (operationType) {
      case 'email_fetched':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'email_parsed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'sync_started':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'sync_completed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'sync_failed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'subscription_created':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'subscription_updated':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'subscription_deactivated':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      case 'subscription_skipped':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'auth_initiated':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      case 'auth_completed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'auth_failed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'connection_created':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'connection_deactivated':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'error_occurred':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'test_parse_started':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'test_parse_completed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'test_parse_failed':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getIconColor = () => {
    switch (operationType) {
      case 'email_fetched':
      case 'email_parsed':
        return 'text-blue-500 dark:text-blue-400';
      case 'sync_started':
      case 'sync_completed':
        return 'text-green-500 dark:text-green-400';
      case 'sync_failed':
      case 'auth_failed':
      case 'error_occurred':
      case 'test_parse_failed':
        return 'text-red-500 dark:text-red-400';
      case 'subscription_created':
        return 'text-emerald-500 dark:text-emerald-400';
      case 'subscription_updated':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'subscription_deactivated':
        return 'text-gray-500 dark:text-gray-400';
      case 'subscription_skipped':
        return 'text-orange-500 dark:text-orange-400';
      case 'auth_initiated':
      case 'auth_completed':
        return 'text-purple-500 dark:text-purple-400';
      case 'connection_created':
        return 'text-indigo-500 dark:text-indigo-400';
      case 'connection_deactivated':
        return 'text-gray-500 dark:text-gray-400';
      case 'test_parse_started':
      case 'test_parse_completed':
        return 'text-teal-500 dark:text-teal-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className={`flex-shrink-0 ${getIconColor()}`}>
      {getIcon()}
    </div>
  );
}

export default function AuditLogPage() {
  usePageTitle('Email Sync Audit Log');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    sync_id: searchParams.get('sync_id') || '',
    connection_id: searchParams.get('connection_id') || '',
    operation_type: searchParams.get('operation_type') || '',
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.sync_id, filters.connection_id, filters.operation_type]);

  useEffect(() => {
    if (user) {
      loadAuditLog();
    }
  }, [user, filters, currentPage]);

  const loadAuditLog = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * PAGE_SIZE;
      const params: any = { 
        limit: PAGE_SIZE,
        offset: offset
      };
      if (filters.sync_id) params.sync_id = filters.sync_id;
      if (filters.connection_id) params.connection_id = filters.connection_id;
      if (filters.operation_type) params.operation_type = filters.operation_type;

      const res = await emailSyncApi.getAuditLog(params);
      setEntries(res.data.entries);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to load audit log', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      showToast('Starting email sync...', 'info');
      
      // Trigger sync with auto_create enabled
      const syncResponse = await emailSyncApi.sync({
        months_back: 3,
        max_results: 50,
        auto_create: true  // Enable automatic subscription creation
      });
      
      const syncId = syncResponse.data.sync_id;
      const totalParsed = syncResponse.data.total_parsed || 0;
      const newSubscriptions = syncResponse.data.new_subscriptions?.length || 0;
      const updates = syncResponse.data.updates?.length || 0;
      
      // Build success message
      let message = `Sync completed! Found ${totalParsed} potential subscriptions`;
      if (newSubscriptions > 0 || updates > 0) {
        message += ` (${newSubscriptions} new, ${updates} updates)`;
      }
      
      if (syncId) {
        // Filter by the new sync_id to show only this sync's results
        setFilters({ ...filters, sync_id: syncId });
        setCurrentPage(1);
        showToast(message + '. Showing sync results...', 'success');
        
        // Wait a moment for audit logs to be written, then refresh
        setTimeout(() => {
          loadAuditLog();
        }, 1500);
      } else {
        setCurrentPage(1);
        showToast(message + '. Refreshing audit log...', 'success');
        // Refresh audit log after a short delay
        setTimeout(() => {
          loadAuditLog();
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Failed to sync emails';
      showToast(errorMessage, 'error');
      setCurrentPage(1);
      // Still refresh audit log to show the error entry
      setTimeout(() => {
        loadAuditLog();
      }, 1500);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'skipped':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const formatOperationType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Email Sync Audit Log
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View all email sync operations and changes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSyncNow}
                disabled={syncing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {syncing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Now
                  </>
                )}
              </Button>
              <Link href="/dashboard/email-sync">
                <Button variant="outline">Back to Email Sync</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadAuditLog}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
              {(filters.sync_id || filters.connection_id || filters.operation_type) && (
                <Button
                  onClick={() => {
                    setFilters({ sync_id: '', connection_id: '', operation_type: '' });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sync ID
              </label>
              <input
                type="text"
                value={filters.sync_id}
                onChange={(e) => setFilters({ ...filters, sync_id: e.target.value })}
                placeholder="Filter by sync ID"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Connection ID
              </label>
              <input
                type="text"
                value={filters.connection_id}
                onChange={(e) => setFilters({ ...filters, connection_id: e.target.value })}
                placeholder="Filter by connection ID"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Operation Type
              </label>
              <select
                value={filters.operation_type}
                onChange={(e) => setFilters({ ...filters, operation_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Operations</option>
                <option value="auth_initiated">Auth Initiated</option>
                <option value="auth_completed">Auth Completed</option>
                <option value="auth_failed">Auth Failed</option>
                <option value="connection_created">Connection Created</option>
                <option value="connection_deactivated">Connection Deactivated</option>
                <option value="sync_started">Sync Started</option>
                <option value="sync_completed">Sync Completed</option>
                <option value="sync_failed">Sync Failed</option>
                <option value="email_fetched">Email Fetched</option>
                <option value="email_parsed">Email Parsed</option>
                <option value="subscription_created">Subscription Created</option>
                <option value="subscription_updated">Subscription Updated</option>
                <option value="subscription_deactivated">Subscription Deactivated</option>
                <option value="subscription_skipped">Subscription Skipped</option>
                <option value="error_occurred">Error Occurred</option>
                <option value="test_parse_started">Test Parse Started</option>
                <option value="test_parse_completed">Test Parse Completed</option>
                <option value="test_parse_failed">Test Parse Failed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Active Filter Indicator */}
        {filters.sync_id && (
          <Card className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Filtering by Sync ID:
                </span>
                <span className="text-sm font-mono text-blue-700 dark:text-blue-400">
                  {filters.sync_id}
                </span>
              </div>
              <Button
                onClick={() => setFilters({ ...filters, sync_id: '' })}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </Card>
        )}

        {/* Audit Log Entries */}
        <div className="space-y-4">
          {entries.length === 0 && !loading ? (
            <Card className="p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Audit Log Entries
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                No audit log entries found. Try adjusting your filters or perform a sync operation.
              </p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AuditLogIcon operationType={entry.operation_type} className="w-5 h-5 flex-shrink-0" />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatOperationType(entry.operation_type)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {entry.sync_id && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Sync ID: <span className="font-mono">{entry.sync_id}</span>
                      </p>
                    )}

                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Details:</p>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </div>
                    )}

                    {entry.changes && Object.keys(entry.changes).length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Changes:</p>
                        <pre className="text-xs text-blue-600 dark:text-blue-400 overflow-x-auto">
                          {JSON.stringify(entry.changes, null, 2)}
                        </pre>
                      </div>
                    )}

                    {entry.error_message && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                        <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Error:</p>
                        <p className="text-xs text-red-600 dark:text-red-400">{entry.error_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination - Bottom Only */}
        {total > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Entry Count Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>
                    Showing <span className="font-medium text-gray-900 dark:text-white">{((currentPage - 1) * PAGE_SIZE) + 1}</span> to{' '}
                    <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * PAGE_SIZE, total)}</span> of{' '}
                    <span className="font-medium text-gray-900 dark:text-white">{total}</span> entries
                  </>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5">
                  {/* First Page Button */}
                  {totalPages > 5 && currentPage > 3 && (
                    <>
                      <Button
                        onClick={() => setCurrentPage(1)}
                        disabled={loading || currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="px-2 h-8 min-w-[2rem] flex items-center justify-center"
                        title="First page"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </Button>
                      <span className="text-gray-400 dark:text-gray-500 px-1 hidden sm:inline">...</span>
                    </>
                  )}

                  {/* Previous Button - Left Arrow */}
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    variant="outline"
                    size="sm"
                    className="px-3 h-8 flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  {/* Page Numbers - Inline with arrows */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    const isActive = currentPage === pageNum;

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        variant={isActive ? "primary" : "outline"}
                        size="sm"
                        className={`h-8 min-w-[2rem] flex items-center justify-center ${
                          isActive
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 font-medium"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {/* Next Button - Right Arrow */}
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    variant="outline"
                    size="sm"
                    className="px-3 h-8 flex items-center justify-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>

                  {/* Last Page Button */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400 dark:text-gray-500 px-1 hidden sm:inline">...</span>
                      <Button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={loading || currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="px-2 h-8 min-w-[2rem] flex items-center justify-center"
                        title="Last page"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

