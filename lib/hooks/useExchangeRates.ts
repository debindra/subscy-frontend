import { useQuery } from '@tanstack/react-query';

export interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface UseExchangeRatesParams {
  baseCurrency?: string;
  targetCurrencies?: string[];
}

export const useExchangeRates = (params: UseExchangeRatesParams = {}) => {
  const { baseCurrency = 'USD', targetCurrencies } = params;

  return useQuery({
    queryKey: ['exchange-rates', baseCurrency, targetCurrencies?.sort()],
    queryFn: async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams({
          base_currency: baseCurrency,
        });

        if (targetCurrencies && targetCurrencies.length > 0) {
          queryParams.append('target_currencies', targetCurrencies.join(','));
        }

        const response = await fetch(`/api/currency/rates?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        return data as ExchangeRatesResponse;
      } catch (error) {
        console.error('Exchange rates fetch error:', error);
        throw error;
      }
    },
    enabled: baseCurrency.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
};

// Helper function to calculate conversion using cached rates
export const calculateConversion = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  baseCurrency: string = 'USD'
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to base currency first, then to target currency
  const fromRate = fromCurrency === baseCurrency ? 1 : rates[fromCurrency];
  const toRate = toCurrency === baseCurrency ? 1 : rates[toCurrency];

  if (!fromRate || !toRate) {
    const missingCurrency = !fromRate ? fromCurrency : toCurrency;
    throw new Error(`Missing exchange rate for conversion: ${fromCurrency}→${toCurrency} (missing: ${missingCurrency})`);
  }

  // Convert: amount → base currency → target currency
  const amountInBase = amount / fromRate;
  return amountInBase * toRate;
};