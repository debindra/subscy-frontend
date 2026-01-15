'use client';

import React, { useEffect, useState } from 'react';
import { settingsApi, EmailForwardingSettings } from '@/lib/api/settings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/lib/context/ToastContext';

export const EmailForwardingSection: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<EmailForwardingSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await settingsApi.getEmailForwarding();
        setData(response.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Failed to load forwarding settings';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const response = await settingsApi.regenerateEmailForwarding();
      setData(response.data);
      showToast('New forwarding address generated successfully', 'success');
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Failed to regenerate forwarding address';
      setError(message);
      showToast(message, 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!data?.forwardingEmail) return;
    try {
      await navigator.clipboard.writeText(data.forwardingEmail);
      setCopied(true);
      showToast('Forwarding address copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  if (loading && !data) {
    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Forwarding</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Forward subscription emails to your unique address to automatically create subscriptions.
        </p>
      </div>

      {error && !data && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {data ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your forwarding address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 font-mono text-sm text-gray-900 dark:text-gray-100">
                {data.forwardingEmail}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Forward any subscription billing, invoice, or renewal emails to this address.
              Subsy will automatically parse and create subscriptions for you.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                  How it works
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Copy your forwarding address above</li>
                  <li>Forward subscription emails from your email provider to this address</li>
                  <li>Subsy will automatically detect and create subscriptions</li>
                  <li>Works with any email provider (Gmail, Outlook, etc.)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? 'Regenerating...' : 'Regenerate Address'}
            </Button>
          </div>
          
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'No forwarding address available'}
          </p>
        </div>
      )}
    </Card>
  );
};

