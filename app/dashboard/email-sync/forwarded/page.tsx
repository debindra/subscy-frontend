'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { emailSyncApi, ForwardedEmail, HostingerPollResponse } from '@/lib/api/emailSync';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/context/ToastContext';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { formatDateTimeWithTimezone } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ForwardedEmailsPage() {
  usePageTitle('Forwarded Emails');
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [emails, setEmails] = useState<ForwardedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [total, setTotal] = useState(0);
  const [forwardingEmail, setForwardingEmail] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadEmails();
    }
  }, [user]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const response = await emailSyncApi.getForwardedEmails({ limit: 50 });
      setEmails(response.data.emails);
      setTotal(response.data.total);
      setForwardingEmail(response.data.forwarding_email || '');
    } catch (err: any) {
      showToast(
        err?.response?.data?.detail || 'Failed to load forwarded emails',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePoll = async () => {
    setPolling(true);
    try {
      const response = await emailSyncApi.pollHostinger();
      
      if (response.data.emails_found > 0) {
        showToast(
          `Found ${response.data.emails_found} new email(s)! Processing...`,
          'success'
        );
        
        // Show details of received emails
        if (response.data.emails && response.data.emails.length > 0) {
          const emailsList = response.data.emails
            .map((e, idx) => `${idx + 1}. ${e.subject} (from ${e.sender_email})`)
            .join('\n');
          console.log('📧 New emails received:\n' + emailsList);
        }
      } else {
        showToast('No new emails found', 'info');
      }
      
      // Reload emails after poll
      await loadEmails();
      
    } catch (err: any) {
      showToast(
        err?.response?.data?.detail || 'Failed to poll for emails',
        'error'
      );
    } finally {
      setPolling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'skipped':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'pending':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processed':
        return 'Processed';
      case 'failed':
        return 'Failed';
      case 'skipped':
        return 'Skipped';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Forwarded Emails
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View emails received via your forwarding address
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePoll}
              disabled={polling || loading}
            >
              {polling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2" />
                  Polling...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Check for New Emails
                </>
              )}
            </Button>
            <Link href="/dashboard/email-sync">
              <Button variant="outline">Back to Email Sync</Button>
            </Link>
          </div>
        </div>

        {forwardingEmail && (
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Your forwarding address:
                </p>
                <p className="text-sm font-mono text-blue-800 dark:text-blue-300">
                  {forwardingEmail}
                </p>
              </div>
            </div>
          </Card>
        )}

        {loading && emails.length === 0 ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          </Card>
        ) : emails.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">No forwarded emails yet</p>
              <p className="text-sm">
                Forward subscription emails to your forwarding address to see them here
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {emails.length} of {total} emails
              </p>
            </div>

            {emails.map((email) => (
              <Card key={email.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {email.subject || 'No subject'}
                      </h3>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded ${getStatusColor(
                          email.processing_status
                        )}`}
                      >
                        {getStatusLabel(email.processing_status)}
                      </span>
                    </div>
                    {email.processing_status === 'skipped' && email.processing_reason && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                        Skipped: {email.processing_reason.replace(/_/g, ' ')}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>{' '}
                        <span>
                          {email.sender_name
                            ? `${email.sender_name} <${email.sender_email}>`
                            : email.sender_email}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Received:</span>{' '}
                        <span>
                          {(() => {
                            const formatted = formatDateTimeWithTimezone(email.received_at);
                            return `${formatted.date} • ${formatted.time} (${formatted.timezone})`;
                          })()}
                        </span>
                      </div>
                      
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Email ID:</span>{' '}
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {email.message_id || email.id}
                        </span>
                      </div>
                      
                      {email.processed_at && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Processed:</span>{' '}
                          <span>
                            {(() => {
                              const formatted = formatDateTimeWithTimezone(email.processed_at);
                              return `${formatted.date} • ${formatted.time} (${formatted.timezone})`;
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {email.parsed_data && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parsed Subscription Data:
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {email.parsed_data.merchant_name && (
                            <div>
                              <span className="font-medium">Merchant:</span>{' '}
                              {email.parsed_data.merchant_name}
                            </div>
                          )}
                          {email.parsed_data.amount && (
                            <div>
                              <span className="font-medium">Amount:</span>{' '}
                              {email.parsed_data.currency || '$'}
                              {email.parsed_data.amount}
                            </div>
                          )}
                          {email.parsed_data.billing_cycle && (
                            <div>
                              <span className="font-medium">Billing Cycle:</span>{' '}
                              {email.parsed_data.billing_cycle}
                            </div>
                          )}
                          {email.parsed_data.renewal_date && (
                            <div>
                              <span className="font-medium">Renewal Date:</span>{' '}
                              {email.parsed_data.renewal_date}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {email.subscription_id && (
                      <div className="mt-3">
                        <Link
                          href={`/dashboard/subscriptions/${email.subscription_id}`}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          View Subscription →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

