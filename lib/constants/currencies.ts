export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'INR'
  | 'NZD'
  | 'SGD'
  | 'HKD'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'PLN'
  | 'MXN'
  | 'BRL'
  | 'ZAR'
  | 'KRW'
  | 'TRY'
  | 'RUB'
  | 'THB'
  | 'IDR'
  | 'MYR'
  | 'PHP'
  | 'NPR'
  | 'ILS'
  | 'AED'
  | 'SAR'
  | 'CZK'
  | 'HUF';

export type SupportedCurrencyOption = { value: CurrencyCode; label: string };

// Central list of supported currencies for conversion (e.g. FreecurrencyAPI / Wise)
// Keep this in sync with your FX provider's supported currencies.
export const SUPPORTED_CURRENCIES: SupportedCurrencyOption[] = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'CHF', label: 'CHF' },
  { value: 'CNY', label: 'CNY (¥)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'NZD', label: 'NZD ($)' },
  { value: 'SGD', label: 'SGD ($)' },
  { value: 'HKD', label: 'HKD ($)' },
  { value: 'SEK', label: 'SEK' },
  { value: 'NOK', label: 'NOK' },
  { value: 'DKK', label: 'DKK' },
  { value: 'PLN', label: 'PLN' },
  { value: 'MXN', label: 'MXN ($)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'ZAR', label: 'ZAR (R)' },
  { value: 'KRW', label: 'KRW (₩)' },
  { value: 'TRY', label: 'TRY (₺)' },
  { value: 'RUB', label: 'RUB (₽)' },
  { value: 'THB', label: 'THB (฿)' },
  { value: 'IDR', label: 'IDR (Rp)' },
  { value: 'MYR', label: 'MYR (RM)' },
  { value: 'PHP', label: 'PHP (₱)' },
  { value: 'NPR', label: 'NPR (रू)' },
  { value: 'ILS', label: 'ILS (₪)' },
  { value: 'AED', label: 'AED' },
  { value: 'SAR', label: 'SAR' },
  { value: 'CZK', label: 'CZK' },
  { value: 'HUF', label: 'HUF' },
];


