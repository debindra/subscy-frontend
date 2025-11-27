import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen, waitFor } from '@/__tests__/utils/test-utils';
import SubscriptionsPage from '@/app/dashboard/subscriptions/page';
import { mockSubscriptions } from '@/__tests__/mocks/subscriptions';

const mockShowToast = jest.fn();
jest.mock('@/lib/context/ToastContext', () => {
  const actual = jest.requireActual('@/lib/context/ToastContext');
  return {
    ...actual,
    useToast: () => ({ showToast: mockShowToast }),
  };
});

const mockPlanFeatures = {
  hasCategorization: true,
  hasSmartRenewalManagement: true,
  loading: false,
};

jest.mock('@/lib/hooks/usePlanFeatures', () => ({
  usePlanFeatures: () => mockPlanFeatures,
}));

const mockSearchParams = {
  get: jest.fn(),
  toString: jest.fn(() => ''),
};

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/lib/api/subscriptions', () => ({
  subscriptionsApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { subscriptionsApi: apiMocks } = jest.requireMock('@/lib/api/subscriptions') as {
  subscriptionsApi: {
    getAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('SubscriptionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiMocks.getAll.mockResolvedValue({ data: mockSubscriptions });
    apiMocks.create.mockResolvedValue(undefined);
    apiMocks.update.mockResolvedValue(undefined);
    apiMocks.delete.mockResolvedValue(undefined);
  });

  it('renders subscriptions and filters via search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);

    await waitFor(() => expect(screen.getByText('Netflix')).toBeInTheDocument());
    expect(screen.getByText(/active \(2\)/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /all \(3\)/i }));
    await user.type(screen.getByPlaceholderText(/search name/i), 'Gym');

    await waitFor(() => {
      expect(screen.getByText('Gym Membership')).toBeInTheDocument();
      expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
    });
  });

  it('opens modal to add subscription and confirms delete flow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);
    await waitFor(() => expect(screen.getByText('Netflix')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /\+ add subscription/i }));
    expect(screen.getByText(/add new subscription/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByText(/add new subscription/i)).not.toBeInTheDocument();

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => expect(apiMocks.delete).toHaveBeenCalled());
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('applies advanced filters and respects status buttons', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);

    await waitFor(() => expect(screen.getByText('Netflix')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /show advanced filters/i }));
    await user.selectOptions(screen.getByDisplayValue('All Billing Cycles'), 'monthly');
    await user.selectOptions(screen.getByDisplayValue('All Currencies'), 'USD');
    await user.selectOptions(screen.getByDisplayValue('All Trials'), 'trial');

    await user.click(screen.getByRole('button', { name: /inactive/i }));
    await waitFor(() => {
      expect(screen.getByText(/no subscriptions found/i)).toBeInTheDocument();
    });
  });
});

