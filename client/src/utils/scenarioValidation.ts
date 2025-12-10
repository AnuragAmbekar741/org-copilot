import { type FinancialItem } from "@/api/scenario";

const getMonthlyValue = (
  item: FinancialItem,
  timelineLength: number
): number => {
  const value = Number(item.value);
  switch (item.frequency) {
    case "monthly":
      return value;
    case "yearly":
      return value / 12;
    case "one_time":
      return value / timelineLength;
    default:
      return value;
  }
};

const isActiveInPeriod = (
  item: FinancialItem,
  periodIndex: number
): boolean => {
  if (item.startsAt > periodIndex) return false;

  const hasValidEndDate =
    item.endsAt !== undefined &&
    item.endsAt !== null &&
    item.endsAt > 0 &&
    item.endsAt >= item.startsAt;

  if (hasValidEndDate && item.endsAt! < periodIndex) return false;

  return true;
};

export const validateScenarioViability = (
  items: FinancialItem[],
  timelineLength: number
): { isValid: boolean; error?: string } => {
  // Calculate first month (period 0) cash flow
  let firstMonthRevenue = 0;
  let firstMonthCost = 0;
  let totalOneTimeRevenue = 0; // All one-time revenue (funding) available in month 0

  items.forEach((item) => {
    if (!isActiveInPeriod(item, 0)) return;

    if (item.type === "revenue") {
      if (item.frequency === "one_time") {
        // One-time revenue (like funding) is available immediately
        totalOneTimeRevenue += item.value;
      } else {
        // Monthly/yearly revenue
        firstMonthRevenue += getMonthlyValue(item, timelineLength);
      }
    } else {
      // Cost
      firstMonthCost += getMonthlyValue(item, timelineLength);
    }
  });

  // Total available cash in first month
  const totalAvailable = firstMonthRevenue + totalOneTimeRevenue;

  if (totalAvailable < firstMonthCost) {
    return {
      isValid: false,
      error: `Scenario is not viable: First month costs ($${firstMonthCost.toLocaleString()}) exceed available cash ($${totalAvailable.toLocaleString()}). You need at least $${(
        firstMonthCost - totalAvailable
      ).toLocaleString()} more in funding or revenue.`,
    };
  }

  return { isValid: true };
};
