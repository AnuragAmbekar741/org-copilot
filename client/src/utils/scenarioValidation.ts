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
  // startsAt is 1-based (1 = first month, 2 = second month, etc.)
  // periodIndex is 0-based (0 = first month, 1 = second month, etc.)
  // So we compare: startsAt - 1 <= periodIndex
  const itemStartPeriod = item.startsAt - 1;

  if (itemStartPeriod > periodIndex) return false;

  const hasValidEndDate =
    item.endsAt !== undefined &&
    item.endsAt !== null &&
    item.endsAt > 0 &&
    item.endsAt >= item.startsAt;

  if (hasValidEndDate) {
    const itemEndPeriod = item.endsAt! - 1; // Non-null assertion: we've already checked it's not null/undefined
    if (itemEndPeriod < periodIndex) return false;
  }

  return true;
};

export const validateScenarioViability = (
  items: FinancialItem[],
  timelineLength: number
): { isValid: boolean; error?: string } => {
  if (!items || items.length === 0) {
    return { isValid: true }; // Empty scenario is valid
  }

  // Find the earliest month with any activity (minimum startsAt)
  // startsAt is 1-based, so 1 = first month
  const earliestStartsAt = Math.min(...items.map((item) => item.startsAt || 1));

  // Convert to 0-based period index for validation
  const firstActivePeriod = earliestStartsAt - 1;

  // Calculate cash flow for the first active month
  let firstMonthRevenue = 0;
  let firstMonthCost = 0;
  let totalOneTimeRevenue = 0; // All one-time revenue (funding) available

  items.forEach((item) => {
    // Check if item is active in the first active period
    if (!isActiveInPeriod(item, firstActivePeriod)) return;

    if (item.type === "revenue") {
      if (item.frequency === "one_time") {
        // One-time revenue (like funding) is available immediately when it starts
        // If it starts in the first active month, it's available
        if (item.startsAt === earliestStartsAt) {
          totalOneTimeRevenue += item.value;
        }
      } else {
        // Monthly/yearly revenue
        firstMonthRevenue += getMonthlyValue(item, timelineLength);
      }
    } else {
      // Cost
      firstMonthCost += getMonthlyValue(item, timelineLength);
    }
  });

  // Total available cash in first active month
  const totalAvailable = firstMonthRevenue + totalOneTimeRevenue;

  if (totalAvailable < firstMonthCost) {
    const monthLabel =
      earliestStartsAt === 1 ? "first month" : `month ${earliestStartsAt}`;
    return {
      isValid: false,
      error: `Scenario is not viable: ${monthLabel} costs ($${firstMonthCost.toLocaleString()}) exceed available cash ($${totalAvailable.toLocaleString()}). You need at least $${(
        firstMonthCost - totalAvailable
      ).toLocaleString()} more in funding or revenue.`,
    };
  }

  return { isValid: true };
};
