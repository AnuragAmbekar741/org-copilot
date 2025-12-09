import { type FinancialItem } from "@/api/scenario";

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

// Totals/calculations removed per pipeline view requirement
export const calculateAnalytics = (): Analytics => {
  return {
    totalRevenue: 0,
    totalCost: 0,
    net: 0,
    categoryTotals: {},
  };
};
