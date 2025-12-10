import { addMonths, startOfMonth } from "date-fns";
import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "../TimelineColumn";

// Use a consistent base date function that can be reused
export const getBaseDate = () => startOfMonth(new Date());

export const indexToDate = (index: number, baseDate?: Date) => {
  const base = baseDate ?? getBaseDate();
  return addMonths(base, index);
};

// Only used for item placement/display in pipeline
export const shouldDisplayItem = (
  item: FinancialItem,
  period: TimePeriod
): boolean => {
  // Use the period's start date as the base for consistency
  const periodIndex = Math.round(
    (period.startDate.getTime() - getBaseDate().getTime()) /
      (30 * 24 * 60 * 60 * 1000)
  );
  return (
    item.startsAt === periodIndex ||
    (period.startDate <= indexToDate(item.startsAt) &&
      indexToDate(item.startsAt) <= period.endDate)
  );
};

// Check if item is active in period using index comparison
export const isItemActiveInPeriod = (
  item: FinancialItem,
  period: TimePeriod,
  periodIndex: number
): boolean => {
  // startsAt is 1-based (1 = first month), periodIndex is 0-based (0 = first month)
  // Convert startsAt to 0-based for comparison
  const itemStartPeriod = item.startsAt - 1;
  const itemEnd = item.endsAt;

  // Item hasn't started yet
  if (itemStartPeriod > periodIndex) return false;

  // Item has ended before this period
  if (itemEnd !== undefined && itemEnd !== null && itemEnd > 0) {
    const itemEndPeriod = itemEnd - 1; // Convert to 0-based
    if (itemEndPeriod < periodIndex) return false;
  }

  return true;
};
