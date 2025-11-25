'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getUserAvatarUrl, getUserDisplayName } from '@/lib/utils/userUtils';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

type AccountType = 'personal' | 'business';

export default function ProfilePage() {
  usePageTitle('Profile');
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const accountType =
    (user?.user_metadata?.account_type as AccountType | undefined) ?? 'personal';

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setFullName((metadata.full_name as string) || '');
      setCompanyName((metadata.company_name as string) || '');
      setCompanyPhone((metadata.company_phone as string) || '');
      setCompanyTaxId((metadata.company_tax_id as string) || '');
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || null,
          company_name: companyName || null,
          company_phone: companyPhone || null,
          company_tax_id: companyTaxId || null,
        },
      });

      if (error) {
        throw error;
      }

      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      const message = err?.message || 'Failed to update profile. Please try again.';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </Card>
      </div>
    );
  }

  const avatarUrl = getUserAvatarUrl(user);
  const displayName = getUserDisplayName(user);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-500/20 dark:ring-primary-400/20 shadow-xl"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            {!avatarUrl && (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-primary-500/20 dark:ring-primary-400/20">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and company details.
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep your personal information up to date.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              value={user?.email ?? ''}
              disabled
              helperText="Email address cannot be changed"
            />

            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />

            {accountType === 'business' && (
              <div className="space-y-4">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Business information
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Visible to your team members and on invoices.
                  </p>
                </div>

                <Input
                  label="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                />
                <Input
                  label="Company phone"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+1 555-123-4567"
                />
                <Input
                  label="Company Tax ID"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  placeholder="123-45-6789"
                />
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button type="submit" disabled={saving} className="px-6">
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

