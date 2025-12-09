import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "../TimelineColumn";
import { calculateItemPeriodValue } from "./dateHelpers";
import { isItemActiveInPeriod } from "./dateHelpers"; // if not already in scope

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
  // Skip inactive periods
  if (!isItemActiveInPeriod(item, period)) return 0;

  // Base period value (handles monthly active-month math)
  const base = calculateItemPeriodValue(item, period);

  // Normalize by view mode
  if (item.frequency === "yearly") {
    // Spread yearly across the displayed period
    return viewMode === "quarter" ? base / 4 : base / 12;
  }

  // Monthly + one_time use the base; base already respects period length
  return base;
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
