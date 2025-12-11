/**
 * Tests for the currency conversion hooks.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import {
  useCurrencyConversion,
  useBulkCurrencyConversion,
} from '@/lib/hooks/useCurrencyConversion';
import { currencyApi } from '@/lib/api/currency';

// Mock the currency API
jest.mock('@/lib/api/currency', () => ({
  currencyApi: {
    convert: jest.fn(),
    convertMultiple: jest.fn(),
  },
}));

const mockedCurrencyApi = currencyApi as jest.Mocked<typeof currencyApi>;

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for testing
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCurrencyConversion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the amount when fromCurrency equals toCurrency', async () => {
    const params = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'USD', // Same currency
    };

    const { result } = renderHook(() => useCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should return immediately without API call
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(100);
    expect(mockedCurrencyApi.convert).not.toHaveBeenCalled();
  });

  it('should call the API when currencies are different', async () => {
    const params = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    mockedCurrencyApi.convert.mockResolvedValue({
      data: {
        originalAmount: 100,
        originalCurrency: 'USD',
        convertedAmount: 92,
        targetCurrency: 'EUR',
      },
    });

    const { result } = renderHook(() => useCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    // Wait for success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedCurrencyApi.convert).toHaveBeenCalledWith(100, 'USD', 'EUR');
    expect(result.current.data).toBe(92);
  });

  it('should handle API errors gracefully', async () => {
    const params = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    mockedCurrencyApi.convert.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Wait for error state
    await waitFor(() => expect(result.current.isError).toBe(true));

    // The hook should return the original amount as fallback
    expect(result.current.data).toBe(100);
  });

  it('should not call API when amount is 0', async () => {
    const params = {
      amount: 0,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    const { result } = renderHook(() => useCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should be disabled when amount is 0
    expect(result.current.isFetching).toBe(false);
    expect(mockedCurrencyApi.convert).not.toHaveBeenCalled();
  });

  it('should refetch when parameters change', async () => {
    const initialParams = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    const { result, rerender } = renderHook(
      (props) => useCurrencyConversion(props),
      {
        initialProps: initialParams,
        wrapper: createWrapper(),
      }
    );

    mockedCurrencyApi.convert.mockResolvedValue({
      data: { convertedAmount: 92 } as any,
    });

    // Wait for first call
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.convert).toHaveBeenCalledTimes(1);

    // Change parameters
    const newParams = {
      amount: 200,
      fromCurrency: 'USD',
      toCurrency: 'GBP',
    };

    rerender(newParams);

    // Should call API again with new parameters
    await waitFor(() => expect(mockedCurrencyApi.convert).toHaveBeenCalledTimes(2));
    expect(mockedCurrencyApi.convert).toHaveBeenLastCalledWith(200, 'USD', 'GBP');
  });
});

describe('useBulkCurrencyConversion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sum amounts when all currencies match target currency', async () => {
    const params = {
      amountsByCurrency: {
        USD: 100,
        USD: 50,
        USD: 30,
      },
      toCurrency: 'USD',
    };

    const { result } = renderHook(() => useBulkCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should return immediately without API call
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(180); // 100 + 50 + 30
    expect(mockedCurrencyApi.convertMultiple).not.toHaveBeenCalled();
  });

  it('should call the API when currencies are different', async () => {
    const params = {
      amountsByCurrency: {
        USD: 100,
        EUR: 50,
      },
      toCurrency: 'USD',
    };

    mockedCurrencyApi.convertMultiple.mockResolvedValue({
      data: {
        totalConvertedAmount: 154.35,
        targetCurrency: 'USD',
        originalAmounts: { USD: 100, EUR: 50 },
        conversionCount: 2,
      },
    });

    const { result } = renderHook(() => useBulkCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    // Wait for success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedCurrencyApi.convertMultiple).toHaveBeenCalledWith(
      { USD: 100, EUR: 50 },
      'USD'
    );
    expect(result.current.data).toBe(154.35);
  });

  it('should handle API errors with individual conversion fallback', async () => {
    const params = {
      amountsByCurrency: {
        USD: 100,
        EUR: 50,
      },
      toCurrency: 'USD',
    };

    // Mock bulk conversion to fail
    mockedCurrencyApi.convertMultiple.mockRejectedValue(new Error('Bulk API error'));

    // Mock individual conversions to succeed
    mockedCurrencyApi.convert
      .mockResolvedValueOnce({
        data: { convertedAmount: 100 } as any, // USD to USD
      })
      .mockResolvedValueOnce({
        data: { convertedAmount: 54.35 } as any, // EUR to USD
      });

    const { result } = renderHook(() => useBulkCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Wait for success (should use fallback)
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should have tried bulk first
    expect(mockedCurrencyApi.convertMultiple).toHaveBeenCalled();

    // Then should have tried individual conversions
    expect(mockedCurrencyApi.convert).toHaveBeenCalledTimes(2);

    // First call: USD to USD (should return same amount)
    expect(mockedCurrencyApi.convert).toHaveBeenNthCalledWith(1, 100, 'USD', 'USD');

    // Second call: EUR to USD
    expect(mockedCurrencyApi.convert).toHaveBeenNthCalledWith(2, 50, 'EUR', 'USD');

    // Result should be sum of individual conversions
    expect(result.current.data).toBe(154.35); // 100 + 54.35
  });

  it('should handle complete failure with simple sum fallback', async () => {
    const params = {
      amountsByCurrency: {
        USD: 100,
        EUR: 50,
      },
      toCurrency: 'USD',
    };

    // Mock both bulk and individual conversions to fail
    mockedCurrencyApi.convertMultiple.mockRejectedValue(new Error('Bulk API error'));
    mockedCurrencyApi.convert.mockRejectedValue(new Error('Individual API error'));

    const { result } = renderHook(() => useBulkCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Wait for success (should use final fallback)
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should have tried bulk first
    expect(mockedCurrencyApi.convertMultiple).toHaveBeenCalled();

    // Then should have tried individual conversions
    expect(mockedCurrencyApi.convert).toHaveBeenCalled();

    // Final fallback: simple sum
    expect(result.current.data).toBe(150); // 100 + 50
  });

  it('should not call API when amountsByCurrency is empty', async () => {
    const params = {
      amountsByCurrency: {},
      toCurrency: 'USD',
    };

    const { result } = renderHook(() => useBulkCurrencyConversion(params), {
      wrapper: createWrapper(),
    });

    // Should be disabled when empty
    expect(result.current.isFetching).toBe(false);
    expect(mockedCurrencyApi.convertMultiple).not.toHaveBeenCalled();
  });

  it('should refetch when parameters change', async () => {
    const initialParams = {
      amountsByCurrency: { USD: 100 },
      toCurrency: 'EUR',
    };

    const { result, rerender } = renderHook(
      (props) => useBulkCurrencyConversion(props),
      {
        initialProps: initialParams,
        wrapper: createWrapper(),
      }
    );

    mockedCurrencyApi.convertMultiple.mockResolvedValue({
      data: { totalConvertedAmount: 92 } as any,
    });

    // Wait for first call
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.convertMultiple).toHaveBeenCalledTimes(1);

    // Change parameters
    const newParams = {
      amountsByCurrency: { GBP: 200 },
      toCurrency: 'USD',
    };

    rerender(newParams);

    // Should call API again with new parameters
    await waitFor(() => expect(mockedCurrencyApi.convertMultiple).toHaveBeenCalledTimes(2));
    expect(mockedCurrencyApi.convertMultiple).toHaveBeenLastCalledWith(
      { GBP: 200 },
      'USD'
    );
  });
});

describe('Currency Hook Integration', () => {
  it('should have proper query caching', async () => {
    const params1 = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    const params2 = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR', // Same as params1
    };

    mockedCurrencyApi.convert.mockResolvedValue({
      data: { convertedAmount: 92 } as any,
    });

    const wrapper = createWrapper();

    // First call
    const { result: result1 } = renderHook(() => useCurrencyConversion(params1), {
      wrapper,
    });

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.convert).toHaveBeenCalledTimes(1);

    // Second call with same parameters
    const { result: result2 } = renderHook(() => useCurrencyConversion(params2), {
      wrapper,
    });

    // Should use cache, not call API again
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.convert).toHaveBeenCalledTimes(1); // Still 1

    // Both should have same data
    expect(result1.current.data).toBe(92);
    expect(result2.current.data).toBe(92);
  });
});