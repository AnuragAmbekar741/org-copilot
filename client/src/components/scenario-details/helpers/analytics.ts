import { type FinancialItem } from "@/api/scenario";

export const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-rose-500",
];

export const getMonthlyValue = (
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

// Check if item is active in a specific period index
const isActiveInPeriod = (
  item: FinancialItem,
  periodIndex: number
): boolean => {
  // startsAt is 1-based (1 = first month), periodIndex is 0-based (0 = first month)
  // Convert startsAt to 0-based for comparison: startsAt - 1
  const itemStartPeriod = item.startsAt - 1;

  // Item hasn't started yet
  if (itemStartPeriod > periodIndex) return false;

  // endsAt of 0 or null/undefined means "no end date" (ongoing)
  // Only check endsAt if it's a positive number greater than startsAt
  const hasValidEndDate =
    item.endsAt !== undefined &&
    item.endsAt !== null &&
    item.endsAt > 0 &&
    item.endsAt >= item.startsAt;

  // Item has ended before this period
  if (hasValidEndDate) {
    if (!item.endsAt) return false;
    const itemEndPeriod = item.endsAt - 1; // Convert to 0-based
    if (itemEndPeriod < periodIndex) return false;
  }

  return true;
};

// Calculate analytics for a single period
export const calculatePeriodAnalytics = (
  items: FinancialItem[],
  periodIndex: number,
  timelineLength: number
) => {
  let periodRevenue = 0;
  let periodCost = 0;

  items.forEach((item) => {
    if (!isActiveInPeriod(item, periodIndex)) return;

    const monthlyValue = getMonthlyValue(item, timelineLength);
    if (item.type === "revenue") {
      periodRevenue += monthlyValue;
    } else {
      periodCost += monthlyValue;
    }
  });

  return {
    revenue: periodRevenue,
    cost: periodCost,
    net: periodRevenue - periodCost,
  };
};

// Calculate cumulative analytics up to and including a period
export const calculateCumulativeAnalytics = (
  items: FinancialItem[],
  periodIndex: number,
  timelineLength: number
) => {
  let cumulativeRevenue = 0;
  let cumulativeCost = 0;
  let carryForward = 0;

  // Calculate all periods up to and including current
  for (let i = 0; i <= periodIndex; i++) {
    const period = calculatePeriodAnalytics(items, i, timelineLength);
    cumulativeRevenue += period.revenue;
    cumulativeCost += period.cost;
  }

  carryForward = cumulativeRevenue - cumulativeCost;

  // Get current period's values
  const currentPeriod = calculatePeriodAnalytics(
    items,
    periodIndex,
    timelineLength
  );

  return {
    // Current period values
    periodRevenue: currentPeriod.revenue,
    periodCost: currentPeriod.cost,
    periodNet: currentPeriod.net,
    // Cumulative values
    cumulativeRevenue,
    cumulativeCost,
    carryForward, // This is the running balance
  };
};

// Existing calculateAnalytics for overall totals (used by List view)
export const calculateAnalytics = (
  items: FinancialItem[],
  timelineLength: number
) => {
  let totalRevenue = 0;
  let totalCost = 0;
  const costByCategory: Record<string, number> = {};
  const revenueByCategory: Record<string, number> = {};

  items.forEach((item) => {
    const monthlyValue = getMonthlyValue(item, timelineLength);
    if (item.type === "revenue") {
      totalRevenue += monthlyValue;
      revenueByCategory[item.category] =
        (revenueByCategory[item.category] || 0) + monthlyValue;
    } else {
      totalCost += monthlyValue;
      costByCategory[item.category] =
        (costByCategory[item.category] || 0) + monthlyValue;
    }
  });

  const formatCategories = (
    categories: Record<string, number>,
    total: number
  ) =>
    Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([category, value], index) => ({
        name: category,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[index % COLORS.length],
      }));

  const burnRate = totalCost - totalRevenue;
  const burnRatePercent =
    totalRevenue > 0 ? (totalCost / totalRevenue) * 100 : 0;
  const runway = burnRate > 0 ? Math.floor(totalRevenue / burnRate) : Infinity;

  return {
    totalRevenue,
    totalCost,
    burnRate,
    runway,
    burnRatePercent,
    costByCategory: formatCategories(costByCategory, totalCost),
    revenueByCategory: formatCategories(revenueByCategory, totalRevenue),
  };
};

// Calculate monthly data for the entire timeline (for charts)
export const calculateTimelineData = (
  items: FinancialItem[],
  timelineLength: number
) => {
  const data: {
    month: number;
    label: string;
    revenue: number;
    cost: number;
    net: number;
    cumulativeNet: number;
  }[] = [];

  let cumulativeNet = 0;

  for (let i = 0; i < timelineLength; i++) {
    const periodAnalytics = calculatePeriodAnalytics(items, i, timelineLength);
    cumulativeNet += periodAnalytics.net;

    data.push({
      month: i,
      label: `M${i + 1}`,
      revenue: Math.round(periodAnalytics.revenue),
      cost: Math.round(periodAnalytics.cost),
      net: Math.round(periodAnalytics.net),
      cumulativeNet: Math.round(cumulativeNet),
    });
  }

  return data;
};
