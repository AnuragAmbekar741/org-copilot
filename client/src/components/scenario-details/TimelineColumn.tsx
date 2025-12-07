import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { FinancialItemCard } from "./FinancialItemCard";
import { type FinancialItem } from "@/api/scenario";
import { calculateItemPeriodValue } from "./helpers/dateHelpers";

export type TimePeriod = {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
};

type TimelineColumnProps = {
  period: TimePeriod;
  items: FinancialItem[];
  draggedItem: FinancialItem | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, period: TimePeriod) => void;
  onDragStart: (e: React.DragEvent, item: FinancialItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  shouldDisplayItem: (item: FinancialItem, period: TimePeriod) => boolean;
  isItemActiveInPeriod: (item: FinancialItem, period: TimePeriod) => boolean;
};

export const TimelineColumn: React.FC<TimelineColumnProps> = ({
  period,
  items,
  draggedItem,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  shouldDisplayItem,
}) => {
  // Items to display as cards (only in their start period)
  const itemsToDisplay = items.filter((item) =>
    shouldDisplayItem(item, period)
  );
  const revenueItemsToDisplay = itemsToDisplay.filter(
    (item) => item.type === "revenue"
  );
  const costItemsToDisplay = itemsToDisplay.filter(
    (item) => item.type === "cost"
  );

  // Calculate totals using period value calculation
  const totals = {
    revenue: items
      .filter((i) => i.type === "revenue")
      .reduce((sum, item) => sum + calculateItemPeriodValue(item, period), 0),
    cost: items
      .filter((i) => i.type === "cost")
      .reduce((sum, item) => sum + calculateItemPeriodValue(item, period), 0),
    net: 0,
  };
  totals.net = totals.revenue - totals.cost;

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r border-zinc-800 bg-zinc-900/50 flex-1 min-w-[280px]",
        draggedItem &&
          draggedItem.id !== period.id &&
          "bg-zinc-900/30 transition-colors"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, period)}
    >
      {/* Period Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-medium text-white tracking-wide uppercase">
              {period.label}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {itemsToDisplay.length}
          </span>
        </div>

        {/* Period Totals */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Revenue</span>
            <span className="font-mono text-emerald-400">
              ${totals.revenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Cost</span>
            <span className="font-mono text-rose-400">
              ${totals.cost.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
            <span className="text-zinc-500 text-xs font-medium">Net</span>
            <span
              className={cn(
                "font-mono text-sm font-medium",
                totals.net >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              ${totals.net.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Period Content */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, period)}
      >
        {/* Revenue Items */}
        {revenueItemsToDisplay.map((item) => (
          <FinancialItemCard
            key={item.id}
            item={item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {/* Cost Items */}
        {costItemsToDisplay.map((item) => (
          <FinancialItemCard
            key={item.id}
            item={item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {/* Empty State */}
        {itemsToDisplay.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-zinc-800 text-zinc-600 text-[10px] uppercase tracking-widest">
            No Items
          </div>
        )}
      </div>
    </div>
  );
};
