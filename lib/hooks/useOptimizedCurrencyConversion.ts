import { useMemo } from 'react';
import { useExchangeRates, calculateConversion } from './useExchangeRates';

interface OptimizedCurrencyConversionParams {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  baseCurrency?: string;
}

export const useOptimizedCurrencyConversion = (params: OptimizedCurrencyConversionParams) => {
  const { amount, fromCurrency, toCurrency, baseCurrency = 'USD' } = params;

  // Determine which currencies we need exchange rates for
  const targetCurrencies = useMemo(() => {
    const currencies = new Set<string>();

    if (fromCurrency !== baseCurrency) {
      currencies.add(fromCurrency);
    }

    if (toCurrency !== baseCurrency) {
      currencies.add(toCurrency);
    }

    return Array.from(currencies);
  }, [fromCurrency, toCurrency, baseCurrency]);

  // Fetch exchange rates
  const { data: ratesData, isLoading, error } = useExchangeRates({
    baseCurrency,
    targetCurrencies: targetCurrencies.length > 0 ? targetCurrencies : undefined,
  });

  // Calculate converted amount using cached rates
  const convertedAmount = useMemo(() => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (!ratesData?.rates) {
      return null;
    }

    try {
      return calculateConversion(amount, fromCurrency, toCurrency, ratesData.rates, baseCurrency);
    } catch (conversionError) {
      console.error('Currency conversion calculation error:', conversionError);
      return null;
    }
  }, [amount, fromCurrency, toCurrency, ratesData?.rates, baseCurrency]);

  return {
    data: convertedAmount,
    isLoading,
    error,
    isConverted: convertedAmount !== null && fromCurrency !== toCurrency,
  };
};

// Optimized bulk conversion using rate-based caching
interface OptimizedBulkConversionParams {
  amountsByCurrency: Record<string, number>;
  toCurrency: string;
  baseCurrency?: string;
}

export const useOptimizedBulkCurrencyConversion = (params: OptimizedBulkConversionParams) => {
  const { amountsByCurrency, toCurrency, baseCurrency = 'USD' } = params;

  // Determine all unique currencies we need rates for
  const targetCurrencies = useMemo(() => {
    const currencies = new Set<string>();

    Object.keys(amountsByCurrency).forEach(currency => {
      if (currency !== baseCurrency) {
        currencies.add(currency);
      }
    });

    if (toCurrency !== baseCurrency) {
      currencies.add(toCurrency);
    }

    return Array.from(currencies);
  }, [amountsByCurrency, toCurrency, baseCurrency]);

  // Fetch exchange rates
  const { data: ratesData, isLoading, error } = useExchangeRates({
    baseCurrency,
    targetCurrencies: targetCurrencies.length > 0 ? targetCurrencies : undefined,
  });

  // Calculate total converted amount
  const totalConvertedAmount = useMemo(() => {
    if (!ratesData?.rates) {
      return null;
    }

    try {
      let total = 0;

      for (const [currency, amount] of Object.entries(amountsByCurrency)) {
        if (currency === toCurrency) {
          total += amount;
        } else {
          const converted = calculateConversion(amount, currency, toCurrency, ratesData.rates, baseCurrency);
          total += converted;
        }
      }

      return total;
    } catch (conversionError) {
      console.error('Bulk currency conversion calculation error:', conversionError);
      return null;
    }
  }, [amountsByCurrency, toCurrency, ratesData?.rates, baseCurrency]);

  return {
    data: totalConvertedAmount,
    isLoading,
    error,
    isConverted: totalConvertedAmount !== null,
  };
};