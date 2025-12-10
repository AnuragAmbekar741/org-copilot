import React from "react";
import { GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { type FinancialItem } from "@/api/scenario";

type FinancialItemCardProps = {
  item: FinancialItem;
  onDragStart: (e: React.DragEvent, item: FinancialItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isLoading?: boolean;
};

export const FinancialItemCard: React.FC<FinancialItemCardProps> = ({
  item,
  onDragStart,
  onDragEnd,
  isLoading = false,
}) => {
  const isRevenue = item.type === "revenue";

  const handleDragStart = (e: React.DragEvent) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    onDragStart(e, item);
  };

  return (
    <div
      draggable={!isLoading}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative bg-zinc-950 border border-zinc-800 p-3 transition-all duration-200",
        isLoading
          ? "cursor-wait opacity-60"
          : "cursor-move hover:shadow-lg active:scale-[0.98] hover:border-zinc-700"
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-10">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
        </div>
      )}

      <div className="flex justify-between items-start mb-1.5">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs text-zinc-200 font-medium leading-tight truncate">
            {item.title}
          </h4>
          <span className="inline-block text-[9px] text-zinc-500 uppercase tracking-wider border border-zinc-800 px-1 py-0.5 rounded-none bg-zinc-900 mt-1">
            {item.category}
          </span>
        </div>
        {!isLoading && (
          <GripVertical className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
        )}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900">
        <span className="text-[9px] text-zinc-500 uppercase">
          {item.frequency}
        </span>
        <span
          className={cn(
            "font-mono text-xs",
            isRevenue ? "text-zinc-200" : "text-zinc-400"
          )}
        >
          ${item.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
