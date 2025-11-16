'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { businessApi } from '@/lib/api/business';

type Status = 'loading' | 'success' | 'error';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    let isActive = true;

    // Check for errors in hash fragment first (Supabase OAuth errors come in hash)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get('error');
      const hashErrorDescription = hashParams.get('error_description');
      const hashErrorCode = hashParams.get('error_code');

      if (hashError && isActive) {
        setStatus('error');
        const errorMsg = hashErrorDescription || 
          (hashErrorCode === 'otp_expired' 
            ? 'The authentication link has expired. Please try signing in again.' 
            : 'Unable to complete authentication.');
        setMessage(errorMsg);
        return () => {
          isActive = false;
        };
      }
    }

    // Also check query parameters for errors (fallback)
    const existingError = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (existingError && isActive) {
      setStatus('error');
      setMessage(errorDescription || 'Unable to complete authentication.');
      return () => {
        isActive = false;
      };
    }

    const handleEmailConfirmation = async (token: string, type: string) => {
      try {
        setMessage('Verifying your email...');
        
        // First, check if Supabase has already processed the confirmation automatically
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          // Session already exists - Supabase processed it automatically
          const userMetadata = session.user?.user_metadata || {};
          if (userMetadata.account_type === 'business' && userMetadata.company_name) {
            try {
              await businessApi.upsertProfile({
                companyName: userMetadata.company_name,
                companyAddress: userMetadata.company_address,
                companyTaxId: userMetadata.company_tax_id,
                companyPhone: userMetadata.company_phone,
              });
            } catch (profileError: any) {
              console.warn('Failed to create business profile:', profileError);
            }
          }

          setStatus('success');
          setMessage('Email confirmed! Redirecting to your dashboard...');

          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', window.location.pathname);
          }

          setTimeout(() => {
            if (isActive) {
              router.replace('/dashboard');
            }
          }, 1500);
          return;
        }

        // If no session, try to verify the token manually
        // Supabase email confirmation tokens use token_hash format
        let verifyError = null;
        let verifyData = null;

        const result = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as 'email',
        });
        verifyData = result.data;
        verifyError = result.error;

        if (!isActive) {
          return;
        }

        if (verifyError) {
          setStatus('error');
          const errorMsg = verifyError.message || '';
          setMessage(
            errorMsg.includes('expired') || errorMsg.includes('invalid')
              ? 'This confirmation link has expired or is invalid. Please request a new confirmation email or try signing in.'
              : errorMsg || 'Failed to verify email. Please try again.'
          );
          return;
        }

        if (!verifyData?.session) {
          // Try getting session again after verification
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (!newSession) {
            setStatus('error');
            setMessage('Email verified, but session could not be created. Please try signing in.');
            return;
          }
          verifyData = { session: newSession, user: newSession.user };
        }

        // Check if this is a business account and create profile if needed
        const userMetadata = verifyData.user?.user_metadata || {};
        if (userMetadata.account_type === 'business' && userMetadata.company_name) {
          try {
            await businessApi.upsertProfile({
              companyName: userMetadata.company_name,
              companyAddress: userMetadata.company_address,
              companyTaxId: userMetadata.company_tax_id,
              companyPhone: userMetadata.company_phone,
            });
          } catch (profileError: any) {
            console.warn('Failed to create business profile:', profileError);
          }
        }

        setStatus('success');
        setMessage('Email confirmed! Redirecting to your dashboard...');

        // Clear URL parameters for security
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', window.location.pathname);
        }

        setTimeout(() => {
          if (isActive) {
            router.replace('/dashboard');
          }
        }, 1500);
      } catch (err: any) {
        if (!isActive) return;
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred during email verification.');
      }
    };

    const exchangeCodeForSession = async () => {
      try {
        // First, wait a moment and check if Supabase has already processed the confirmation
        // This handles cases where Supabase automatically processes email confirmations
        await new Promise(resolve => setTimeout(resolve, 300));
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          // Session exists - might be from email confirmation or OAuth
          const userMetadata = existingSession.user?.user_metadata || {};
          if (userMetadata.account_type === 'business' && userMetadata.company_name) {
            try {
              await businessApi.upsertProfile({
                companyName: userMetadata.company_name,
                companyAddress: userMetadata.company_address,
                companyTaxId: userMetadata.company_tax_id,
                companyPhone: userMetadata.company_phone,
              });
            } catch (profileError: any) {
              console.warn('Failed to create business profile:', profileError);
            }
          }

          setStatus('success');
          setMessage('Success! Redirecting to your dashboard...');

          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', window.location.pathname);
          }

          setTimeout(() => {
            if (isActive) {
              router.replace('/dashboard');
            }
          }, 1500);
          return;
        }

        // Check if this is an email confirmation link (query parameters)
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (token && type === 'email') {
          await handleEmailConfirmation(token, type);
          return;
        }

        // Check hash fragments for email confirmation (alternative format)
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hashToken = hashParams.get('token');
          const hashType = hashParams.get('type');
          
          if (hashToken && hashType === 'email') {
            await handleEmailConfirmation(hashToken, hashType);
            return;
          }
        }

        // Otherwise, handle OAuth callback
        setMessage('Signing you in with Google...');
        
        // Supabase automatically handles OAuth callbacks from URL hash fragments
        // Wait a moment for Supabase to process the callback
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get the session - Supabase client automatically extracts tokens from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isActive) {
          return;
        }

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Authentication failed.');
          return;
        }

        if (!session) {
          // If no session found, check if we have hash fragments to extract manually
          if (typeof window !== 'undefined' && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken && refreshToken) {
              // Set the session manually from hash fragments
              const { error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (setSessionError) {
                setStatus('error');
                setMessage(setSessionError.message || 'Failed to set session.');
                return;
              }

              // Verify session was set
              const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError || !newSession) {
                setStatus('error');
                setMessage('Failed to authenticate. Please try again.');
                return;
              }
            } else {
              setStatus('error');
              setMessage('No authentication data found. Please try signing in again.');
              return;
            }
          } else {
            setStatus('error');
            setMessage('No authentication data found. Please try signing in again.');
            return;
          }
        }

        setStatus('success');
        setMessage('Success! Redirecting to your dashboard...');

        // Clear the hash from URL for security
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', window.location.pathname);
        }

        setTimeout(() => {
          if (isActive) {
            router.replace('/dashboard');
          }
        }, 1500);
      } catch (err: any) {
        if (!isActive) return;
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred during authentication.');
      }
    };

    exchangeCodeForSession();

    return () => {
      isActive = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="max-w-md w-full text-center space-y-6 animate-scale-in shadow-2xl">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40">
            {status === 'success' ? (
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : status === 'error' ? (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {status === 'error' ? 'Authentication Failed' : 'Finishing up...'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        {status === 'error' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please try again or choose a different sign-in method.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Back to login
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Processing authentication...</p>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

