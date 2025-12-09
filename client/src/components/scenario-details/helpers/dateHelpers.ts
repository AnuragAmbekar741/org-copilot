import { addMonths, startOfMonth, isWithinInterval } from "date-fns";
import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "../TimelineColumn";

const baseDate = startOfMonth(new Date());
export const indexToDate = (index: number) => addMonths(baseDate, index);

// Only used for item placement/display in pipeline
export const shouldDisplayItem = (
  item: FinancialItem,
  period: TimePeriod
): boolean => {
  const itemStart = indexToDate(item.startsAt);
  return isWithinInterval(itemStart, {
    start: period.startDate,
    end: period.endDate,
  });
};

// Minimal active check for visibility
export const isItemActiveInPeriod = (
  item: FinancialItem,
  period: TimePeriod
): boolean => {
  const itemStart = indexToDate(item.startsAt);
  const itemEnd =
    item.endsAt !== undefined && item.endsAt !== null
      ? indexToDate(item.endsAt)
      : null;

  if (itemStart > period.endDate) return false;
  if (itemEnd && itemEnd < period.startDate) return false;
  return true;
};
