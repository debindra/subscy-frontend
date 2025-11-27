import { format, parseISO, differenceInDays } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  // Normalize currency code to uppercase (required by Intl.NumberFormat)
  const normalizedCurrency = currency?.toUpperCase() || 'USD';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amount);
  } catch (error) {
    // Fallback to USD if currency code is invalid
    console.warn(`Invalid currency code: ${normalizedCurrency}, falling back to USD`);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MM/dd/yyyy');
};

export const getDaysUntil = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

