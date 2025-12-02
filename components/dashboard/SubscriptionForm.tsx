'use client';

import React, { useState, useEffect } from 'react';
import { Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CardBrandSelect } from '../ui/CardBrandSelect';
import { Button } from '../ui/Button';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';
import { SUPPORTED_CURRENCIES } from '@/lib/constants/currencies';

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
  const { hasSmartRenewalManagement } = usePlanFeatures();
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    name: '',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '',
    category: 'Entertainment',
    description: '',
    website: '',
    email: '',
    plan: '',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: '',
    lastFourDigits: '',
    cardBrand: '',
    isTrial: false,
    trialEndDate: '',
  });
  
  // Track amount as string for input display (empty when 0 for new subscriptions)
  const [amountInput, setAmountInput] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isEditing = !!subscription;

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
        email: subscription.email || '',
        plan: subscription.plan || '',
        isActive: subscription.isActive,
        reminderEnabled: subscription.reminderEnabled,
        reminderDaysBefore: subscription.reminderDaysBefore,
        paymentMethod: subscription.paymentMethod || '',
        lastFourDigits: subscription.lastFourDigits || '',
        cardBrand: subscription.cardBrand || '',
        isTrial: subscription.isTrial || false,
        trialEndDate: subscription.trialEndDate ? subscription.trialEndDate.split('T')[0] : '',
      });
      setAmountInput(subscription.amount.toString());
      // Show advanced options if any advanced field has data
      const hasAdvancedData = !!(
        subscription.description ||
        subscription.website ||
        subscription.email ||
        subscription.paymentMethod ||
        subscription.lastFourDigits ||
        subscription.cardBrand
      );
      setShowAdvanced(hasAdvancedData);
    } else {
      // Reset amount input to empty for new subscriptions
      setAmountInput('');
      setShowAdvanced(false);
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
        email: formData.email?.trim() || undefined,
        plan: formData.plan?.trim() || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>

        <Input
          label="Subscription Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
          className="text-base"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={amountInput}
            aria-invalid={formData.amount < 0}
            onChange={(e) => {
              const inputValue = e.target.value;
              setAmountInput(inputValue);
              const val = parseFloat(inputValue);
              setFormData({ ...formData, amount: isNaN(val) ? 0 : Math.max(0, val) });
            }}
            required
            placeholder="Amount"
            className="text-base"
          />

          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            options={SUPPORTED_CURRENCIES}
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Billing Cycle"
            value={formData.billingCycle}
            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
            options={billingCycles}
            className="text-base"
          />

          <div>
            <Input
              label="Next Renewal Date"
              type="date"
              value={formData.nextRenewalDate}
              onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
              placeholder="Next Renewal Date"
              className="text-base"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Optional - will be calculated automatically based on billing cycle
            </p>
          </div>
        </div>
      </div>

      {/* Category Section - Always shown */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            className="text-base"
          />
          <Input
            label="Plan"
            type="text"
            value={formData.plan || ''}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            placeholder="e.g., Basic, Pro, Premium"
            className="text-base"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">
          Plan is optional - helps identify which subscription tier you're on
        </p>
      </div>

      {/* Advanced options toggle */}
      <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        </span>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          {showAdvanced ? 'Hide' : 'More'}
        </button>
      </div>

      {/* Advanced Options Section */}
      {showAdvanced && (
        <div className="space-y-5 pt-2">
          <Input
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description or notes about this subscription"
            className="text-base"
          />

          <div>
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              className="text-base"
              adornmentRight={
                formData.website ? (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    aria-label="Open website"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : null
              }
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Use the official service URL if available
            </p>
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="text-base"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Email used for this subscription (optional)
            </p>
          </div>

          <Select
            label="Payment Method"
            value={formData.paymentMethod || ''}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            options={paymentMethods}
            className="text-base"
          />

          {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <Input
                label="Last 4 Digits"
                type="text"
                maxLength={4}
                value={formData.lastFourDigits || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setFormData({ ...formData, lastFourDigits: value });
                }}
                placeholder="Last 4 Digits"
                className="text-base"
              />

              <CardBrandSelect
                label="Card Brand"
                value={formData.cardBrand || ''}
                onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
                options={cardBrands}
              />
            </div>
          )}
        </div>
      )}

      {/* Settings & Preferences Section - Always shown */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings & Preferences</h3>
        </div>

        <div className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.isActive 
                      ? 'bg-primary-600 dark:bg-primary-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Subscription
                </span>
              </label>

              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.reminderEnabled 
                      ? 'bg-primary-600 dark:bg-primary-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                      formData.reminderEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Reminders
                </span>
              </label>

              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isTrial || false}
                    onChange={(e) => setFormData({ ...formData, isTrial: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.isTrial 
                      ? 'bg-primary-600 dark:bg-primary-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                      formData.isTrial ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  This is a Trial
                </span>
              </label>
            </div>

            {formData.reminderEnabled && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
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
                  placeholder="Days before renewal"
                  className="text-base"
                />
                {!hasSmartRenewalManagement && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Custom reminder timing is a Pro feature. Free tier uses 7-day reminders. <a href="/" className="underline font-semibold hover:text-amber-800 dark:hover:text-amber-200">Upgrade to Pro</a> for customizable reminders.</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {formData.isTrial && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Input
                  label="Trial End Date"
                  type="date"
                  value={formData.trialEndDate || ''}
                  onChange={(e) => setFormData({ ...formData, trialEndDate: e.target.value })}
                  required
                  placeholder="Trial End Date"
                  className="text-base"
                />
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Make sure the trial end date is in the future</span>
                </p>
              </div>
            )}
          </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          type="submit" 
          variant="accent" 
          disabled={loading} 
          fullWidth
          className="text-base py-3 font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {subscription ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Subscription
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Subscription
                </>
              )}
            </span>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          fullWidth
          className="text-base py-3 font-semibold"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

