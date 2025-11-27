import React from 'react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { renderWithProviders, screen, waitFor } from '@/__tests__/utils/test-utils';
import { mockActiveSubscription } from '@/__tests__/mocks/subscriptions';

const mockUsePlanFeatures = jest.fn(() => ({
  hasCategorization: true,
  hasSmartRenewalManagement: true,
  loading: false,
}));

jest.mock('@/lib/hooks/usePlanFeatures', () => ({
  usePlanFeatures: () => mockUsePlanFeatures(),
}));

describe('SubscriptionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits cleaned optional fields when saving a subscription', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <SubscriptionForm
        subscription={mockActiveSubscription}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />
    );

    const nameInput = screen.getByPlaceholderText(/netflix, spotify, adobe/i);
    await user.clear(nameInput);
    await user.type(nameInput, ' Notion ');

    const amountInput = screen.getByPlaceholderText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '12.5');

    const renewalInput = screen.getByPlaceholderText(/next renewal date/i);
    await user.clear(renewalInput);
    await user.type(renewalInput, '2025-01-01');

    const descriptionInput = screen.getByPlaceholderText(/brief description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, '  Workspace tool  ');

    const websiteInput = screen.getByPlaceholderText(/https:\/\/example.com/i);
    await user.clear(websiteInput);
    await user.type(websiteInput, ' https://notion.so ');

    await user.click(screen.getByRole('button', { name: /update subscription/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: ' Notion ',
          amount: 12.5,
          nextRenewalDate: '2025-01-01',
          description: 'Workspace tool',
          website: 'https://notion.so',
        })
      )
    );
  });

  it('shows additional sections and pre-fills values when editing', () => {
    renderWithProviders(
      <SubscriptionForm
        subscription={{ ...mockActiveSubscription, description: 'Existing note' }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText(/additional details/i)).toBeInTheDocument();
    expect(screen.getByText(/payment information/i)).toBeInTheDocument();
    expect(screen.getByText(/settings & preferences/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://netflix.com')).toBeInTheDocument();
  });
});

