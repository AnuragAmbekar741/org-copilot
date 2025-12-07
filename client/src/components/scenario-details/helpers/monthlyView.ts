import { startOfMonth, endOfMonth, format, addMonths } from "date-fns";
import { type TimePeriod } from "../TimelineColumn";

export const generateMonthlyPeriods = (
  startDate: Date,
  count: number = 12
): TimePeriod[] => {
  const periods: TimePeriod[] = [];
  const baseDate = startOfMonth(startDate);

  for (let i = 0; i < count; i++) {
    const periodStart = addMonths(baseDate, i);
    const periodEnd = endOfMonth(periodStart);

    periods.push({
      id: `month-${i}`,
      label: format(periodStart, "MMM yyyy"),
      startDate: periodStart,
      endDate: periodEnd,
    });
  }

  return periods;
};
