import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { type FinancialItem } from "@/api/scenario";
import { useScenario } from "@/hooks/useScenario";
import { TimelineColumn } from "@/components/scenario-details/TimelineColumn";
import { type TimePeriod } from "@/components/scenario-details/TimelineColumn";
import { generateMonthlyPeriods } from "@/components/scenario-details/helpers/monthlyView";
import { generateQuarterlyPeriods } from "@/components/scenario-details/helpers/quarterlyView";
import {
  shouldDisplayItem,
  isItemActiveInPeriod,
  formatDateForApi,
  calculateItemPeriodValue,
} from "@/components/scenario-details/helpers/dateHelpers";
import { ToggleButtonGroup } from "@/components/scenario-details/ToggleButtonGroup";
import { FinancialItemsList } from "@/components/scenario-details/FinancialItemsList";
import { AddRevenueModal } from "@/components/modal/AddRevenueModal";
import { useCreateFinancialItem } from "@/hooks/useScenario";
import { AppButton } from "@/components/wrappers/app-button";
import { cn } from "@/utils/cn";

const ScenarioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenarioResponse, isLoading, error } = useScenario(id);
  const [viewMode, setViewMode] = useState<"month" | "quarter">("month");
  const [viewType, setViewType] = useState<"pipeline" | "list">("pipeline");
  const [groupMode, setGroupMode] = useState<"group" | "ungroup">("ungroup");
  const [draggedItem, setDraggedItem] = useState<FinancialItem | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<{
    category: string;
    items: FinancialItem[];
  } | null>(null);
  const [itemModifications, setItemModifications] = useState<
    Record<string, Partial<FinancialItem>>
  >({});

  const [isAddRevenueOpen, setIsAddRevenueOpen] = useState(false);
  const { mutateAsync: createFinancialItem, isPending: isCreatingItem } =
    useCreateFinancialItem(id || "");

  // Derive base items from API response using useMemo
  const baseItems = useMemo(() => {
    if (!scenarioResponse?.data?.financialItems) return [];

    return (scenarioResponse.data.financialItems as FinancialItem[]).map(
      (item, index) => ({
        ...item,
        id: item.id || `item-${index}`,
        value: Number(item.value),
      })
    ) as FinancialItem[];
  }, [scenarioResponse?.data?.financialItems]);

  // Merge base items with local modifications
  const items = useMemo(() => {
    return baseItems.map((item) => ({
      ...item,
      ...(itemModifications[item.id || ""] || {}),
    }));
  }, [baseItems, itemModifications]);

  // Derive start date from base items using useMemo
  const startDate = useMemo(() => {
    if (baseItems.length > 0) {
      const dates = baseItems
        .map((item) => new Date(item.startsAt))
        .filter((d) => !isNaN(d.getTime()));
      if (dates.length > 0) {
        return new Date(Math.min(...dates.map((d) => d.getTime())));
      }
    }
    return new Date();
  }, [baseItems]);

  // Generate time periods based on view mode and start date
  const timePeriods = useMemo(() => {
    if (viewMode === "month") {
      return generateMonthlyPeriods(startDate, 12);
    } else {
      return generateQuarterlyPeriods(startDate, 4);
    }
  }, [startDate, viewMode]);

  // Calculate overall totals across all periods
  const overallTotals = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;

    timePeriods.forEach((period) => {
      items.forEach((item) => {
        const periodValue = calculateItemPeriodValue(item, period);
        if (item.type === "revenue") {
          totalRevenue += periodValue;
        } else {
          totalCost += periodValue;
        }
      });
    });

    return {
      revenue: totalRevenue,
      cost: totalCost,
      net: totalRevenue - totalCost,
    };
  }, [items, timePeriods]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, item: FinancialItem) => {
    setDraggedItem(item);
    setDraggedCategory(null);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleCategoryDragStart = (
    e: React.DragEvent,
    category: string,
    items: FinancialItem[]
  ) => {
    setDraggedCategory({ category, items });
    setDraggedItem(null);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedItem(null);
    setDraggedCategory(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPeriod: TimePeriod) => {
    e.preventDefault();
    e.stopPropagation();

    // Format the target period's start date as YYYY-MM-DD
    const formattedDate = formatDateForApi(targetPeriod.startDate);

    // Handle category drag (all items in category)
    if (draggedCategory) {
      setItemModifications((prev) => {
        const updates: Record<string, Partial<FinancialItem>> = {};
        draggedCategory.items.forEach((item) => {
          updates[item.id || ""] = {
            startsAt: formattedDate,
          };
        });
        return { ...prev, ...updates };
      });
      setDraggedCategory(null);
      return;
    }

    // Handle single item drag
    if (draggedItem) {
      setItemModifications((prev) => ({
        ...prev,
        [draggedItem.id || ""]: {
          startsAt: formattedDate,
        },
      }));
      setDraggedItem(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error || !scenarioResponse?.success || !scenarioResponse?.data) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            {error instanceof Error ? error.message : "Failed to load scenario"}
          </p>
        </div>
      </div>
    );
  }

  const scenario = scenarioResponse.data;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-light text-white tracking-wide">
            {scenario.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* View Type Toggle - List/Pipeline */}
          <ToggleButtonGroup
            options={[
              { value: "pipeline", label: "Pipeline" },
              { value: "list", label: "List" },
            ]}
            value={viewType}
            onChange={setViewType}
          />

          {/* Group Mode Toggle */}
          <ToggleButtonGroup
            options={[
              { value: "group", label: "Group" },
              { value: "ungroup", label: "Ungroup" },
            ]}
            value={groupMode}
            onChange={setGroupMode}
          />

          {/* View Mode Toggle - Month/Quarter */}
          <ToggleButtonGroup
            options={[
              { value: "month", label: "Month" },
              { value: "quarter", label: "Quarter" },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />

          {/* Add Revenue Button */}
          <AppButton
            variant="default"
            label="Add Revenue"
            icon={Plus}
            onClick={() => setIsAddRevenueOpen(true)}
          />
        </div>
      </div>

      {/* Pipeline Board - Horizontal Scroll */}
      {viewType === "pipeline" && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 w-full no-scrollbar">
          <div className="flex h-full w-full hide-scrollbar">
            {/* Summary Column - First */}
            <div className="flex flex-col h-full border-r border-zinc-800 bg-zinc-900/60 flex-1 min-w-[280px] flex-shrink-0">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-white tracking-wide uppercase">
                    Summary
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Total Revenue</span>
                    <span className="font-mono text-emerald-500/70">
                      ${overallTotals.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Total Cost</span>
                    <span className="font-mono text-rose-500/70">
                      ${overallTotals.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-500 text-xs font-medium">
                      Net
                    </span>
                    <span
                      className={cn(
                        "font-mono text-sm font-medium",
                        overallTotals.net >= 0
                          ? "text-emerald-500/70"
                          : "text-rose-500/70"
                      )}
                    >
                      ${overallTotals.net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-3">
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  Overall totals across all periods
                </div>
              </div>
            </div>

            {/* Time Period Columns */}
            {timePeriods.map((period) => (
              <TimelineColumn
                key={period.id}
                period={period}
                items={items}
                draggedItem={draggedItem}
                draggedCategory={draggedCategory}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onCategoryDragStart={handleCategoryDragStart}
                onDragEnd={handleDragEnd}
                shouldDisplayItem={shouldDisplayItem}
                isItemActiveInPeriod={isItemActiveInPeriod}
                groupMode={groupMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewType === "list" && (
        <div className="flex-1 overflow-hidden">
          <FinancialItemsList
            items={items}
            groupMode={groupMode}
            viewMode={viewMode}
            periods={timePeriods}
          />
        </div>
      )}

      <AddRevenueModal
        open={isAddRevenueOpen}
        onOpenChange={setIsAddRevenueOpen}
        onAdd={async (item) => {
          if (!id) return;
          const annualValue =
            item.frequency === "monthly"
              ? Number(item.value) * 12
              : Number(item.value);
          await createFinancialItem({ ...item, value: annualValue });
        }}
        isPending={isCreatingItem}
      />
    </div>
  );
};

export default ScenarioDetails;
