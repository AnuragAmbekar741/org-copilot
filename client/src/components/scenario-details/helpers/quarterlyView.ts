import {
  startOfMonth,
  startOfQuarter,
  endOfQuarter,
  format,
  addMonths,
} from "date-fns";
import { type TimePeriod } from "../TimelineColumn";

export const generateQuarterlyPeriods = (
  startDate: Date,
  count: number = 4
): TimePeriod[] => {
  const periods: TimePeriod[] = [];
  const baseDate = startOfMonth(startDate);

  for (let i = 0; i < count * 3; i += 3) {
    const periodStart = startOfQuarter(addMonths(baseDate, i));
    const periodEnd = endOfQuarter(periodStart);

    periods.push({
      id: `quarter-${Math.floor(i / 3)}`,
      label: format(periodStart, "'Q'Q yyyy"),
      startDate: periodStart,
      endDate: periodEnd,
    });
  }

  return periods;
};
