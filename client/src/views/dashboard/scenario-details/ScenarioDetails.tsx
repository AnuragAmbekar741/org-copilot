import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { type FinancialItem } from "@/api/scenario";
import {
  useScenario,
  useCreateFinancialItem,
  useUpdateFinancialItem,
  useDeleteFinancialItem,
} from "@/hooks/useScenario";
import { TimelineColumn } from "@/components/scenario-details/TimelineColumn";
import { type TimePeriod } from "@/components/scenario-details/TimelineColumn";
import { generateMonthlyPeriods } from "@/components/scenario-details/helpers/monthlyView";
import {
  shouldDisplayItem,
  isItemActiveInPeriod,
  indexToDate,
} from "@/components/scenario-details/helpers/dateHelpers";
import { ToggleButtonGroup } from "@/components/scenario-details/ToggleButtonGroup";
import { FinancialItemsList } from "@/components/scenario-details/FinancialItemsList";
import { AddRevenueModal } from "@/components/modal/AddRevenueModal";
import { AppButton } from "@/components/wrappers/app-button";
import { differenceInMonths, startOfMonth } from "date-fns";
import { toast } from "sonner";
import { PipelineSkeleton } from "@/components/scenario-details/PipelineSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ScenarioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenarioResponse, isLoading, error } = useScenario(id);
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
  const [loadingItemIds, setLoadingItemIds] = useState<Set<string>>(new Set());
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null
  );

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { mutateAsync: createFinancialItem, isPending: isCreatingItem } =
    useCreateFinancialItem(id || "");
  const { mutateAsync: updateFinancialItem } = useUpdateFinancialItem(id || "");
  const { mutateAsync: deleteFinancialItem } = useDeleteFinancialItem(id || "");

  // Derive base items from API response using useMemo
  const baseItems = useMemo(() => {
    if (!scenarioResponse?.data?.financialItems) return [];

    return (scenarioResponse.data.financialItems as FinancialItem[]).map(
      (item, index) => ({
        ...item,
        id: item.id || `item-${index}`,
        value: Number(item.value),
        startsAt: Number(item.startsAt),
        endsAt:
          item.endsAt === null || item.endsAt === undefined
            ? undefined
            : Number(item.endsAt),
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
      const minIndex = Math.min(...baseItems.map((item) => item.startsAt || 0));
      return indexToDate(minIndex);
    }
    return new Date();
  }, [baseItems]);

  // Generate time periods based on view mode and start date
  const timePeriods = useMemo(() => {
    const count = Number(scenarioResponse?.data?.timelineLength ?? 12);
    return generateMonthlyPeriods(startDate, count);
  }, [startDate, scenarioResponse]);

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

  const handleDrop = async (e: React.DragEvent, targetPeriod: TimePeriod) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate targetIndex relative to the scenario's startDate (not current month)
    const targetIndex = differenceInMonths(
      startOfMonth(targetPeriod.startDate),
      startOfMonth(startDate) // Use scenario's startDate, not new Date()
    );

    // Convert 0-based period index to 1-based startsAt
    const newStartsAt = targetIndex + 1;

    // Handle category drag (all items in category)
    if (draggedCategory) {
      const itemIds = draggedCategory.items
        .map((item) => item.id || "")
        .filter(Boolean);

      // Set loading state
      setLoadingItemIds(new Set(itemIds));

      // Update local state optimistically
      setItemModifications((prev) => {
        const updates: Record<string, Partial<FinancialItem>> = {};
        draggedCategory.items.forEach((item) => {
          updates[item.id || ""] = {
            startsAt: newStartsAt,
          };
        });
        return { ...prev, ...updates };
      });

      setDraggedCategory(null);

      // Update all items via API
      try {
        await Promise.all(
          draggedCategory.items.map((item) => {
            if (!item.id) return Promise.resolve();
            return updateFinancialItem({
              itemId: item.id,
              payload: { startsAt: newStartsAt },
            });
          })
        );
      } catch {
        toast.error("Failed to update items");
        // Revert optimistic update on error
        setItemModifications((prev) => {
          const reverted = { ...prev };
          draggedCategory.items.forEach((item) => {
            delete reverted[item.id || ""];
          });
          return reverted;
        });
      } finally {
        setLoadingItemIds(new Set());
      }
      return;
    }

    // Handle single item drag
    if (draggedItem && draggedItem.id) {
      const itemId = draggedItem.id;

      // Set loading state
      setLoadingItemIds(new Set([itemId]));

      // Update local state optimistically
      setItemModifications((prev) => ({
        ...prev,
        [itemId]: {
          startsAt: newStartsAt,
        },
      }));

      setDraggedItem(null);

      // Update via API
      try {
        await updateFinancialItem({
          itemId,
          payload: { startsAt: newStartsAt },
        });
      } catch {
        toast.error("Failed to update item");
        // Revert optimistic update on error
        setItemModifications((prev) => {
          const reverted = { ...prev };
          delete reverted[itemId];
          return reverted;
        });
      } finally {
        setLoadingItemIds(new Set());
      }
    }
  };

  const handleUpdateItem = async (
    itemId: string,
    payload: Partial<FinancialItem>
  ) => {
    await updateFinancialItem({ itemId, payload });
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteFinancialItem(itemId);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Top Bar Skeleton */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 bg-zinc-800" />
            <Skeleton className="h-8 w-24 bg-zinc-800" />
          </div>
          <Skeleton className="h-9 w-32 bg-zinc-800" />
        </div>

        {/* Pipeline Skeleton */}
        <PipelineSkeleton />
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

  // const scenario = scenarioResponse.data;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0">
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
        </div>

        <div className="flex items-center gap-4">
          {/* Financial Item Button */}
          <AppButton
            variant="default"
            label="Financial Item"
            icon={Plus}
            onClick={() => setIsAddItemOpen(true)}
          />
        </div>
      </div>

      {/* Pipeline Board - with Horizontal Analytics */}
      {viewType === "pipeline" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Horizontal Analytics Bar */}
          <div className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950">
            {/* Selected Period Indicator */}
            {selectedPeriodIndex !== null && (
              <div className="px-6 py-1.5 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  {timePeriods[selectedPeriodIndex]?.label}
                </span>
                <button
                  onClick={() => setSelectedPeriodIndex(null)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-stretch divide-x divide-zinc-800">
              {/* Revenue */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {selectedPeriodIndex !== null ? "Period Revenue" : "Revenue"}
                </p>
                <p className="text-lg font-mono text-emerald-400 mt-0.5">
                  $
                  {(() => {
                    const timelineLength =
                      scenarioResponse?.data?.timelineLength ?? 12;
                    const filterActive = (i: FinancialItem) => {
                      if (selectedPeriodIndex === null) return true;
                      const start = (i.startsAt ?? 1) - 1;
                      const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                      return (
                        selectedPeriodIndex >= start &&
                        selectedPeriodIndex <= end
                      );
                    };
                    return items
                      .filter(
                        (i) => i.type === "revenue" && i.category !== "Funding"
                      )
                      .filter(filterActive)
                      .reduce((sum, i) => {
                        const val = Number(i.value);
                        if (i.frequency === "monthly") return sum + val;
                        if (i.frequency === "yearly") return sum + val / 12;
                        return sum + val / timelineLength;
                      }, 0);
                  })().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Funding */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {selectedPeriodIndex !== null ? "Period Funding" : "Funding"}
                </p>
                <p className="text-lg font-mono text-violet-400 mt-0.5">
                  $
                  {(() => {
                    const timelineLength =
                      scenarioResponse?.data?.timelineLength ?? 12;
                    const filterActive = (i: FinancialItem) => {
                      if (selectedPeriodIndex === null) return true;
                      const start = (i.startsAt ?? 1) - 1;
                      const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                      return (
                        selectedPeriodIndex >= start &&
                        selectedPeriodIndex <= end
                      );
                    };
                    return items
                      .filter(
                        (i) => i.type === "revenue" && i.category === "Funding"
                      )
                      .filter(filterActive)
                      .reduce((sum, i) => {
                        const val = Number(i.value);
                        if (i.frequency === "monthly") return sum + val;
                        if (i.frequency === "yearly") return sum + val / 12;
                        return sum + val / timelineLength;
                      }, 0);
                  })().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Cost */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {selectedPeriodIndex !== null
                    ? "Period Cost"
                    : "Monthly Cost"}
                </p>
                <p className="text-lg font-mono text-rose-400 mt-0.5">
                  $
                  {(() => {
                    const timelineLength =
                      scenarioResponse?.data?.timelineLength ?? 12;
                    const filterActive = (i: FinancialItem) => {
                      if (selectedPeriodIndex === null) return true;
                      const start = (i.startsAt ?? 1) - 1;
                      const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                      return (
                        selectedPeriodIndex >= start &&
                        selectedPeriodIndex <= end
                      );
                    };
                    return items
                      .filter((i) => i.type === "cost")
                      .filter(filterActive)
                      .reduce((sum, i) => {
                        const val = Number(i.value);
                        if (i.frequency === "monthly") return sum + val;
                        if (i.frequency === "yearly") return sum + val / 12;
                        return sum + val / timelineLength;
                      }, 0);
                  })().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Burn Rate */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  Burn Rate
                </p>
                {(() => {
                  const timelineLength =
                    scenarioResponse?.data?.timelineLength ?? 12;
                  const filterActive = (i: FinancialItem) => {
                    if (selectedPeriodIndex === null) return true;
                    const start = (i.startsAt ?? 1) - 1;
                    const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                    return (
                      selectedPeriodIndex >= start && selectedPeriodIndex <= end
                    );
                  };
                  // Operational revenue only (exclude funding)
                  const operationalRevenue = items
                    .filter(
                      (i) => i.type === "revenue" && i.category !== "Funding"
                    )
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  const cost = items
                    .filter((i) => i.type === "cost")
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  // Burn rate = Cost - Operational Revenue
                  const burnRate = cost - operationalRevenue;
                  const burnPercent =
                    operationalRevenue > 0
                      ? (cost / operationalRevenue) * 100
                      : 0;
                  return (
                    <div>
                      <p
                        className={`text-lg font-mono mt-0.5 ${
                          burnPercent > 100
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {burnPercent.toFixed(0)}%
                      </p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">
                        ${burnRate >= 0 ? "+" : ""}
                        {burnRate.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                        /mo
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Funding Usage */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {selectedPeriodIndex !== null
                    ? "Period Funding Usage"
                    : "Funding Usage"}
                </p>
                {(() => {
                  const timelineLength =
                    scenarioResponse?.data?.timelineLength ?? 12;
                  const filterActive = (i: FinancialItem) => {
                    if (selectedPeriodIndex === null) return true;
                    const start = (i.startsAt ?? 1) - 1;
                    const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                    return (
                      selectedPeriodIndex >= start && selectedPeriodIndex <= end
                    );
                  };
                  // Operational revenue only (exclude funding)
                  const operationalRevenue = items
                    .filter(
                      (i) => i.type === "revenue" && i.category !== "Funding"
                    )
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  const cost = items
                    .filter((i) => i.type === "cost")
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  // Funding usage = Cost - Operational Revenue (how much funding is being consumed)
                  const fundingUsage = cost - operationalRevenue;

                  // Total funding available
                  const totalFunding = items
                    .filter(
                      (i) => i.type === "revenue" && i.category === "Funding"
                    )
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);

                  return (
                    <div>
                      <p className="text-lg font-mono text-violet-400 mt-0.5">
                        ${fundingUsage >= 0 ? "" : ""}
                        {fundingUsage.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      {totalFunding > 0 && fundingUsage > 0 && (
                        <p className="text-[9px] text-zinc-500 mt-0.5">
                          {((fundingUsage / totalFunding) * 100).toFixed(1)}% of
                          funding
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Net Cash Flow */}
              <div className="flex-1 px-6 py-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {selectedPeriodIndex !== null ? "Period Net" : "Net Monthly"}
                </p>
                {(() => {
                  const timelineLength =
                    scenarioResponse?.data?.timelineLength ?? 12;
                  const filterActive = (i: FinancialItem) => {
                    if (selectedPeriodIndex === null) return true;
                    const start = (i.startsAt ?? 1) - 1;
                    const end = i.endsAt ? i.endsAt - 1 : timelineLength - 1;
                    return (
                      selectedPeriodIndex >= start && selectedPeriodIndex <= end
                    );
                  };
                  const revenue = items
                    .filter((i) => i.type === "revenue")
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  const cost = items
                    .filter((i) => i.type === "cost")
                    .filter(filterActive)
                    .reduce((sum, i) => {
                      const val = Number(i.value);
                      if (i.frequency === "monthly") return sum + val;
                      if (i.frequency === "yearly") return sum + val / 12;
                      return sum + val / timelineLength;
                    }, 0);
                  const net = revenue - cost;
                  return (
                    <p
                      className={`text-lg font-mono mt-0.5 ${
                        net >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {net >= 0 ? "+" : ""}$
                      {net.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Timeline Columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 w-full no-scrollbar">
            <div className="flex h-full w-full hide-scrollbar">
              {timePeriods.map((period, index) => (
                <TimelineColumn
                  key={period.id}
                  period={period}
                  periodIndex={index}
                  items={items}
                  timelineLength={scenarioResponse?.data?.timelineLength ?? 12}
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
                  loadingItemIds={loadingItemIds}
                  isSelected={selectedPeriodIndex === index}
                  onSelect={() =>
                    setSelectedPeriodIndex(
                      selectedPeriodIndex === index ? null : index
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewType === "list" && (
        <div className="flex-1 overflow-hidden">
          <FinancialItemsList
            items={items}
            groupMode={groupMode}
            periods={timePeriods}
            timelineLength={scenarioResponse?.data?.timelineLength ?? 12}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </div>
      )}

      <AddRevenueModal
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
        onAdd={async (item) => {
          if (!id) return;
          const annualValue = Number(item.value);
          await createFinancialItem({ ...item, value: annualValue });
        }}
        isPending={isCreatingItem}
      />
    </div>
  );
};

export default ScenarioDetails;
