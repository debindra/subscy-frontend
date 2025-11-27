import React from 'react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { renderWithProviders, screen } from '@/__tests__/utils/test-utils';
import { mockSubscriptions } from '@/__tests__/mocks/subscriptions';

const mockShowToast = jest.fn();

jest.mock('@/lib/context/ToastContext', () => {
  const actual = jest.requireActual('@/lib/context/ToastContext');
  return {
    ...actual,
    useToast: () => ({ showToast: mockShowToast }),
  };
});

jest.mock('@/lib/utils/export', () => ({
  exportToCSV: jest.fn(),
  exportSummaryToHTML: jest.fn(() => '<html></html>'),
  printHTML: jest.fn(),
  downloadHTML: jest.fn(),
  downloadPDFFromHTML: jest.fn().mockResolvedValue(undefined),
}));

const exportUtils = jest.requireMock('@/lib/utils/export') as {
  exportToCSV: jest.Mock;
  exportSummaryToHTML: jest.Mock;
  printHTML: jest.Mock;
  downloadHTML: jest.Mock;
  downloadPDFFromHTML: jest.Mock;
};

describe('ExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toggles menu and triggers CSV export', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ExportButton subscriptions={mockSubscriptions} monthlyTotal={100} yearlyTotal={1200} />
    );

    await user.click(screen.getByRole('button', { name: /export/i }));
    await user.click(screen.getByRole('button', { name: /export as csv/i }));

    expect(exportUtils.exportToCSV).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('CSV exported successfully', 'success');
  });

  it('exports HTML, PDF, and triggers print', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ExportButton subscriptions={mockSubscriptions} monthlyTotal={100} yearlyTotal={1200} />
    );

    const openMenu = async () => {
      await user.click(screen.getByRole('button', { name: /export/i }));
    };

    await openMenu();
    await user.click(screen.getByRole('button', { name: /export as html/i }));

    await openMenu();
    await user.click(screen.getByRole('button', { name: /export as pdf/i }));

    await openMenu();
    await user.click(screen.getByRole('button', { name: /print report/i }));

    expect(exportUtils.downloadHTML).toHaveBeenCalled();
    expect(exportUtils.downloadPDFFromHTML).toHaveBeenCalled();
    expect(exportUtils.printHTML).toHaveBeenCalled();
  });
});

