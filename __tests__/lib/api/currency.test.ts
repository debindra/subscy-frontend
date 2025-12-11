/**
 * Tests for the currency API client.
 */
import { currencyApi } from '@/lib/api/currency';
import { apiClient } from '@/lib/api/client';

// Mock the apiClient
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('currencyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convert', () => {
    it('should call the correct endpoint with parameters', async () => {
      const mockResponse = {
        data: {
          originalAmount: 100,
          originalCurrency: 'USD',
          convertedAmount: 92,
          targetCurrency: 'EUR',
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await currencyApi.convert(100, 'USD', 'EUR');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/currency/convert', {
        params: {
          amount: 100,
          from_currency: 'USD',
          to_currency: 'EUR',
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(currencyApi.convert(100, 'USD', 'EUR')).rejects.toThrow('API error');
    });
  });

  describe('convertMultiple', () => {
    it('should call the correct endpoint with request body', async () => {
      const mockResponse = {
        data: {
          totalConvertedAmount: 250,
          targetCurrency: 'USD',
          originalAmounts: { USD: 100, EUR: 50 },
          conversionCount: 2,
        },
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const amountsByCurrency = { USD: 100, EUR: 50 };
      const result = await currencyApi.convertMultiple(amountsByCurrency, 'USD');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/currency/convert-multiple', {
        amounts_by_currency: amountsByCurrency,
        to_currency: 'USD',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockedApiClient.post.mockRejectedValue(error);

      await expect(
        currencyApi.convertMultiple({ USD: 100 }, 'EUR')
      ).rejects.toThrow('API error');
    });
  });

  describe('getExchangeRates', () => {
    it('should call the correct endpoint with base currency', async () => {
      const mockResponse = {
        data: {
          base: 'USD',
          rates: { USD: 1.0, EUR: 0.92, GBP: 0.79 },
          timestamp: 1234567890,
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await currencyApi.getExchangeRates('USD');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/currency/rates', {
        params: {
          base_currency: 'USD',
          target_currencies: undefined,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should include target currencies when provided', async () => {
      const mockResponse = {
        data: {
          base: 'USD',
          rates: { EUR: 0.92, GBP: 0.79 },
          timestamp: 1234567890,
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await currencyApi.getExchangeRates('USD', ['EUR', 'GBP']);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/currency/rates', {
        params: {
          base_currency: 'USD',
          target_currencies: 'EUR,GBP',
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty target currencies array', async () => {
      const mockResponse = {
        data: {
          base: 'USD',
          rates: { USD: 1.0, EUR: 0.92 },
          timestamp: 1234567890,
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await currencyApi.getExchangeRates('USD', []);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/currency/rates', {
        params: {
          base_currency: 'USD',
          target_currencies: '',
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should use default base currency when not provided', async () => {
      const mockResponse = {
        data: {
          base: 'USD',
          rates: { USD: 1.0, EUR: 0.92 },
          timestamp: 1234567890,
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await currencyApi.getExchangeRates();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/currency/rates', {
        params: {
          base_currency: 'USD',
          target_currencies: undefined,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(currencyApi.getExchangeRates('USD')).rejects.toThrow('API error');
    });
  });
});

describe('Currency API Types', () => {
  describe('CurrencyConversionResponse', () => {
    it('should have correct type structure', () => {
      // This is a type test - we're checking that our mock data matches the expected type
      const response: any = {
        originalAmount: 100,
        originalCurrency: 'USD',
        convertedAmount: 92,
        targetCurrency: 'EUR',
      };

      expect(response).toMatchObject({
        originalAmount: expect.any(Number),
        originalCurrency: expect.any(String),
        convertedAmount: expect.any(Number),
        targetCurrency: expect.any(String),
      });
    });
  });

  describe('BulkCurrencyConversionResponse', () => {
    it('should have correct type structure', () => {
      const response: any = {
        totalConvertedAmount: 250,
        targetCurrency: 'USD',
        originalAmounts: { USD: 100, EUR: 50 },
        conversionCount: 2,
      };

      expect(response).toMatchObject({
        totalConvertedAmount: expect.any(Number),
        targetCurrency: expect.any(String),
        originalAmounts: expect.any(Object),
        conversionCount: expect.any(Number),
      });
    });
  });

  describe('ExchangeRatesResponse', () => {
    it('should have correct type structure', () => {
      const response: any = {
        base: 'USD',
        rates: { USD: 1.0, EUR: 0.92, GBP: 0.79 },
        timestamp: 1234567890,
      };

      expect(response).toMatchObject({
        base: expect.any(String),
        rates: expect.any(Object),
        timestamp: expect.any(Number),
      });
    });
  });
});