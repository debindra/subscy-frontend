import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { businessApi } from '../api/business';
import { isPasswordStrong, PASSWORD_ERROR_MESSAGE } from '../utils/passwordRules';
import { fetchCsrfToken } from '../utils/csrf';
import { logger } from '../utils/logger';

type AccountType = 'free' | 'pro' | 'family' | 'personal' | 'business';

interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
  accountType?: AccountType;
  companyName?: string;
  companyAddress?: string;
  companyTaxId?: string;
  companyPhone?: string;
}

const E2E_BYPASS = process.env.NEXT_PUBLIC_E2E_BYPASS_AUTH === 'true';
const MOCK_USER = {
  id: 'e2e-user',
  email: 'e2e-user@local.test',
  aud: 'authenticated',
  app_metadata: { provider: 'email' },
  user_metadata: {},
  role: 'authenticated',
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
} as unknown as User;

export function useAuth() {
  const [user, setUser] = useState<User | null>(E2E_BYPASS ? MOCK_USER : null);
  const [loading, setLoading] = useState(!E2E_BYPASS);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  // Use ref to track current user state in closures
  const userRef = useRef<User | null>(E2E_BYPASS ? MOCK_USER : null);
  
  // Helper function to update both state and ref
  const updateUser = (newUser: User | null) => {
    userRef.current = newUser;
    setUser(newUser);
  };

  useEffect(() => {
    if (E2E_BYPASS) {
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // Get initial session with timeout and error handling
    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Session check timeout'));
          }, 10000); // 10 second timeout
        });

        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise,
        ]);

        if (isMounted) {
          updateUser(session?.user ?? null);
          setLoading(false);
          setError(null); // Clear any previous errors
        }
      } catch (error) {
        logger.error('Error initializing auth session', error);
        // Always set loading to false, even on error
        if (isMounted) {
          updateUser(null);
          setLoading(false);
          setError(error instanceof Error ? error : new Error('Failed to initialize authentication'));
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    initializeAuth();

    // Track if we're currently refreshing to avoid false logout detection
    let isRefreshing = false;
    let refreshTimeoutId: NodeJS.Timeout | null = null;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Handle different auth events
      if (event === 'TOKEN_REFRESHED') {
        // Token was successfully refreshed
        isRefreshing = false;
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          refreshTimeoutId = null;
        }
        updateUser(session?.user ?? null);
        setLoading(false);
        setError(null);
        return;
      }

      if (event === 'SIGNED_OUT') {
        // Explicit sign out - clear everything immediately
        isRefreshing = false;
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          refreshTimeoutId = null;
        }
        updateUser(null);
        setLoading(false);
        queryClient.clear();
        return;
      }

      // For other events (SIGNED_IN, USER_UPDATED, etc.), update user immediately
      if (session?.user) {
        isRefreshing = false;
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          refreshTimeoutId = null;
        }
        updateUser(session.user);
        setLoading(false);
        setError(null);
        return;
      }

      // Session is null but not explicitly signed out - could be refresh in progress
      // Give it a moment to recover before clearing user state
      if (!session && userRef.current) {
        // Only set refreshing flag if we had a user before
        if (!isRefreshing) {
          isRefreshing = true;
          logger.warn('Session became null, attempting to recover...');
          
          // Try to get the session again after a short delay
          refreshTimeoutId = setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const { data: { session: recoveredSession }, error: sessionError } = await supabase.auth.getSession();
              
              if (recoveredSession?.user) {
                // Session recovered - user is still logged in
                logger.info('Session recovered successfully');
                isRefreshing = false;
                updateUser(recoveredSession.user);
                setLoading(false);
                setError(null);
              } else if (sessionError) {
                // Failed to recover - might be network issue, try refresh
                logger.warn('Session recovery failed, attempting refresh...', sessionError);
                const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
                
                if (refreshedSession?.user) {
                  logger.info('Session refreshed successfully');
                  isRefreshing = false;
                  updateUser(refreshedSession.user);
                  setLoading(false);
                  setError(null);
                } else {
                  // Truly logged out or refresh failed
                  logger.error('Session refresh failed, user logged out', refreshError);
                  isRefreshing = false;
                  updateUser(null);
                  setLoading(false);
                  queryClient.clear();
                }
              } else {
                // No session and no error - user is logged out
                logger.info('No session found, user logged out');
                isRefreshing = false;
                updateUser(null);
                setLoading(false);
                queryClient.clear();
              }
            } catch (err) {
              logger.error('Error during session recovery', err);
              // On error, don't immediately clear user - might be temporary network issue
              // Set error state instead so user can retry
              isRefreshing = false;
              setError(err instanceof Error ? err : new Error('Session check failed. Please try refreshing the page.'));
            }
          }, 1000); // Wait 1 second before checking again
        }
        // Don't update user state immediately - wait for recovery attempt
        return;
      }

      // No user and no previous user - initial state
      updateUser(null);
      setLoading(false);
      setError(null);
    });

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({
    email,
    password,
    fullName,
    accountType = 'free',
    companyName,
    companyAddress,
    companyTaxId,
    companyPhone,
  }: SignUpParams) => {
    if (accountType === 'business' && !companyName) {
      throw new Error('Company name is required for business accounts.');
    }
    if (!isPasswordStrong(password)) {
      throw new Error(PASSWORD_ERROR_MESSAGE);
    }

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName,
          account_type: accountType,
          ...(accountType === 'business'
            ? {
                company_name: companyName,
                company_address: companyAddress,
                company_tax_id: companyTaxId,
                company_phone: companyPhone,
              }
            : {}),
        },
      },
    });

    if (error) {
      // Better error messages
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      if (error.message.includes('Password') || error.message.includes('password')) {
        throw new Error('Password does not meet requirements. Please use a stronger password.');
      }
      throw error;
    }

    // Persist business profile details via API when applicable
    if (accountType === 'business' && companyName && data.session?.access_token) {
      try {
        await businessApi.upsertProfile({
          companyName,
          companyAddress,
          companyTaxId,
          companyPhone,
        });
      } catch (profileError: any) {
        throw new Error(
          profileError?.response?.data?.detail ||
            profileError?.message ||
            'Failed to save business profile details.'
        );
      }
    } else if (accountType === 'business' && !data.session) {
      logger.warn('Business profile will be created after email confirmation.');
    }

    // Fetch CSRF token if user is automatically signed in
    if (data.session) {
      try {
        await fetchCsrfToken();
      } catch (csrfError) {
        logger.warn('Failed to fetch CSRF token after signup', { error: csrfError });
      }
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        throw new Error('Please check your email and confirm your account before signing in.');
      }
      throw error;
    }

    // Fetch CSRF token after successful login
    if (data.session) {
      try {
        await fetchCsrfToken();
      } catch (csrfError) {
        logger.warn('Failed to fetch CSRF token after login', { error: csrfError });
        // Continue even if CSRF token fetch fails
      }
    }

    return data;
  };

  const signInWithGoogle = async () => {
    // For login - just authenticate
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?mode=login`
        : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const signUpWithGoogle = async () => {
    // For signup - authenticate then collect additional info
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?mode=signup`
        : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const resetPassword = async (email: string) => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/update-password`
        : undefined;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword: string) => {
    if (!isPasswordStrong(newPassword)) {
      throw new Error(PASSWORD_ERROR_MESSAGE);
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Clear all React Query cache to prevent showing previous user's data
    queryClient.clear();
  };

  const retryAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      updateUser(session?.user ?? null);
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error('Failed to retry authentication'));
    }
  };

  return {
    user,
    loading,
    error,
    retryAuth,
    signUp,
    signIn,
    signInWithGoogle,
    signUpWithGoogle,
    resetPassword,
    updatePassword,
    signOut,
  };
}

