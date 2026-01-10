'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncEmails } from '@/lib/hooks/useEmailSync';
import { ParsedSubscription } from '@/lib/api/emailSync';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

export default function SyncEmailPage() {
  usePageTitle('Sync Email');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const syncMutation = useSyncEmails();
  const [subscriptions, setSubscriptions] = useState<ParsedSubscription[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadDetectedSubscriptions();
  }, []);

  const loadDetectedSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await syncMutation.mutateAsync({ 
        months_back: 3, 
        max_results: 50,
        auto_create: true  // Enable automatic subscription creation
      });
      setSubscriptions(res.data.new_subscriptions);
      // Auto-select all by default
      setSelected(new Set(res.data.new_subscriptions.map((_, i) => i)));
    } catch (err: any) {
      console.error('Failed to sync:', err);
      showToast(
        err?.response?.data?.detail || 'Failed to sync emails',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const handleImport = async () => {
    const toImport = subscriptions.filter((_, i) => selected.has(i));
    
    if (toImport.length === 0) {
      showToast('Please select at least one subscription to import', 'error');
      return;
    }

    try {
      setImporting(true);
      
      // Import subscriptions one by one (batch import endpoint may not exist)
      const importPromises = toImport.map(sub =>
        subscriptionsApi.create({
          name: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingCycle: sub.billingCycle as 'monthly' | 'yearly' | 'quarterly' | 'weekly',
          nextRenewalDate: sub.nextRenewalDate,
          category: 'Uncategorized',
          isActive: true,
        })
      );

      await Promise.all(importPromises);
      
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      showToast(`Successfully imported ${toImport.length} subscription(s)`, 'success');
      router.push('/dashboard/subscriptions?imported=true');
    } catch (err: any) {
      console.error('Failed to import:', err);
      showToast(
        err?.response?.data?.detail || 'Failed to import subscriptions',
        'error'
      );
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">Syncing emails and detecting subscriptions...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review Detected Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and select which subscriptions to import to your account.
          </p>
        </div>
        
        {subscriptions.length === 0 ? (
          <Card className="p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No New Subscriptions Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn&apos;t find any new subscriptions in your emails. They may already be in your account.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push('/dashboard/subscriptions')}
                variant="accent"
              >
                Go to Subscriptions
              </Button>
              <Button
                onClick={loadDetectedSubscriptions}
                variant="outline"
              >
                Sync Again
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Found <span className="font-semibold text-gray-900 dark:text-white">{subscriptions.length}</span> potential subscriptions. 
                Select which ones to import.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  disabled={selected.size === 0 || importing}
                  variant="accent"
                  className="px-6"
                >
                  {importing ? 'Importing...' : `Import Selected (${selected.size})`}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {subscriptions.map((sub, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    selected.has(index)
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleSelection(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                        {sub.confidence && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {Math.round(sub.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <span className="font-medium">{sub.currency} {sub.amount.toFixed(2)}</span>
                          {' '}/ {sub.billingCycle}
                        </p>
                        <p>
                          Next renewal: {new Date(sub.nextRenewalDate).toLocaleDateString()}
                        </p>
                        {sub.sender_email && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            From: {sub.sender_email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => toggleSelection(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

