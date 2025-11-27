import { useQuery } from '@tanstack/react-query';

interface CurrencyConversionParams {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export const useCurrencyConversion = (params: CurrencyConversionParams) => {
  return useQuery({
    queryKey: ['currency-conversion', params.amount, params.fromCurrency, params.toCurrency],
    queryFn: async () => {
      if (params.fromCurrency === params.toCurrency) {
        return params.amount;
      }

      try {
        const response = await fetch(`/api/currency/convert?amount=${params.amount}&from_currency=${params.fromCurrency}&to_currency=${params.toCurrency}`);
        if (!response.ok) {
          throw new Error('Currency conversion failed');
        }
        const data = await response.json();
        return data.convertedAmount;
      } catch (error) {
        console.error('Currency conversion error:', error);
        // Fallback: return original amount if conversion fails
        return params.amount;
      }
    },
    enabled: params.fromCurrency !== params.toCurrency && params.amount > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
};

interface BulkCurrencyConversionParams {
  amountsByCurrency: Record<string, number>;
  toCurrency: string;
}

export const useBulkCurrencyConversion = (params: BulkCurrencyConversionParams) => {
  return useQuery({
    queryKey: ['bulk-currency-conversion', params.amountsByCurrency, params.toCurrency],
    queryFn: async () => {
      // Check if all amounts are already in the target currency
      const currencies = Object.keys(params.amountsByCurrency);
      const allSameCurrency = currencies.every(currency => currency === params.toCurrency);

      if (allSameCurrency) {
        // If all amounts are already in target currency, just sum them
        return Object.values(params.amountsByCurrency).reduce((sum, amount) => sum + amount, 0);
      }

      try {
        const response = await fetch('/api/currency/convert-multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amounts_by_currency: params.amountsByCurrency,
            to_currency: params.toCurrency,
          }),
        });

        if (!response.ok) {
          throw new Error('Bulk currency conversion failed');
        }

        const data = await response.json();
        return data.totalConvertedAmount;
      } catch (error) {
        console.error('Bulk currency conversion error:', error);

        // Fallback: try individual conversions if bulk fails
        try {
          const individualPromises = Object.entries(params.amountsByCurrency).map(
            async ([currency, amount]) => {
              if (currency === params.toCurrency) {
                return amount;
              }

              const response = await fetch(`/api/currency/convert?amount=${amount}&from_currency=${currency}&to_currency=${params.toCurrency}`);
              if (!response.ok) {
                throw new Error(`Failed to convert ${currency} to ${params.toCurrency}`);
              }
              const data = await response.json();
              return data.convertedAmount;
            }
          );

          const results = await Promise.all(individualPromises);
          return results.reduce((sum, amount) => sum + amount, 0);
        } catch (fallbackError) {
          console.error('Individual conversion fallback also failed:', fallbackError);

          // Final fallback: simple sum (current behavior)
          return Object.values(params.amountsByCurrency).reduce((sum, amount) => sum + amount, 0);
        }
      }
    },
    enabled: Object.keys(params.amountsByCurrency).length > 0 && params.toCurrency.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};