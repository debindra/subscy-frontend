'use client';

import React, { useEffect, useState } from 'react';
import { settingsApi, UserSettings, UpdateSettingsData } from '@/lib/api/settings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/lib/context/ToastContext';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { SUPPORTED_CURRENCIES } from '@/lib/constants/currencies';

// A curated list of common timezones, to avoid pulling in a heavy dependency
const COMMON_TIMEZONES: { value: string; label: string }[] = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: 'London (UK)' },
  { value: 'Europe/Berlin', label: 'Central Europe' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'Australia/Sydney', label: 'Australia (Sydney)' },
];

const DEFAULT_NOTIFICATION_TIME = '09:00';

export default function ReminderSettingsPage() {
  usePageTitle('Reminder Settings');

  const { showToast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [formData, setFormData] = useState<
    Pick<UpdateSettingsData, 'timezone' | 'notificationTime' | 'defaultCurrency' | 'emailAlertEnabled' | 'pushNotificationEnabled'>
  >({
    timezone: null,
    notificationTime: DEFAULT_NOTIFICATION_TIME,
    defaultCurrency: 'USD',
    emailAlertEnabled: true,
    pushNotificationEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsApi.getSettings();
        setSettings(response.data);

        const currentTimezone = response.data.timezone;
        const currentNotificationTime =
          response.data.notificationTime || DEFAULT_NOTIFICATION_TIME;
        const currentDefaultCurrency = response.data.defaultCurrency ?? 'USD';
        const currentEmailAlertEnabled = response.data.emailAlertEnabled ?? true;
        const currentPushNotificationEnabled = response.data.pushNotificationEnabled ?? true;

        setFormData({
          timezone: currentTimezone,
          notificationTime: currentNotificationTime,
          defaultCurrency: currentDefaultCurrency,
          emailAlertEnabled: currentEmailAlertEnabled,
          pushNotificationEnabled: currentPushNotificationEnabled,
        });
      } catch (err) {
        console.error('Error loading reminder settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoadingInitial(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const notificationTime = formData.notificationTime || DEFAULT_NOTIFICATION_TIME;

    const payload: UpdateSettingsData = {
      timezone: formData.timezone || null,
      notificationTime,
      defaultCurrency: formData.defaultCurrency || 'USD',
      emailAlertEnabled: formData.emailAlertEnabled,
      pushNotificationEnabled: formData.pushNotificationEnabled,
    };

    try {
      console.log('Saving reminder settings...', payload);
      const response = await settingsApi.updateSettings(payload);
      console.log('Settings saved successfully:', response.data);
      const updatedSettings = response.data;
      
      // Update local state with the saved settings
      if (updatedSettings) {
        setSettings(updatedSettings);
        setFormData({
          timezone: updatedSettings.timezone,
          notificationTime: updatedSettings.notificationTime || DEFAULT_NOTIFICATION_TIME,
          defaultCurrency: updatedSettings.defaultCurrency ?? 'USD',
          emailAlertEnabled: updatedSettings.emailAlertEnabled ?? true,
          pushNotificationEnabled: updatedSettings.pushNotificationEnabled ?? true,
        });
      }
      
      // Show success message
      console.log('Showing success toast...');
      showToast('Reminder settings saved successfully!', 'success');
    } catch (err: any) {
      console.error('Error saving reminder settings:', err);
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Failed to save reminder settings';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEffectiveTimezone = () => {
    if (formData.timezone) return formData.timezone;
    if (typeof Intl !== 'undefined' && (Intl as any).DateTimeFormat) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return tz || 'UTC';
      } catch {
        return 'UTC';
      }
    }
    return 'UTC';
  };

  const effectiveTimezone = getEffectiveTimezone();

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3 text-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminder Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your timezone, reminder time, and preferred default currency for your dashboard.
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification preferences</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage when and how you receive reminders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone ?? effectiveTimezone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timezone: e.target.value || null,
                  })
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 border-gray-300 dark:border-gray-600"
              >
                <option value="">Use browser default ({effectiveTimezone})</option>
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.value})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This timezone will be used to interpret your daily reminder time.
              </p>
            </div>

            <Input
              label="Daily notification time"
              type="time"
              value={formData.notificationTime || DEFAULT_NOTIFICATION_TIME}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationTime: e.target.value || DEFAULT_NOTIFICATION_TIME,
                })
              }
              helperText="Choose when you want to receive daily reminders. Default is 09:00."
            />

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Notification Channels
              </h3>
              <div className="space-y-4">
                <Switch
                  checked={formData.emailAlertEnabled ?? true}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      emailAlertEnabled: checked,
                    })
                  }
                  label="Email Alert"
                  helperText="Receive subscription reminders via email"
                />
                <Switch
                  checked={formData.pushNotificationEnabled ?? true}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      pushNotificationEnabled: checked,
                    })
                  }
                  label="Push Notification"
                  helperText="Receive subscription reminders via push notifications"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Default currency
              </label>
              <select
                value={formData.defaultCurrency ?? 'USD'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultCurrency: e.target.value || null,
                  })
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 border-gray-300 dark:border-gray-600"
              >
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Spending totals on your dashboard will be converted to this currency for unified viewing. Individual subscription prices remain in their original currencies.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <Button type="submit" variant="accent" disabled={loading} className="px-6">
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}


