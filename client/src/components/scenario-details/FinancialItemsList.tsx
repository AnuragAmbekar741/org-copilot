import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
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

type FinancialItemsListProps = {
  items: FinancialItem[];
  groupMode: "group" | "ungroup";
  viewMode: "month" | "quarter";
  periods: TimePeriod[];
};

export const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  items,
  groupMode,
  periods,
  viewMode,
}) => {
  // Group items by category if groupMode is "group"
  const groupedItems = useMemo(() => {
    if (groupMode === "ungroup") {
      return null; // No grouping needed
    }
    return groupItemsByCategory(items);
  }, [items, groupMode]);

  // Analytics Calculations - period-aware
  const analytics = useMemo(
    () => calculateAnalytics(items, periods, viewMode),
    [items, periods, viewMode]
  );

  // Display value respects both view mode (month/quarter) and item frequency
  const getItemDisplayValue = (item: FinancialItem): number => {
    if (viewMode === "month") {
      if (item.frequency === "monthly") return item.value;
      else return Math.round(item.value / 12);
    }
    if (viewMode === "quarter") {
      if (item.frequency === "monthly") return item.value * 3;
      else return Math.round(item.value / 3);
    }
    return 0;
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
          {hasRevenue && hasCost ? (
            <div className="flex gap-1">
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20">
                Revenue
              </span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-rose-500/10 text-rose-500/70 border border-rose-500/20">
                Cost
              </span>
            </div>
          ) : (
            <span
              className={cn(
                "text-[9px] uppercase tracking-wider px-1.5 py-0.5",
                type === "revenue"
                  ? "bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500/70 border border-rose-500/20"
              )}
            >
              {type}
            </span>
          )}
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
            key={`${item.id}-${displayValue}-${viewMode}`} // key forces re-mount on change
            className={cn(
              "font-mono text-xs inline-block animate-in fade-in zoom-in-95 duration-300", // animation classes
              item.type === "revenue" ? "text-zinc-200" : "text-zinc-400"
            )}
          >
            ${displayValue.toLocaleString()}
          </span>
        </TableCell>
        <TableCell className="text-zinc-500 text-xs font-mono py-3">
          {format(parseISO(item.startsAt), "MMM dd, yyyy")}
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
      <div className="w-[40%] h-full bg-zinc-950 p-8 overflow-y-auto">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-8">
          Financial Overview
        </h3>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-zinc-900/20 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-mono text-emerald-400">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="p-5 bg-zinc-900/20 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              Total Burn
            </div>
            <div className="text-2xl font-mono text-rose-400">
              ${analytics.totalCost.toLocaleString()}
            </div>
          </div>
          <div className="col-span-2 p-5 bg-zinc-900/20 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              Net Flow
            </div>
            <div
              key={`net-${analytics.net}`}
              className={cn(
                "text-3xl font-mono inline-block animate-in fade-in slide-in-from-bottom-1 duration-300",
                analytics.net >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {analytics.net >= 0 ? "+" : ""}${analytics.net.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">
            Category Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(analytics.categoryTotals).map(([cat, totals]) => {
              const totalVal = totals.revenue + totals.cost;
              const revPct =
                totalVal > 0 ? (totals.revenue / totalVal) * 100 : 0;
              const costPct = totalVal > 0 ? (totals.cost / totalVal) * 100 : 0;

              return (
                <div
                  key={cat}
                  className="p-4 border border-zinc-800/50 bg-zinc-900/10 hover:bg-zinc-900/20 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-zinc-300 font-medium tracking-wide">
                      {cat}
                    </span>
                    <span
                      key={`${cat}-${totals.revenue - totals.cost}-${viewMode}`} // key forces re-mount on change
                      className={cn(
                        "text-xs font-mono inline-block animate-in fade-in zoom-in-95 duration-300", // animation classes
                        totals.revenue - totals.cost >= 0
                          ? "text-emerald-500/70"
                          : "text-rose-500/70"
                      )}
                    >
                      {totals.revenue - totals.cost >= 0 ? "+" : ""}$
                      {(totals.revenue - totals.cost).toLocaleString()}
                    </span>
                  </div>
                  {/* Visual Breakdown Bar */}
                  <div className="h-1.5 w-full bg-zinc-900 flex mb-2">
                    {totals.revenue > 0 && (
                      <div
                        className="h-full bg-emerald-500/40"
                        style={{ width: `${revPct}%` }}
                      />
                    )}
                    {totals.cost > 0 && (
                      <div
                        className="h-full bg-rose-500/40"
                        style={{ width: `${costPct}%` }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                    <span>In: ${totals.revenue.toLocaleString()}</span>
                    <span>Out: ${totals.cost.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
