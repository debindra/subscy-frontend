'use client';

import React, { useState, useEffect } from 'react';
import { Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CardBrandSelect } from '../ui/CardBrandSelect';
import { Button } from '../ui/Button';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: CreateSubscriptionData) => Promise<void>;
  onCancel: () => void;
}

const categories = [
  'Entertainment',
  'Development',
  'Productivity',
  'Cloud Services',
  'Design',
  'Marketing',
  'Communication',
  'Security',
  'Finance',
  'Education',
  'Other',
];

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
];

const paymentMethods = [
  { value: '', label: 'Select payment method' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'apple_pay', label: 'Apple Pay' },
  { value: 'google_pay', label: 'Google Pay' },
  { value: 'other', label: 'Other' },
];

const cardBrands = [
  { value: '', label: 'Select card brand' },
  { value: 'Visa', label: 'Visa' },
  { value: 'Mastercard', label: 'Mastercard' },
  { value: 'Amex', label: 'American Express' },
  { value: 'Discover', label: 'Discover' },
  { value: 'Other', label: 'Other' },
];

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel,
}) => {
  const { hasCategorization, hasSmartRenewalManagement } = usePlanFeatures();
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    name: '',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '',
    category: 'Entertainment',
    description: '',
    website: '',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: '',
    lastFourDigits: '',
    cardBrand: '',
    isTrial: false,
    trialEndDate: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        nextRenewalDate: subscription.nextRenewalDate.split('T')[0],
        category: subscription.category,
        description: subscription.description || '',
        website: subscription.website || '',
        isActive: subscription.isActive,
        reminderEnabled: subscription.reminderEnabled,
        reminderDaysBefore: subscription.reminderDaysBefore,
        paymentMethod: subscription.paymentMethod || '',
        lastFourDigits: subscription.lastFourDigits || '',
        cardBrand: subscription.cardBrand || '',
        isTrial: subscription.isTrial || false,
        trialEndDate: subscription.trialEndDate ? subscription.trialEndDate.split('T')[0] : '',
      });
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean the data: convert empty strings to undefined for optional date fields
      const cleanedData: CreateSubscriptionData = {
        ...formData,
        // Only include trialEndDate if it's not empty and isTrial is true
        trialEndDate: formData.isTrial && formData.trialEndDate && formData.trialEndDate.trim() 
          ? formData.trialEndDate 
          : undefined,
        // Remove empty strings for other optional fields
        description: formData.description?.trim() || undefined,
        website: formData.website?.trim() || undefined,
        paymentMethod: formData.paymentMethod?.trim() || undefined,
        lastFourDigits: formData.lastFourDigits?.trim() || undefined,
        cardBrand: formData.cardBrand?.trim() || undefined,
      };
      
      await onSubmit(cleanedData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Subscription Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Netflix, Spotify, etc."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          aria-invalid={formData.amount < 0}
          aria-describedby="amount-help"
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setFormData({ ...formData, amount: isNaN(val) ? 0 : Math.max(0, val) });
          }}
          required
        />
        <p id="amount-help" className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          Enter the price for the selected billing cycle. Negative values are not allowed.
        </p>

        <Select
          label="Currency"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'NPR', label: 'NPR (रू)' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Billing Cycle"
          value={formData.billingCycle}
          onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
          options={billingCycles}
        />

        <Input
          label="Next Renewal Date"
          type="date"
          value={formData.nextRenewalDate}
          onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Select
          label="Category"
          value={hasCategorization ? formData.category : 'Uncategorized'}
          onChange={(e) => {
            if (hasCategorization) {
              setFormData({ ...formData, category: e.target.value });
            }
          }}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
          disabled={!hasCategorization}
        />
        {!hasCategorization && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Categorization is a Pro feature. <a href="/" className="underline font-semibold">Upgrade to Pro</a> to organize subscriptions by category.
          </p>
        )}
      </div>

      <Input
        label="Description (Optional)"
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of the subscription"
      />

      <Input
        label="Website (Optional)"
        type="url"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="https://example.com"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
        Use the official service URL if available.
      </p>

      <Select
        label="Payment Method (Optional)"
        value={formData.paymentMethod || ''}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        options={paymentMethods}
      />

      {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Last 4 Digits"
            type="text"
            maxLength={4}
            value={formData.lastFourDigits || ''}
            onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
            placeholder="1234"
          />

          <CardBrandSelect
            label="Card Brand"
            value={formData.cardBrand || ''}
            onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
            options={cardBrands}
          />
        </div>
      )}

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.reminderEnabled}
            onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Reminders</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isTrial || false}
            onChange={(e) => setFormData({ ...formData, isTrial: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">This is a trial</span>
        </label>
      </div>

      {formData.reminderEnabled && (
        <div>
          <Input
            label="Remind me (days before renewal)"
            type="number"
            min="1"
            max="30"
            value={hasSmartRenewalManagement ? formData.reminderDaysBefore : 7}
            onChange={(e) => {
              if (hasSmartRenewalManagement) {
                setFormData({ ...formData, reminderDaysBefore: parseInt(e.target.value) });
              }
            }}
            disabled={!hasSmartRenewalManagement}
          />
          {!hasSmartRenewalManagement && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Custom reminder timing is a Pro feature. Free tier uses 7-day reminders. <a href="/" className="underline font-semibold">Upgrade to Pro</a> for customizable reminders.
            </p>
          )}
        </div>
      )}

      {formData.isTrial && (
        <Input
          label="Trial End Date"
          type="date"
          value={formData.trialEndDate || ''}
          onChange={(e) => setFormData({ ...formData, trialEndDate: e.target.value })}
          required
        />
      )}
      {formData.isTrial && (
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          Make sure the trial end date is in the future.
        </p>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="accent" disabled={loading} fullWidth>
          {loading ? 'Saving...' : subscription ? 'Update Subscription' : 'Add Subscription'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
};

