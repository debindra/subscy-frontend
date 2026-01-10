'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { emailSyncApi } from '@/lib/api/emailSync';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';

export default function ConnectEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is OAuth callback
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      handleCallback(code, state);
    } else {
      // Initiate OAuth flow
      initiateOAuth();
    }
  }, [searchParams]);

  const initiateOAuth = async () => {
    try {
      setLoading(true);
      const res = await emailSyncApi.getAuthUrl();
      // Store state in sessionStorage for verification
      sessionStorage.setItem('oauth_state', res.data.state);
      // Redirect to Gmail OAuth
      window.location.href = res.data.auth_url;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initiate OAuth');
      setLoading(false);
      showToast(err.response?.data?.detail || 'Failed to initiate OAuth', 'error');
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      setLoading(true);
      // Verify state matches
      const storedState = sessionStorage.getItem('oauth_state');
      if (storedState !== state) {
        throw new Error('Invalid state parameter');
      }
      
      await emailSyncApi.handleCallback(code, state);
      sessionStorage.removeItem('oauth_state');
      
      showToast('Gmail account connected successfully!', 'success');
      
      // Redirect to sync page to review detected subscriptions
      router.push('/dashboard/email-sync/sync');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to connect email';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Card className="max-w-md w-full text-center space-y-4 p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {searchParams.get('code') ? 'Connecting your Gmail account...' : 'Redirecting to Gmail...'}
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Card className="max-w-md w-full text-center space-y-4 p-8">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connection Failed</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setError(null);
                initiateOAuth();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}

