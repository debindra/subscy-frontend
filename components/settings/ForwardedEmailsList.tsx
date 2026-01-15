'use client';

import React, { useEffect, useState } from 'react';
import { emailSyncApi, ForwardedEmail } from '@/lib/api/emailSync';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/context/ToastContext';
import { formatDateTimeWithTimezone } from '@/lib/utils/format';

export const ForwardedEmailsList: React.FC = () => {
  const { showToast } = useToast();
  const [emails, setEmails] = useState<ForwardedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const response = await emailSyncApi.getForwardedEmails({ limit: 20 });
      setEmails(response.data.emails);
      setTotal(response.data.total);
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
      showToast(
        response.data.message || `Found ${response.data.emails_found} new email(s)`,
        'success'
      );
      
      // Reload emails after poll
      await loadEmails();
      
      // Show details of received emails
      if (response.data.emails && response.data.emails.length > 0) {
        const emailsList = response.data.emails
          .map(e => `• ${e.subject} (from ${e.sender_email})`)
          .join('\n');
        console.log('New emails received:\n' + emailsList);
      }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Forwarded Emails
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recent emails received via your forwarding address
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePoll}
          disabled={polling}
        >
          {polling ? 'Polling...' : 'Check for New Emails'}
        </Button>
      </div>

      {loading && emails.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
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
          <p>No forwarded emails yet</p>
          <p className="text-sm mt-2">
            Forward subscription emails to your forwarding address to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <Card key={email.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {email.subject || 'No subject'}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${getStatusColor(
                        email.processing_status
                      )}`}
                    >
                      {getStatusLabel(email.processing_status)}
                    </span>
                  </div>
                  {email.processing_status === 'skipped' && email.processing_reason && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      Skipped: {email.processing_reason.replace(/_/g, ' ')}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">From:</span>
                      <span>
                        {email.sender_name
                          ? `${email.sender_name} <${email.sender_email}>`
                          : email.sender_email}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Received:</span>
                      <span>
                        {(() => {
                          const formatted = formatDateTimeWithTimezone(email.received_at);
                          return `${formatted.date} • ${formatted.time} (${formatted.timezone})`;
                        })()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email ID:</span>
                      <span className="font-mono text-xs">
                        {email.message_id || email.id}
                      </span>
                    </div>
                    
                    {email.parsed_data && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <span className="font-medium">Parsed:</span>{' '}
                        {email.parsed_data.merchant_name && (
                          <span>{email.parsed_data.merchant_name}</span>
                        )}
                        {email.parsed_data.amount && (
                          <span>
                            {' '}
                            {email.parsed_data.currency || '$'}
                            {email.parsed_data.amount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {total > emails.length && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {emails.length} of {total} emails
            </div>
          )}
        </div>
      )}
    </div>
  );
};

