import React, { useEffect, useState } from 'react';
import { settingsApi, UpdateSettingsData } from '@/lib/api/settings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/context/ToastContext';
import { useUserSettings } from '@/lib/hooks/useUserSettings';
import { useQueryClient } from '@tanstack/react-query';

interface BudgetSettingsFormProps {
  onSaved?: () => void;
}

export const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({ onSaved }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings } = useUserSettings();
  const [formData, setFormData] = useState<UpdateSettingsData>({
    monthlyBudget: null,
    budgetAlertsEnabled: true,
    budgetAlertThreshold: 90,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!settings) return;

    setFormData({
      monthlyBudget: settings.monthlyBudget,
      budgetAlertsEnabled: settings.budgetAlertsEnabled ?? true,
      budgetAlertThreshold: settings.budgetAlertThreshold ?? 90,
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await settingsApi.updateSettings(formData);
      if (response.data) {
        // Update shared query cache so all consumers see fresh settings
        queryClient.setQueryData(['user-settings'], response.data);
        setFormData({
          monthlyBudget: response.data.monthlyBudget,
          budgetAlertsEnabled: response.data.budgetAlertsEnabled ?? true,
          budgetAlertThreshold: response.data.budgetAlertThreshold ?? 90,
        });
      }
      showToast('Budget settings saved successfully', 'success');
      onSaved?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Failed to save budget settings';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        label={`Monthly budget (${(settings?.defaultCurrency || 'USD').toUpperCase()})`}
        type="number"
        step="0.01"
        min="0"
        value={formData.monthlyBudget ?? ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            monthlyBudget: e.target.value ? parseFloat(e.target.value) : null,
          })
        }
        helperText={`Set to 0 or leave empty to disable budget tracking. Budget is in ${(settings?.defaultCurrency || 'USD').toUpperCase()}.`}
      />

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.budgetAlertsEnabled ?? true}
            onChange={(e) =>
              setFormData({
                ...formData,
                budgetAlertsEnabled: e.target.checked,
              })
            }
            className="w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable budget alerts
          </span>
        </label>

        {formData.budgetAlertsEnabled && (
          <Input
            label="Alert threshold (%)"
            type="number"
            min="1"
            max="100"
            value={formData.budgetAlertThreshold ?? 90}
            onChange={(e) =>
              setFormData({
                ...formData,
                budgetAlertThreshold: parseInt(e.target.value, 10),
              })
            }
            helperText="Get an alert when you reach this percentage of your monthly budget."
          />
        )}
      </div>

      <div className="flex items-center justify-start">
        <Button type="submit" variant="accent" disabled={loading} className="px-6 w-full sm:w-1/3">
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};


