import { NextResponse } from 'next/server';

// Mock exchange rates for testing
const mockExchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.25,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.89,
  CNY: 7.23,
  INR: 83.45, // Indian Rupee
  BRL: 5.12,
  MXN: 17.89,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get('amount') || '0');
  const fromCurrency = searchParams.get('from_currency') || 'USD';
  const toCurrency = searchParams.get('to_currency') || 'USD';

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (fromCurrency === toCurrency) {
    return NextResponse.json({ convertedAmount: amount });
  }

  const fromRate = mockExchangeRates[fromCurrency as keyof typeof mockExchangeRates];
  const toRate = mockExchangeRates[toCurrency as keyof typeof mockExchangeRates];

  if (!fromRate || !toRate) {
    return NextResponse.json({ error: 'Currency not supported' }, { status: 400 });
  }

  // Convert via USD: amount * (toRate / fromRate)
  const convertedAmount = amount * (toRate / fromRate);

  return NextResponse.json({
    convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
    fromCurrency,
    toCurrency,
    originalAmount: amount,
    exchangeRate: toRate / fromRate
  });
}