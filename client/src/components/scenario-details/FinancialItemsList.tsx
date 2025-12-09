import React, { useMemo } from "react";
import { format } from "date-fns";
import { type FinancialItem } from "@/api/scenario";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";
import {
  groupItemsByCategory,
  calculateAnalytics,
} from "./helpers/financialItemsHelpers";
import { type TimePeriod } from "./TimelineColumn";
import { indexToDate } from "./helpers/dateHelpers";
import { Separator } from "../ui/separator";

type FinancialItemsListProps = {
  items: FinancialItem[];
  groupMode: "group" | "ungroup";
  periods: TimePeriod[];
};

export const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  items,
  groupMode,
  periods,
}) => {
  // Group items by category if groupMode is "group"
  const groupedItems = useMemo(() => {
    if (groupMode === "ungroup") {
      return null; // No grouping needed
    }
    return groupItemsByCategory(items);
  }, [items, groupMode]);

  // Analytics Calculations - period-aware
  const analytics = useMemo(() => calculateAnalytics(), [periods]);

  const getItemDisplayValue = (item: FinancialItem): number => {
    return item.value; // display stored (annualized) value directly
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/50">
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9 pl-6">
          Title
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Category
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Type
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9 text-right">
          Value
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          {groupMode === "group" ? "Count" : "Starts At"}
        </TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderCategoryRow = (
    category: string,
    totals: { revenue: number; cost: number },
    itemCount: number
  ) => {
    const hasRevenue = totals.revenue > 0;
    const hasCost = totals.cost > 0;
    const type =
      hasRevenue && hasCost ? "Mixed" : hasRevenue ? "revenue" : "cost";

    return (
      <TableRow
        key={category}
        className="border-zinc-800/50 hover:bg-zinc-800/30 group transition-colors"
      >
        <TableCell className="text-zinc-300 text-xs py-3 font-medium pl-6">
          {category}
        </TableCell>
        <TableCell className="py-3">
          <span className="inline-block text-[10px] text-zinc-400 uppercase tracking-wider border border-zinc-800 px-1.5 py-0.5 bg-zinc-900">
            {category}
          </span>
        </TableCell>
        <TableCell className="py-3">
          <span
            className={cn(
              "text-[9px] uppercase tracking-wider px-1.5 py-0.5 border",
              // Use neutral for mixed, specific for others but maybe less intense
              type === "Mixed"
                ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                : type === "revenue"
                ? "bg-emerald-500/10 text-emerald-500/70 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500/70 border-rose-500/20"
            )}
          >
            {type}
          </span>
        </TableCell>
        <TableCell className="text-right py-3">
          <div className="flex flex-col items-end gap-0.5">
            {hasRevenue && (
              <span className="font-mono text-xs text-emerald-400">
                +${totals.revenue.toLocaleString()}
              </span>
            )}
            {hasCost && (
              <span className="font-mono text-xs text-rose-400">
                -${totals.cost.toLocaleString()}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-zinc-500 text-xs font-mono py-3">
          {itemCount}
        </TableCell>
      </TableRow>
    );
  };

  const renderItemRow = (item: FinancialItem) => {
    const displayValue = getItemDisplayValue(item);
    return (
      <TableRow
        key={item.id}
        className="border-zinc-800/50 hover:bg-zinc-800/30 group transition-colors"
      >
        <TableCell className="text-zinc-300 text-xs py-3 font-medium pl-6">
          {item.title}
        </TableCell>
        <TableCell className="py-3">
          <span className="inline-block text-[10px] text-zinc-400 uppercase tracking-wider border border-zinc-800 px-1.5 py-0.5 bg-zinc-900">
            {item.category}
          </span>
        </TableCell>
        <TableCell className="py-3">
          <span
            className={cn(
              "text-[9px] uppercase tracking-wider px-1.5 py-0.5",
              item.type === "revenue"
                ? "bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500/70 border border-rose-500/20"
            )}
          >
            {item.type}
          </span>
        </TableCell>
        <TableCell className="text-right py-3">
          <span
            key={`${item.id}-${displayValue}`}
            className={cn(
              "font-mono text-xs inline-block animate-in fade-in zoom-in-95 duration-300",
              item.type === "revenue" ? "text-zinc-200" : "text-zinc-400"
            )}
          >
            ${displayValue.toLocaleString()}
          </span>
        </TableCell>
        <TableCell className="text-zinc-500 text-xs font-mono py-3">
          {format(indexToDate(item.startsAt), "MMM dd, yyyy")}
        </TableCell>
      </TableRow>
    );
  };

  const renderTableBody = () => {
    if (groupMode === "group" && groupedItems) {
      return (
        <TableBody>
          {Object.entries(groupedItems).map(([category, categoryItems]) => {
            const totals = analytics.categoryTotals[category] || {
              revenue: 0,
              cost: 0,
            };
            return renderCategoryRow(category, totals, categoryItems.length);
          })}
        </TableBody>
      );
    }

    return <TableBody>{items.map((item) => renderItemRow(item))}</TableBody>;
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* List Section - 60% */}
      <div className="w-[60%] h-full flex flex-col border-r border-zinc-800 bg-zinc-950/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
          <Table>
            {renderTableHeader()}
            {renderTableBody()}
          </Table>
        </div>
      </div>

      {/* Analytics Section - 40% */}
      <div className="w-[40%] h-full bg-zinc-950 overflow-y-auto">
        <div className="px-3 py-2.5">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            Financial Overview
          </h3>
        </div>

        <Separator className="w-full bg-zinc-800" />

        <div className="p-3">{/* Future content goes here */}</div>
      </div>
    </div>
  );
};
