import React from 'react';
import userEvent from '@testing-library/user-event';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { renderWithProviders, screen } from '@/__tests__/utils/test-utils';
import { mockActiveSubscription, mockTrialSubscription } from '@/__tests__/mocks/subscriptions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/lib/utils/format', () => ({
  formatCurrency: (amount: number, currency: string) => `${currency} ${amount}`,
  formatDate: () => 'Jan 01, 2025',
  getDaysUntil: jest.fn(() => 5),
}));

jest.mock('@/lib/hooks/useOptimizedCurrencyConversion', () => ({
  useOptimizedCurrencyConversion: () => ({
    data: undefined,
    isLoading: false,
  }),
}));

describe('SubscriptionCard', () => {
  it('renders subscription information and badges', () => {
    renderWithProviders(
      <SubscriptionCard
        subscription={{ ...mockTrialSubscription, isActive: false }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getAllByText('USD 0')[0]).toBeInTheDocument();
    expect(screen.getByText('Trial')).toBeInTheDocument();
    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
  });

  it('invokes callbacks when action buttons are clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(
      <SubscriptionCard subscription={mockActiveSubscription} onEdit={onEdit} onDelete={onDelete} />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockActiveSubscription);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockActiveSubscription.id);
  });
});

