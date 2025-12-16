'use client';

import React, { useState, useEffect } from 'react';
import { settingsApi, UserSettings, UpdateSettingsData } from '@/lib/api/settings';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '@/lib/context/ToastContext';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [formData, setFormData] = useState<UpdateSettingsData>({
    monthlyBudget: null,
    budgetAlertsEnabled: true,
    budgetAlertThreshold: 90,
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
      setFormData({
        monthlyBudget: response.data.monthlyBudget,
        budgetAlertsEnabled: response.data.budgetAlertsEnabled,
        budgetAlertThreshold: response.data.budgetAlertThreshold,
      });
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await settingsApi.updateSettings(formData);
      // Update local state with the saved settings
      if (response.data) {
        setSettings(response.data);
        setFormData({
          monthlyBudget: response.data.monthlyBudget,
          budgetAlertsEnabled: response.data.budgetAlertsEnabled ?? true,
          budgetAlertThreshold: response.data.budgetAlertThreshold ?? 90,
        });
      }
      showToast('Budget settings saved successfully', 'success');
      onSave();
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to save budget settings';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Budget Settings"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Monthly Budget"
          type="number"
          step="0.01"
          min="0"
          value={formData.monthlyBudget || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              monthlyBudget: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
          helperText="Set to 0 or leave empty to disable budget tracking"
        />

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.budgetAlertsEnabled}
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
              label="Alert Threshold (%)"
              type="number"
              min="1"
              max="100"
              value={formData.budgetAlertThreshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budgetAlertThreshold: parseInt(e.target.value),
                })
              }
              helperText="Receive an alert when reaching this percentage of your budget"
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="submit" 
            variant="accent" 
            disabled={loading} 
            className="w-full sm:w-[70%] text-base py-3 font-semibold m-0"
          >
            <span className="flex items-center justify-center w-full">
              {loading ? 'Saving...' : 'Save Settings'}
            </span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-[30%] text-base py-3 font-semibold m-0"
          >
            <span className="flex items-center justify-center w-full">Cancel</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

