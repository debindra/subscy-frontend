import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { businessApi } from '../api/business';
import { isPasswordStrong, PASSWORD_ERROR_MESSAGE } from '../utils/passwordRules';

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
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null); // Clear any previous errors
        }
      } catch (error) {
        console.error('Error initializing auth session:', error);
        // Always set loading to false, even on error
        if (isMounted) {
          setUser(null);
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null); // Clear errors on successful auth state change
        // Clear cache when user logs out (session becomes null)
        if (!session) {
          queryClient.clear();
        }
      }
    });

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
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
      console.warn('Business profile will be created after email confirmation.');
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
      setUser(session?.user ?? null);
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

