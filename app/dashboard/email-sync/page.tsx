'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { emailSyncApi, EmailConnection } from '@/lib/api/emailSync';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/context/ToastContext';
import { useUserSettings } from '@/lib/hooks/useUserSettings';
import { formatDateTimeWithTimezone } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

export default function EmailSyncPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: userSettings } = useUserSettings();
  const [connections, setConnections] = useState<EmailConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await emailSyncApi.getConnections();
      setConnections(res.data.connections);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to load connections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this email account?')) {
      return;
    }

    try {
      await emailSyncApi.disconnect(connectionId);
      showToast('Email account disconnected successfully', 'success');
      loadConnections();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to disconnect', 'error');
    }
  };

  const handleSync = async (connectionId?: string) => {
    try {
      setLoading(true);
      const res = await emailSyncApi.sync({ 
        connection_id: connectionId,
        auto_create: true  // Enable automatic subscription creation
      });
      
      const { new_subscriptions, updates, total_parsed } = res.data;
      let message = `Found ${total_parsed} potential subscriptions.`;
      
      if (new_subscriptions.length > 0) {
        message += ` ${new_subscriptions.length} new subscriptions ready to review.`;
      }
      
      showToast(message, 'success');
      
      if (new_subscriptions.length > 0 || updates.length > 0) {
        router.push('/dashboard/email-sync/sync');
      }
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to sync emails', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && connections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3"> 
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Email Sync
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ">
            Connect your email account to automatically detect subscriptions from your billing emails.
          </p>
        </div>

        {/* Email Accounts */}
        <div className="space-y-6 mb-8">
          {connections.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No email accounts connected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your Gmail account to start detecting subscriptions automatically.
              </p>
              <Link href="/dashboard/email-sync/connect">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5">
                  <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Connect Gmail Account
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              {connections.map((connection) => (
                <Card key={connection.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 rounded-xl flex items-center justify-center shadow-sm border border-red-200 dark:border-red-800/50">
                          {connection.provider.toLowerCase() === 'gmail' ? (
                            <GoogleIcon className="w-8 h-8" />
                          ) : (
                            <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-2">
                          {connection.email_address}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Connected {formatDateTimeWithTimezone(connection.created_at, userSettings?.timezone).date} • {formatDateTimeWithTimezone(connection.created_at, userSettings?.timezone).time} ({formatDateTimeWithTimezone(connection.created_at, userSettings?.timezone).timezone})
                            </span>
                            {connection.last_sync_at && (
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Last sync {formatDateTimeWithTimezone(connection.last_sync_at, userSettings?.timezone).date} • {formatDateTimeWithTimezone(connection.last_sync_at, userSettings?.timezone).time} ({formatDateTimeWithTimezone(connection.last_sync_at, userSettings?.timezone).timezone})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => handleSync(connection.id)}
                        disabled={loading}
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sync Now
                      </Button>
                      <Button
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={loading}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.7399 6.32717C24.3781 8.48282 24.2132 11.571 22.2453 13.5389L20.3007 15.4835C20.0078 15.7764 19.533 15.7764 19.2401 15.4835L12.5226 8.76595C12.2297 8.47306 12.2297 7.99818 12.5226 7.70529L14.4671 5.76075C16.4352 3.79268 19.5237 3.62792 21.6793 5.26646L24.7238 2.22166C25.0167 1.92875 25.4916 1.92873 25.7845 2.22161C26.0774 2.51449 26.0774 2.98936 25.7845 3.28227L22.7399 6.32717ZM19.7704 13.8925L21.1846 12.4783C22.7467 10.9162 22.7467 8.3835 21.1846 6.82141C19.6225 5.25931 17.0899 5.25931 15.5278 6.82141L14.1135 8.23562L19.7704 13.8925Z" fill="currentColor"></path>
                          <path d="M12.7778 11.215C13.0707 11.5079 13.0707 11.9828 12.7778 12.2757L10.6514 14.402L13.5982 17.3489L15.7238 15.2234C16.0167 14.9305 16.4916 14.9305 16.7844 15.2234C17.0773 15.5163 17.0773 15.9912 16.7844 16.284L14.6589 18.4095L15.4858 19.2364C15.7787 19.5293 15.7787 20.0042 15.4858 20.2971L13.5412 22.2416C11.5732 24.2096 8.48484 24.3745 6.32918 22.7361L3.28475 25.7808C2.99187 26.0737 2.517 26.0737 2.22409 25.7808C1.93118 25.488 1.93116 25.0131 2.22404 24.7202L5.26853 21.6754C3.63025 19.5197 3.79509 16.4314 5.76306 14.4635L7.7076 12.5189C8.0005 12.226 8.47537 12.226 8.76826 12.5189L9.59072 13.3414L11.7172 11.215C12.0101 10.9221 12.485 10.9221 12.7778 11.215ZM6.83028 21.1875C8.3929 22.7431 10.9207 22.7409 12.4806 21.181L13.8948 19.7668L8.23793 14.1099L6.82372 15.5241C5.26383 17.084 5.26163 19.6117 6.81709 21.1743L6.82366 21.1808L6.83028 21.1875Z" fill="currentColor"></path>
                        </svg>
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add another account */}
              {/* <div className="text-center pt-2">
                <Link href="/dashboard/email-sync/connect">
                  <Button variant="outline" className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Another Email Account
                  </Button>
                </Link>
              </div> */}
            </>
          )}
        </div>

        {/* Actions */}
        {connections.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Email Sync Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={() => handleSync()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full h-[56px] flex items-center justify-center px-4 py-0"
              >
                Sync All Accounts
              </Button>
              <Link href="/dashboard/email-sync/sync" className="block">
                <Button variant="outline" className="w-full h-[56px] flex items-center justify-center px-4 py-0">
                  Review Detected Subscriptions
                </Button>
              </Link>
              <Link href="/dashboard/email-sync/audit-log" className="block">
                <Button variant="outline" className="w-full h-[56px] flex items-center justify-center px-4 py-0">
                  View Audit Log
                </Button>
              </Link>
              <Link href="/dashboard/subscriptions" className="block">
                <Button variant="outline" className="w-full h-[56px] flex items-center justify-center px-4 py-0">
                  View All Subscriptions
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}