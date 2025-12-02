'use client';

import React, { useEffect, useState } from 'react';
import { settingsApi, UserSettings, UpdateSettingsData } from '@/lib/api/settings';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

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

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [formData, setFormData] = useState<Pick<UpdateSettingsData, 'timezone' | 'notificationTime' | 'emailAlertEnabled' | 'pushNotificationEnabled'>>({
    timezone: null,
    notificationTime: DEFAULT_NOTIFICATION_TIME,
    emailAlertEnabled: true,
    pushNotificationEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getSettings();
      setSettings(response.data);

      const currentTimezone = response.data.timezone;
      const currentNotificationTime = response.data.notificationTime || DEFAULT_NOTIFICATION_TIME;
      const currentEmailAlertEnabled = response.data.emailAlertEnabled ?? true;
      const currentPushNotificationEnabled = response.data.pushNotificationEnabled ?? true;

      setFormData({
        timezone: currentTimezone,
        notificationTime: currentNotificationTime,
        emailAlertEnabled: currentEmailAlertEnabled,
        pushNotificationEnabled: currentPushNotificationEnabled,
      });
    } catch (err) {
      console.error('Error loading reminder settings:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure we always send a notification time - default to 09:00 if empty/invalid
    const notificationTime = formData.notificationTime || DEFAULT_NOTIFICATION_TIME;

    const payload: UpdateSettingsData = {
      timezone: formData.timezone || null,
      notificationTime,
      emailAlertEnabled: formData.emailAlertEnabled,
      pushNotificationEnabled: formData.pushNotificationEnabled,
    };

    try {
      await settingsApi.updateSettings(payload);
      if (onSave) onSave();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to save reminder settings');
    } finally {
      setLoading(false);
    }
  };

  // Try to infer a sensible default timezone from the browser if none is set
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reminder Settings"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Use browser default ({effectiveTimezone})</option>
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label} ({tz.value})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
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

        <div className="space-y-4 pt-2">
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
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="accent" disabled={loading} fullWidth>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};


