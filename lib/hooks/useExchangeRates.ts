import { useQuery } from '@tanstack/react-query';
import { currencyApi } from '@/lib/api/currency';
import type { ExchangeRatesResponse } from '@/lib/api/currency';
import { logger } from '@/lib/utils/logger';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

export interface UseExchangeRatesParams {
  baseCurrency?: string;
  targetCurrencies?: string[];
}

export const useExchangeRates = (params: UseExchangeRatesParams = {}) => {
  const { baseCurrency = 'USD', targetCurrencies } = params;
  const { user, loading, sessionReady } = useAuth();

  return useQuery({
    queryKey: ['exchange-rates', baseCurrency, targetCurrencies?.sort()],
    queryFn: async () => {
      // Double-check we have a session before making the request
      // This prevents race conditions where sessionReady is true but token isn't available yet
      if (typeof window !== 'undefined') {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('Exchange rates fetch attempted without valid session');
          throw new Error('Authentication required');
        }
      }

      try {
        const response = await currencyApi.getExchangeRates(baseCurrency, targetCurrencies);
        const data = response.data;
        
        // Ensure base currency is always in rates with value 1.0
        if (data.rates && !(baseCurrency.toUpperCase() in data.rates)) {
          data.rates[baseCurrency.toUpperCase()] = 1.0;
        }
        
        return data;
      } catch (error: any) {
        // Log more details about the error for debugging
        logger.error('Exchange rates fetch error', {
          error: error?.message,
          status: error?.response?.status,
          url: error?.config?.url,
        });
        throw error;
      }
    },
    enabled: baseCurrency.length > 0 && !loading && !!user && sessionReady, // Only run when user is authenticated AND session token is ready
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    retryOnMount: true, // Retry when component mounts if data is stale
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