import {
  isSameYear,
  isWithinInterval,
  parseISO,
  format,
  differenceInMonths,
  max,
  min,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "../TimelineColumn";

/**
 * Check if item should be displayed as a card (only in its start period)
 */
export const shouldDisplayItem = (
  item: FinancialItem,
  period: TimePeriod
): boolean => {
  const itemStart = parseISO(item.startsAt);
  return isWithinInterval(itemStart, {
    start: period.startDate,
    end: period.endDate,
  });
};

/**
 * Check if item is active in this period (for totals calculation)
 */
export const isItemActiveInPeriod = (
  item: FinancialItem,
  period: TimePeriod
): boolean => {
  const itemStart = parseISO(item.startsAt);
  const itemEnd = item.endsAt ? parseISO(item.endsAt) : null;

  // Item hasn't started yet
  if (itemStart > period.endDate) return false;

  // Item has ended
  if (itemEnd && itemEnd < period.startDate) return false;

  // One-time items: only active in their start period
  if (item.frequency === "one_time") {
    return isWithinInterval(itemStart, {
      start: period.startDate,
      end: period.endDate,
    });
  }

  // Monthly items: active in all periods after start (until end if specified)
  if (item.frequency === "monthly") {
    return (
      itemStart <= period.endDate && (!itemEnd || itemEnd >= period.startDate)
    );
  }

  // Yearly items: active once per year
  if (item.frequency === "yearly") {
    return (
      isSameYear(itemStart, period.startDate) &&
      itemStart <= period.endDate &&
      (!itemEnd || itemEnd >= period.startDate)
    );
  }

  return false;
};

/**
 * Calculate the actual number of months an item is active within a period
 */
const calculateActiveMonthsInPeriod = (
  item: FinancialItem,
  period: TimePeriod
): number => {
  const itemStart = parseISO(item.startsAt);
  const itemEnd = item.endsAt ? parseISO(item.endsAt) : null;

  // Find the overlap between item's active period and the period
  const effectiveStart = max([itemStart, period.startDate]);
  const effectiveEnd = itemEnd
    ? min([itemEnd, period.endDate])
    : period.endDate;

  // If no overlap, return 0
  if (effectiveStart > effectiveEnd) {
    return 0;
  }

  // Calculate months between effective start and end
  // Use start of month for accurate month counting
  const startMonth = startOfMonth(effectiveStart);
  const endMonth = endOfMonth(effectiveEnd);

  return differenceInMonths(endMonth, startMonth) + 1;
};

/**
 * Calculate the total value for an item in a given period
 * For monthly items, multiplies by the actual number of months active in the period
 */
export const calculateItemPeriodValue = (
  item: FinancialItem,
  period: TimePeriod
): number => {
  if (!isItemActiveInPeriod(item, period)) {
    return 0;
  }

  // Monthly items: multiply by actual number of months active in period
  if (item.frequency === "monthly") {
    const activeMonths = calculateActiveMonthsInPeriod(item, period);
    return item.value * activeMonths;
  }

  // One-time and yearly items: use value as-is
  return item.value;
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};
