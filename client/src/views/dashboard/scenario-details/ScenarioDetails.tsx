import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
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
} from "@/components/scenario-details/helpers/dateHelpers";

const ScenarioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenarioResponse, isLoading, error } = useScenario(id);
  const [viewMode, setViewMode] = useState<"month" | "quarter">("month");
  const [draggedItem, setDraggedItem] = useState<FinancialItem | null>(null);
  const [itemModifications, setItemModifications] = useState<
    Record<string, Partial<FinancialItem>>
  >({});

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

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, item: FinancialItem) => {
    setDraggedItem(item);
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPeriod: TimePeriod) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItem) return;

    // Format the target period's start date as YYYY-MM-DD
    const formattedDate = formatDateForApi(targetPeriod.startDate);

    // Update item modification instead of full items array
    setItemModifications((prev) => ({
      ...prev,
      [draggedItem.id || ""]: {
        startsAt: formattedDate,
      },
    }));
    setDraggedItem(null);
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
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-light text-white tracking-wide">
            {scenario.title}
          </h1>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            Timeline Pipeline
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-zinc-800 rounded-none">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                viewMode === "month"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("quarter")}
              className={cn(
                "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                viewMode === "quarter"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Quarter
            </button>
          </div>

          <div className="text-xs text-zinc-500">
            {scenario.updatedAt || scenario.createdAt
              ? new Date(
                  scenario.updatedAt || scenario.createdAt || new Date()
                ).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Pipeline Board - Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 w-full no-scrollbar">
        <div className="flex h-full w-full hide-scrollbar">
          {timePeriods.map((period) => (
            <TimelineColumn
              key={period.id}
              period={period}
              items={items}
              draggedItem={draggedItem}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              shouldDisplayItem={shouldDisplayItem}
              isItemActiveInPeriod={isItemActiveInPeriod}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetails;
