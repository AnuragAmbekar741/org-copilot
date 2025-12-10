import React, { useMemo } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { FinancialItemCard } from "./FinancialItemCard";
import { GroupedCategoryCard } from "./GroupedCategoryCard";
import { type FinancialItem } from "@/api/scenario";
import { calculateCumulativeAnalytics } from "./helpers/analytics";

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
  draggedCategory: { category: string; items: FinancialItem[] } | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, period: TimePeriod) => void;
  onDragStart: (e: React.DragEvent, item: FinancialItem) => void;
  onCategoryDragStart: (
    e: React.DragEvent,
    category: string,
    items: FinancialItem[]
  ) => void;
  onDragEnd: (e: React.DragEvent) => void;
  shouldDisplayItem: (item: FinancialItem, period: TimePeriod) => boolean;
  isItemActiveInPeriod: (
    item: FinancialItem,
    period: TimePeriod,
    periodIndex: number
  ) => boolean;
  groupMode: "group" | "ungroup";
  timelineLength: number;
  periodIndex: number;
  loadingItemIds?: Set<string>;
};

export const TimelineColumn: React.FC<TimelineColumnProps> = ({
  period,
  items,
  draggedItem,
  draggedCategory,
  onDragOver,
  onDrop,
  onDragStart,
  onCategoryDragStart,
  onDragEnd,
  shouldDisplayItem,
  groupMode,
  timelineLength,
  isItemActiveInPeriod,
  periodIndex,
  loadingItemIds = new Set(),
}) => {
  // Items to display as cards (only in their start period)
  const itemsToDisplay = items.filter((item) =>
    shouldDisplayItem(item, period)
  );

  // Group items by category if groupMode is "group"
  const groupedItems = useMemo(() => {
    if (groupMode === "ungroup") {
      return {
        revenue: itemsToDisplay.filter((item) => item.type === "revenue"),
        cost: itemsToDisplay.filter((item) => item.type === "cost"),
      };
    }

    // Group by category
    const revenueGroups: Record<string, FinancialItem[]> = {};
    const costGroups: Record<string, FinancialItem[]> = {};

    itemsToDisplay.forEach((item) => {
      const category = item.category || "Uncategorized";
      if (item.type === "revenue") {
        if (!revenueGroups[category]) {
          revenueGroups[category] = [];
        }
        revenueGroups[category].push(item);
      } else {
        if (!costGroups[category]) {
          costGroups[category] = [];
        }
        costGroups[category].push(item);
      }
    });

    return { revenue: revenueGroups, cost: costGroups };
  }, [itemsToDisplay, groupMode]);

  // NEW: Items active in this period for analytics
  const activeItems = useMemo(
    () =>
      items.filter((item) => isItemActiveInPeriod(item, period, periodIndex)),
    [items, period, periodIndex, isItemActiveInPeriod]
  );

  // NEW: Calculate analytics for this column
  const analytics = useMemo(
    () => calculateCumulativeAnalytics(items, periodIndex, timelineLength),
    [items, periodIndex, timelineLength]
  );

  const renderItems = (itemsToRender: FinancialItem[]) => {
    return itemsToRender.map((item) => (
      <FinancialItemCard
        key={item.id}
        item={item}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isLoading={loadingItemIds.has(item.id || "")}
      />
    ));
  };

  const renderGroupedItems = (groups: Record<string, FinancialItem[]>) => {
    return Object.entries(groups).map(([category, categoryItems]) => {
      const isDragged =
        draggedCategory?.category === category &&
        draggedCategory.items.length === categoryItems.length &&
        draggedCategory.items.every((item) =>
          categoryItems.some((ci) => ci.id === item.id)
        );

      const categoryLoadingIds = categoryItems
        .map((item) => item.id)
        .filter((id): id is string => Boolean(id))
        .filter((id) => loadingItemIds.has(id));

      return (
        <GroupedCategoryCard
          key={category}
          category={category}
          items={categoryItems}
          period={period}
          onDragStart={(e) => onCategoryDragStart(e, category, categoryItems)}
          onDragEnd={onDragEnd}
          isDragged={isDragged}
          isLoading={categoryLoadingIds.length > 0}
        />
      );
    });
  };

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
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-medium text-white tracking-wide uppercase">
              {period.label}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {activeItems.length} active
          </span>
        </div>

        {/* Analytics Summary - Revenue, Cost, Net, Carry Forward */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-600">Revenue</span>
            <span className="text-emerald-400 font-mono">
              $
              {analytics.periodRevenue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-600">Cost</span>
            <span className="text-rose-400 font-mono">
              $
              {analytics.periodCost.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-600">Net</span>
            <span
              className={cn(
                "font-mono",
                analytics.periodNet >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {analytics.periodNet >= 0 ? "+" : "-"}$
              {Math.abs(analytics.periodNet).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] border-t border-zinc-800 pt-1 mt-1">
            <span className="text-zinc-500">Balance</span>
            <span
              className={cn(
                "font-mono font-medium",
                analytics.carryForward >= 0
                  ? "text-emerald-300"
                  : "text-rose-300"
              )}
            >
              {analytics.carryForward >= 0 ? "" : "-"}$
              {Math.abs(analytics.carryForward).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Period Content */}
      <div
        className="flex-1 overflow-y-auto p-3 no-scrollbar space-y-2 min-h-0"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, period)}
      >
        {/* Revenue Items */}
        {groupMode === "group" &&
        typeof groupedItems.revenue === "object" &&
        !Array.isArray(groupedItems.revenue)
          ? renderGroupedItems(
              groupedItems.revenue as Record<string, FinancialItem[]>
            )
          : renderItems((groupedItems.revenue as FinancialItem[]) || [])}

        {/* Cost Items */}
        {groupMode === "group" &&
        typeof groupedItems.cost === "object" &&
        !Array.isArray(groupedItems.cost)
          ? renderGroupedItems(
              groupedItems.cost as Record<string, FinancialItem[]>
            )
          : renderItems((groupedItems.cost as FinancialItem[]) || [])}

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
