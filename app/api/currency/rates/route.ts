import { NextResponse } from 'next/server';

// Mock exchange rates relative to USD (1 USD -> rate units of currency)
const mockExchangeRates: Record<string, number> = {
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
  NPR: 133.50, // Nepalese Rupee
  NZD: 1.68,
  SGD: 1.34,
  HKD: 7.82,
  SEK: 10.45,
  NOK: 10.78,
  DKK: 6.89,
  PLN: 4.02,
  ZAR: 18.65,
  KRW: 1330.50,
  TRY: 32.15,
  RUB: 92.50,
  THB: 35.80,
  IDR: 15750.00,
  MYR: 4.72,
  PHP: 56.25,
  ILS: 3.65,
  AED: 3.67,
  SAR: 3.75,
  CZK: 22.85,
  HUF: 360.50,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const baseCurrency = (searchParams.get('base_currency') || 'USD').toUpperCase();
  const targetParam = searchParams.get('target_currencies');

  // Simulate a small network delay so UI spinners are visible and realistic
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!mockExchangeRates[baseCurrency]) {
    return NextResponse.json(
      { detail: `Unsupported base currency: ${baseCurrency}` },
      { status: 400 }
    );
  }

  const requestedTargets = targetParam
    ? targetParam
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean)
    : null;

  const baseRateInUsd = mockExchangeRates[baseCurrency];

  const rates: Record<string, number> = {};

  const addRate = (code: string) => {
    if (code === baseCurrency) {
      rates[code] = 1;
      return;
    }

    const rateInUsd = mockExchangeRates[code];
    if (!rateInUsd) {
      return;
    }

    // Our table is 1 USD -> rateInUsd units of `code`.
    // Convert to 1 baseCurrency -> ? units of `code`.
    // 1 base = (1 / baseRateInUsd) USD, so:
    // 1 base -> (rateInUsd / baseRateInUsd) units of `code`.
    rates[code] = rateInUsd / baseRateInUsd;
  };

  if (requestedTargets && requestedTargets.length > 0) {
    requestedTargets.forEach(addRate);
  } else {
    Object.keys(mockExchangeRates).forEach(addRate);
  }

  return NextResponse.json({
    base: baseCurrency,
    rates,
    timestamp: Date.now(),
  });
}


