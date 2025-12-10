import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
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

  const [isAddRevenueOpen, setIsAddRevenueOpen] = useState(false);
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
          {/* Add Revenue Button */}
          <AppButton
            variant="default"
            label="Financial Item"
            icon={Plus}
            onClick={() => setIsAddRevenueOpen(true)}
          />
        </div>
      </div>

      {/* Pipeline Board - Horizontal Scroll */}
      {viewType === "pipeline" && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 w-full no-scrollbar">
          <div className="flex h-full w-full hide-scrollbar">
            {/* Time Period Columns */}
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
            periods={timePeriods}
            timelineLength={scenarioResponse?.data?.timelineLength ?? 12}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
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
