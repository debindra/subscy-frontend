import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { businessApi } from '../api/business';
import { isPasswordStrong, PASSWORD_ERROR_MESSAGE } from '../utils/passwordRules';

type AccountType = 'personal' | 'business';

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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({
    email,
    password,
    fullName,
    accountType = 'personal',
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

    if (error) throw error;

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

    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
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
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    signOut,
  };
}

