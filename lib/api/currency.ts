import { apiClient } from './client';

export interface CurrencyConversionResponse {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
}

export interface BulkCurrencyConversionResponse {
  totalConvertedAmount: number;
  targetCurrency: string;
  originalAmounts: Record<string, number>;
  conversionCount: number;
}

export interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export const currencyApi = {
  convert: (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) =>
    apiClient.get<CurrencyConversionResponse>('/currency/convert', {
      params: {
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency,
      },
    }),

  convertMultiple: (
    amountsByCurrency: Record<string, number>,
    toCurrency: string
  ) =>
    apiClient.post<BulkCurrencyConversionResponse>('/currency/convert-multiple', {
      amounts_by_currency: amountsByCurrency,
      to_currency: toCurrency,
    }),

  getExchangeRates: (
    baseCurrency: string = 'USD',
    targetCurrencies?: string[]
  ) =>
    apiClient.get<ExchangeRatesResponse>('/currency/rates', {
      params: {
        base_currency: baseCurrency,
        target_currencies: targetCurrencies?.join(','),
      },
    }),
};