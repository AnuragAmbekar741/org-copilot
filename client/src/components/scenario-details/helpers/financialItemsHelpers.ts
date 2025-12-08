import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "../TimelineColumn";
import { calculateItemPeriodValue } from "./dateHelpers";

export type CategoryTotals = {
  revenue: number;
  cost: number;
};

export type Analytics = {
  totalRevenue: number;
  totalCost: number;
  net: number;
  categoryTotals: Record<string, CategoryTotals>;
};

/**
 * Group financial items by category
 */
export const groupItemsByCategory = (
  items: FinancialItem[]
): Record<string, FinancialItem[]> | null => {
  const groups: Record<string, FinancialItem[]> = {};
  items.forEach((item) => {
    const category = item.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
  });

  return groups;
};

/**
 * Calculate period value for an item based on view mode
 * For monthly items: monthly view = value (as-is), quarterly view = value * 3
 */
const getItemPeriodValue = (
  item: FinancialItem,
  period: TimePeriod,
  viewMode: "month" | "quarter"
): number => {
  // For monthly items, apply view mode specific calculation
  if (item.frequency === "monthly") {
    if (viewMode === "quarter") {
      return Math.floor(item.value * 3); // Quarterly amount (monthly * 3)
    }
    return Math.floor(item.value); // Monthly amount (use as-is)
  }

  // For other frequencies, use standard period calculation
  return calculateItemPeriodValue(item, period);
};

/**
 * Calculate analytics for financial items across all periods
 */
export const calculateAnalytics = (
  items: FinancialItem[],
  periods: TimePeriod[],
  viewMode: "month" | "quarter"
): Analytics => {
  let totalRevenue = 0;
  let totalCost = 0;
  const categoryTotals: Record<string, CategoryTotals> = {};

  // Calculate totals across all periods
  periods.forEach((period) => {
    items.forEach((item) => {
      const periodValue = getItemPeriodValue(item, period, viewMode);
      const cat = item.category || "Uncategorized";

      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { revenue: 0, cost: 0 };
      }

      if (item.type === "revenue") {
        totalRevenue += periodValue;
        categoryTotals[cat].revenue += periodValue;
      } else {
        totalCost += periodValue;
        categoryTotals[cat].cost += periodValue;
      }
    });
  });

  const net = totalRevenue - totalCost;

  return { totalRevenue, totalCost, net, categoryTotals };
};
