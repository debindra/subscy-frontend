'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { businessApi } from '@/lib/api/business';
import { supabase } from '@/lib/supabase';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

export default function CompleteSignUpPage() {
  usePageTitle('Complete Sign Up');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { signOut } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      setUser(user);
      // Pre-fill name if available from Google
      if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      } else if (user.user_metadata?.name) {
        setFullName(user.user_metadata.name);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountType === 'business' && !companyName.trim()) {
      setError('Company name is required for business accounts');
      return;
    }

    setLoading(true);

    try {
      // Update user metadata with account type and details
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim() || undefined,
          account_type: accountType,
          ...(accountType === 'business'
            ? {
                company_name: companyName.trim(),
                company_address: companyAddress.trim() || undefined,
                company_tax_id: companyTaxId.trim() || undefined,
                company_phone: companyPhone.trim() || undefined,
              }
            : {}),
        },
      });

      if (updateError) {
        throw updateError;
      }

      // If business account, create business profile
      if (accountType === 'business' && companyName) {
        try {
          await businessApi.upsertProfile({
            companyName: companyName.trim(),
            companyAddress: companyAddress.trim() || undefined,
            companyTaxId: companyTaxId.trim() || undefined,
            companyPhone: companyPhone.trim() || undefined,
          });
        } catch (profileError: any) {
          console.warn('Failed to create business profile:', profileError);
          // Don't throw - metadata is already updated
        }
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to complete signup. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center rounded-2xl bg-white/80 px-6 py-4 shadow-2xl ring-1 ring-primary-100/80 dark:bg-white/10 dark:ring-white/10 transition-transform duration-300">
            <span className="sr-only">Subsy Home</span>
            <img
              src={theme === 'dark' ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
              alt="Subsy logo"
              width={220}
              height={220}
              className="h-14 w-auto"
              loading="eager"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Just a few more details to get started
          </p>
        </div>

        <Card className="animate-scale-in shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm font-medium animate-shake">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              autoCapitalize="words"
            />

            <Select
              label="Account Type"
              value={accountType}
              onChange={(event) => setAccountType(event.target.value as 'personal' | 'business')}
              options={[
                { value: 'personal', label: 'Personal' },
                { value: 'business', label: 'Business' },
              ]}
            />

            {accountType === 'business' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 border border-primary-100 dark:border-primary-900/40 rounded-xl bg-primary-50/60 dark:bg-primary-900/10 text-sm text-primary-700 dark:text-primary-200">
                  <p className="font-semibold mb-1">Business account benefits</p>
                  <ul className="list-disc list-inside space-y-1 text-primary-600 dark:text-primary-300">
                    <li>Advanced analytics with extended history</li>
                    <li>Team seats and export capabilities</li>
                    <li>Dedicated business profile management</li>
                  </ul>
                </div>

                <Input
                  label="Company Name *"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Acme Corporation"
                />

                <Input
                  label="Company Address"
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="123 Business Lane, Suite 100"
                />

                <Input
                  label="Tax ID"
                  type="text"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  placeholder="12-3456789"
                />

                <Input
                  label="Company Phone"
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}

            <Button type="submit" variant="accent" size="lg" fullWidth disabled={loading} className="flex items-center justify-center">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Completing signup...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Sign Up
                </div>
              )}
            </Button>

            <div className="pt-4 border-t dark:border-gray-700 text-center">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push('/auth/login');
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Sign out and use a different account
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

