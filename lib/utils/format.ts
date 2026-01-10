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

/**
 * Formats a date with time and GMT offset, returns date, time, and timezone separately
 * @param date - Date string or Date object
 * @param timezone - IANA timezone identifier (e.g., 'America/New_York'). If not provided, uses browser default.
 * @returns Object with date, time, and timezone strings, e.g. { date: "Jan 9, 2026", time: "3:45 PM", timezone: "GMT+5:45" }
 */
export const formatDateTimeWithTimezone = (date: string | Date, timezone?: string | null): { date: string; time: string; timezone: string } => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Get effective timezone - use user's timezone or browser default
  let effectiveTimezone: string;
  if (timezone) {
    effectiveTimezone = timezone;
  } else {
    try {
      effectiveTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      effectiveTimezone = 'UTC';
    }
  }

  try {
    // Format date
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: effectiveTimezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    // Format time
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: effectiveTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    // Get GMT offset for the specific timezone and date
    // Use Intl.DateTimeFormat with formatToParts to get precise timezone offset
    let gmtOffset = 'GMT';
    
    try {
      // Use formatToParts to get timezone offset directly
      const offsetParts = new Intl.DateTimeFormat('en-US', {
        timeZone: effectiveTimezone,
        timeZoneName: 'longOffset',
      }).formatToParts(dateObj);
      
      const offsetPart = offsetParts.find(p => p.type === 'timeZoneName');
      if (offsetPart?.value) {
        // Parse offset like "GMT+05:45" or "GMT-05:00"
        const match = offsetPart.value.match(/GMT([+-])(\d{2}):(\d{2})/);
        if (match) {
          const sign = match[1];
          const hours = parseInt(match[2]);
          const minutes = parseInt(match[3]);
          // Format as GMT+5:45 (remove leading zero from hours)
          gmtOffset = `GMT${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
        }
      }
      
      // If longOffset didn't work, calculate manually
      if (gmtOffset === 'GMT') {
        // Calculate offset by comparing UTC and timezone time for the same moment
        const utcTime = dateObj.getTime();
        const utcDate = new Date(utcTime);
        
        // Get UTC components
        const utcHours = utcDate.getUTCHours();
        const utcMinutes = utcDate.getUTCMinutes();
        
        // Get timezone components using formatToParts for accuracy
        const tzParts = new Intl.DateTimeFormat('en-US', {
          timeZone: effectiveTimezone,
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
        }).formatToParts(utcDate);
        
        const tzHours = parseInt(tzParts.find(p => p.type === 'hour')?.value || '0');
        const tzMinutes = parseInt(tzParts.find(p => p.type === 'minute')?.value || '0');
        
        // Calculate difference
        let diffHours = tzHours - utcHours;
        let diffMinutes = tzMinutes - utcMinutes;
        
        // Handle day boundary (normalize to -12 to +14 range)
        if (diffHours < -12) diffHours += 24;
        if (diffHours > 14) diffHours -= 24;
        
        // Normalize minutes
        if (diffMinutes < 0) {
          diffMinutes += 60;
          diffHours -= 1;
        }
        if (diffHours < 0 && diffMinutes > 0) {
          diffHours += 24;
        }
        
        const totalMinutes = diffHours * 60 + diffMinutes;
        const offsetHours = Math.floor(Math.abs(totalMinutes) / 60);
        const offsetMins = Math.abs(totalMinutes) % 60;
        const sign = totalMinutes >= 0 ? '+' : '-';
        
        gmtOffset = `GMT${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins.toString().padStart(2, '0')}` : ''}`;
      }
    } catch (e) {
      // Fallback to GMT if all else fails
      gmtOffset = 'GMT';
    }
    
    const formattedDate = dateFormatter.format(dateObj);
    const formattedTime = timeFormatter.format(dateObj);
    
    return { date: formattedDate, time: formattedTime, timezone: gmtOffset };
  } catch (error) {
    // Fallback to basic formatting if timezone is invalid
    console.warn(`Invalid timezone: ${effectiveTimezone}, falling back to browser default`);
    return {
      date: format(dateObj, 'MMM d, yyyy'),
      time: format(dateObj, 'h:mm a'),
      timezone: 'GMT',
    };
  }
};

export const getDaysUntil = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // Normalize to midnight for consistent day calculations
  const normalizedDate = new Date(dateObj);
  normalizedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(normalizedDate, today);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

