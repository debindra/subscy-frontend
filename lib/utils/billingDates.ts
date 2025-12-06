import { parseISO, addMonths, addWeeks, addYears } from 'date-fns';

export function calculateFutureRenewalDates(
  startDate: string,
  billingCycle: string,
  count: number = 12
): Date[] {
  const dates: Date[] = [];
  let currentDate = parseISO(startDate);

  for (let i = 0; i < count; i++) {
    let nextDate: Date;

    switch (billingCycle) {
      case 'weekly':
        nextDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(currentDate, 1);
        break;
      case 'quarterly':
        nextDate = addMonths(currentDate, 3);
        break;
      case 'yearly':
        nextDate = addYears(currentDate, 1);
        break;
      default:
        nextDate = addMonths(currentDate, 1);
    }

    dates.push(nextDate);
    currentDate = nextDate;
  }

  return dates;
}

