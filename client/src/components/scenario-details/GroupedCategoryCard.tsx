import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { type FinancialItem } from "@/api/scenario";
import { type TimePeriod } from "./TimelineColumn";

type GroupedCategoryCardProps = {
  category: string;
  items: FinancialItem[];
  period: TimePeriod;
  onDragStart: (
    e: React.DragEvent,
    category: string,
    items: FinancialItem[]
  ) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragged?: boolean;
};

export const GroupedCategoryCard: React.FC<GroupedCategoryCardProps> = ({
  category,
  items,
  period,
  onDragStart,
  onDragEnd,
  isDragged = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, category, items);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd(e);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  return (
    <div
      draggable={items.length > 0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "group relative bg-zinc-950 border border-zinc-800 p-3 cursor-move transition-all duration-200",
        "hover:shadow-lg active:scale-[0.98]",
        isDragged && "opacity-50",
        "hover:border-zinc-700"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs text-zinc-200 font-medium leading-tight truncate mb-1">
            {category}
          </h4>
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        <GripVertical className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-900 space-y-1.5">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};
