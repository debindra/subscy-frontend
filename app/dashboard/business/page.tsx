'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/context/ToastContext';
import { businessApi, BusinessProfilePayload, PlanResponse } from '@/lib/api/business';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

export default function BusinessSettingsPage() {
  usePageTitle('Business Console');
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<BusinessProfilePayload>({
    companyName: '',
    companyAddress: '',
    companyTaxId: '',
    companyPhone: '',
  });
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      const accountType = user?.user_metadata?.account_type ?? 'personal';
      if (accountType !== 'business') {
        router.replace('/dashboard');
      } else {
        loadData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const loadData = async () => {
    setProfileLoading(true);
    try {
      const [planRes, profileRes] = await Promise.allSettled([
        businessApi.getCurrentPlan(),
        businessApi.getProfile(),
      ]);

      if (planRes.status === 'fulfilled') {
        setPlan(planRes.value.data);
      }

      if (profileRes.status === 'fulfilled') {
        setProfile({
          companyName: profileRes.value.data.companyName ?? '',
          companyAddress: profileRes.value.data.companyAddress ?? '',
          companyTaxId: profileRes.value.data.companyTaxId ?? '',
          companyPhone: profileRes.value.data.companyPhone ?? '',
        });
      } else if (profileRes.status === 'rejected') {
        const status = profileRes.reason?.response?.status;
        if (status !== 404) {
          showToast('Failed to load business profile', 'error');
        }
      }
    } catch (error) {
      console.error('Business settings load error', error);
      showToast('Failed to load business data', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload: BusinessProfilePayload = {
        companyName: profile.companyName,
        companyAddress: profile.companyAddress,
        companyTaxId: profile.companyTaxId,
        companyPhone: profile.companyPhone,
      };

      await businessApi.upsertProfile(payload);
      showToast('Business profile updated', 'success');
    } catch (error: any) {
      const message =
        error?.response?.data?.detail || error?.message || 'Failed to update business profile';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="p-6">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="h-14 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Console</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your company profile, plan limits, and billing readiness.
          </p>
        </div>
      </div>

      {plan && (
        <Card className="p-6 border border-primary-100 dark:border-primary-900/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wide">
                Current Plan
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {plan.accountType}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
              <PlanStat label="Team Seats" value={plan.limits.max_team_seats ?? 'Unlimited'} />
              <PlanStat
                label="Subscription Cap"
                value={plan.limits.max_subscriptions ?? 'Unlimited'}
              />
              <PlanStat
                label="Analytics History"
                value={
                  typeof plan.limits.analytics?.monthly_trend?.max_months === 'number'
                    ? `${plan.limits.analytics?.monthly_trend?.max_months} months`
                    : 'Unlimited history'
                }
              />
              <PlanStat
                label="Exports"
                value={plan.limits.exports?.csv ? 'CSV & PDF' : 'Upgrade required'}
              />
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Profile</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep your business information up to date for invoicing and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={profile.companyName}
              required
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, companyName: event.target.value }))
              }
              placeholder="Acme Corporation"
            />
            <Input
              label="Company Phone"
              value={profile.companyPhone || ''}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, companyPhone: event.target.value }))
              }
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Company Address"
              value={profile.companyAddress || ''}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, companyAddress: event.target.value }))
              }
              placeholder="123 Business Lane, Suite 100"
            />
            <Input
              label="Tax ID"
              value={profile.companyTaxId || ''}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, companyTaxId: event.target.value }))
              }
              placeholder="12-3456789"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function PlanStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200/70 dark:border-gray-700/70">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

