/**
 * Tests for the exchange rates hook.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useExchangeRates, calculateConversion } from '@/lib/hooks/useExchangeRates';
import { currencyApi } from '@/lib/api/currency';

// Mock the currency API
jest.mock('@/lib/api/currency', () => ({
  currencyApi: {
    getExchangeRates: jest.fn(),
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  return Wrapper;
};

describe('useExchangeRates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch exchange rates with default parameters', async () => {
    const mockResponse = {
      base: 'USD',
      rates: { USD: 1.0, EUR: 0.92, GBP: 0.79 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useExchangeRates(), {
      wrapper: createWrapper(),
    });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    // Wait for success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledWith('USD', undefined);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should fetch exchange rates with custom base currency', async () => {
    const mockResponse = {
      base: 'EUR',
      rates: { EUR: 1.0, USD: 1.09, GBP: 0.86 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const params = { baseCurrency: 'EUR' };
    const { result } = renderHook(() => useExchangeRates(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledWith('EUR', undefined);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should fetch exchange rates with target currencies', async () => {
    const mockResponse = {
      base: 'USD',
      rates: { EUR: 0.92, GBP: 0.79 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const params = {
      baseCurrency: 'USD',
      targetCurrencies: ['EUR', 'GBP'],
    };
    const { result } = renderHook(() => useExchangeRates(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledWith('USD', ['EUR', 'GBP']);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    mockedCurrencyApi.getExchangeRates.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useExchangeRates(), {
      wrapper: createWrapper(),
    });

    // Wait for error
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('API error'));
  });

  it('should not fetch when base currency is empty', async () => {
    const params = { baseCurrency: '' };
    const { result } = renderHook(() => useExchangeRates(params), {
      wrapper: createWrapper(),
    });

    // Should be disabled when base currency is empty
    expect(result.current.isFetching).toBe(false);
    expect(mockedCurrencyApi.getExchangeRates).not.toHaveBeenCalled();
  });

  it('should refetch when parameters change', async () => {
    const initialParams = { baseCurrency: 'USD' };
    const mockResponse1 = {
      base: 'USD',
      rates: { USD: 1.0, EUR: 0.92 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse1,
    });

    const { result, rerender } = renderHook(
      (props) => useExchangeRates(props),
      {
        initialProps: initialParams,
        wrapper: createWrapper(),
      }
    );

    // Wait for first call
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledTimes(1);

    // Change parameters
    const newParams = { baseCurrency: 'EUR', targetCurrencies: ['USD', 'GBP'] };
    const mockResponse2 = {
      base: 'EUR',
      rates: { USD: 1.09, GBP: 0.86 },
      timestamp: 1234567891,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse2,
    });

    rerender(newParams);

    // Should call API again with new parameters
    await waitFor(() => expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledTimes(2));
    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);
  });

  it('should cache results for same parameters', async () => {
    const params = { baseCurrency: 'USD' };
    const mockResponse = {
      base: 'USD',
      rates: { USD: 1.0, EUR: 0.92 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const wrapper = createWrapper();

    // First call
    const { result: result1 } = renderHook(() => useExchangeRates(params), {
      wrapper,
    });

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledTimes(1);

    // Second call with same parameters
    const { result: result2 } = renderHook(() => useExchangeRates(params), {
      wrapper,
    });

    // Should use cache, not call API again
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));
    expect(mockedCurrencyApi.getExchangeRates).toHaveBeenCalledTimes(1); // Still 1
  });
});

describe('calculateConversion', () => {
  const rates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150.25,
  };

  it('should return same amount when currencies are the same', () => {
    const result = calculateConversion(100, 'USD', 'USD', rates);
    expect(result).toBe(100);
  });

  it('should convert from base currency to target currency', () => {
    // 100 USD to EUR: 100 * 0.92 = 92
    const result = calculateConversion(100, 'USD', 'EUR', rates);
    expect(result).toBe(92);
  });

  it('should convert from target currency to base currency', () => {
    // 100 EUR to USD: 100 / 0.92 = 108.70
    const result = calculateConversion(100, 'EUR', 'USD', rates);
    expect(result).toBeCloseTo(100 / 0.92, 2);
  });

  it('should convert between two non-base currencies', () => {
    // 100 EUR to GBP:
    // First convert EUR to USD: 100 / 0.92 = 108.70 USD
    // Then convert USD to GBP: 108.70 * 0.79 = 85.87 GBP
    const result = calculateConversion(100, 'EUR', 'GBP', rates);
    const expected = (100 / 0.92) * 0.79;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('should throw error when from currency rate is missing', () => {
    expect(() => {
      calculateConversion(100, 'CAD', 'USD', rates);
    }).toThrow('Missing exchange rate for conversion: CAD→USD (missing: CAD)');
  });

  it('should throw error when to currency rate is missing', () => {
    expect(() => {
      calculateConversion(100, 'USD', 'CAD', rates);
    }).toThrow('Missing exchange rate for conversion: USD→CAD (missing: CAD)');
  });

  it('should work with custom base currency', () => {
    const customRates = {
      EUR: 1.0,
      USD: 1.09,
      GBP: 0.86,
    };

    // 100 EUR to GBP with EUR as base: 100 * 0.86 = 86
    const result = calculateConversion(100, 'EUR', 'GBP', customRates, 'EUR');
    expect(result).toBe(86);
  });

  it('should handle conversion when from currency is base currency', () => {
    const result = calculateConversion(100, 'USD', 'EUR', rates, 'USD');
    expect(result).toBe(92); // 100 * 0.92
  });

  it('should handle conversion when to currency is base currency', () => {
    const result = calculateConversion(100, 'EUR', 'USD', rates, 'USD');
    expect(result).toBeCloseTo(100 / 0.92, 2);
  });
});

describe('Integration between useExchangeRates and calculateConversion', () => {
  it('should use fetched rates for conversion', async () => {
    const mockResponse = {
      base: 'USD',
      rates: { USD: 1.0, EUR: 0.92, GBP: 0.79 },
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const params = { baseCurrency: 'USD' };
    const { result } = renderHook(() => useExchangeRates(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Use the fetched rates for conversion
    const conversion = calculateConversion(
      100,
      'USD',
      'EUR',
      result.current.data!.rates,
      result.current.data!.base
    );

    expect(conversion).toBe(92);
  });

  it('should handle missing rates gracefully', async () => {
    const mockResponse = {
      base: 'USD',
      rates: { USD: 1.0, EUR: 0.92 }, // Missing GBP
      timestamp: 1234567890,
    };

    mockedCurrencyApi.getExchangeRates.mockResolvedValue({
      data: mockResponse,
    });

    const params = { baseCurrency: 'USD' };
    const { result } = renderHook(() => useExchangeRates(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Try to convert using missing rate
    expect(() => {
      calculateConversion(
        100,
        'USD',
        'GBP',
        result.current.data!.rates,
        result.current.data!.base
      );
    }).toThrow('Missing exchange rate for conversion: USD→GBP (missing: GBP)');
  });
});