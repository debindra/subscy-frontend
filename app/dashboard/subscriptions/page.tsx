'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { subscriptionsApi, Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/context/ToastContext';
import { useSearchParams } from 'next/navigation';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [billing, setBilling] = useState<'all' | Subscription['billingCycle']>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [trial, setTrial] = useState<'all' | 'trial' | 'nontrial'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [currency, setCurrency] = useState<string>('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const currencyParam = searchParams.get('currency');

    if (statusParam === 'all' || statusParam === 'active' || statusParam === 'inactive') {
      setFilter(statusParam);
    }

    if (currencyParam) {
      setCurrency(currencyParam);
    } else {
      setCurrency('all');
    }
  }, [searchParamsString]);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionsApi.getAll();
      setSubscriptions(response.data);
    } catch (error) {
      showToast('Failed to load subscriptions', 'error');
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateSubscriptionData) => {
    try {
      await subscriptionsApi.create(data);
      await loadSubscriptions();
      setIsModalOpen(false);
      showToast('Subscription created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create subscription', 'error');
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const handleUpdate = async (data: CreateSubscriptionData) => {
    if (!editingSubscription) return;

    try {
      await subscriptionsApi.update(editingSubscription.id, data);
      await loadSubscriptions();
      setIsModalOpen(false);
      setEditingSubscription(undefined);
      showToast('Subscription updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update subscription', 'error');
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await subscriptionsApi.delete(id);
      await loadSubscriptions();
      showToast('Subscription deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete subscription', 'error');
      console.error('Error deleting subscription:', error);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(undefined);
  };

  const currencyOptions = useMemo(
    () => Array.from(new Set(subscriptions.map((s) => s.currency))).sort(),
    [subscriptions]
  );

  const filteredSubscriptions = subscriptions.filter((sub) => {
    // status filter
    if (filter === 'active' && !sub.isActive) return false;
    if (filter === 'inactive' && sub.isActive) return false;
    // search filter
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = `${sub.name} ${sub.category} ${sub.description || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // category filter
    if (category !== 'all' && sub.category !== category) return false;
    // currency filter
    if (currency !== 'all' && sub.currency !== currency) return false;
    // billing cycle filter
    if (billing !== 'all' && sub.billingCycle !== billing) return false;
    // price range filter
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;
    if (typeof min === 'number' && sub.amount < min) return false;
    if (typeof max === 'number' && sub.amount > max) return false;
    // trial filter
    if (trial === 'trial' && !sub.isTrial) return false;
    if (trial === 'nontrial' && sub.isTrial) return false;
    // next renewal date range filter
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      const next = new Date(sub.nextRenewalDate).getTime();
      if (next < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      const next = new Date(sub.nextRenewalDate).getTime();
      if (next > to) return false;
    }
    return true;
  });

  // Calculate totals for export
  const { monthlyTotal, yearlyTotal } = useMemo(() => {
    const monthly = subscriptions
      .filter(s => s.isActive)
      .reduce((sum, sub) => {
        const { amount, billingCycle } = sub;
        let monthlyAmount = amount;
        
        if (billingCycle === 'yearly') monthlyAmount = amount / 12;
        else if (billingCycle === 'quarterly') monthlyAmount = amount / 3;
        else if (billingCycle === 'weekly') monthlyAmount = amount * 4.33;
        
        return sum + monthlyAmount;
      }, 0);
    
    return {
      monthlyTotal: monthly,
      yearlyTotal: monthly * 12,
    };
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-shimmer"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your subscriptions</p>
        </div>
        <div className="flex space-x-3">
          {subscriptions.length > 0 && (
            <ExportButton
              subscriptions={subscriptions}
              monthlyTotal={monthlyTotal}
              yearlyTotal={yearlyTotal}
            />
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Subscription
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search name, category, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Active ({subscriptions.filter((s) => s.isActive).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'inactive'
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Inactive ({subscriptions.filter((s) => !s.isActive).length})
          </button>
        </div>

        {/* Expand/Collapse Filters Button */}
        <button
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span>{isFiltersExpanded ? 'Hide' : 'Show'} Advanced Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Advanced Filters - Only shown when expanded */}
        {isFiltersExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(subscriptions.map((s) => s.category))).sort().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={billing}
                onChange={(e) => setBilling(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Billing Cycles</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Currencies</option>
                {currencyOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min price"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={trial}
                onChange={(e) => setTrial(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Trials</option>
                <option value="trial">Trials only</option>
                <option value="nontrial">Non-trials(paid)</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="From"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No subscriptions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter !== 'all'
              ? `You don't have any ${filter} subscriptions.`
              : 'Get started by adding your first subscription.'}
          </p>
          {filter === 'all' && (
            <Button onClick={() => setIsModalOpen(true)}>
              + Add Your First Subscription
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
        size="lg"
      >
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

