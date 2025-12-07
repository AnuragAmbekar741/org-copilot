import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { type FinancialItem } from "@/api/scenario";

type FinancialItemCardProps = {
  item: FinancialItem;
  onDragStart: (e: React.DragEvent, item: FinancialItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
};

export const FinancialItemCard: React.FC<FinancialItemCardProps> = ({
  item,
  onDragStart,
  onDragEnd,
}) => {
  const isRevenue = item.type === "revenue";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative bg-zinc-950 border border-zinc-800 p-3 cursor-move transition-all duration-200",
        "hover:shadow-lg active:scale-[0.98]",
        isRevenue
          ? "hover:border-emerald-500/50 hover:shadow-emerald-500/10 border-l-2 border-l-emerald-500"
          : "hover:border-rose-500/50 hover:shadow-rose-500/10 border-l-2 border-l-rose-500"
      )}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs text-zinc-200 font-medium leading-tight truncate">
            {item.title}
          </h4>
          <span className="inline-block text-[9px] text-zinc-500 uppercase tracking-wider border border-zinc-800 px-1 py-0.5 rounded-none bg-zinc-900 mt-1">
            {item.category}
          </span>
        </div>
        <GripVertical className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900">
        <span className="text-[9px] text-zinc-500 uppercase">
          {item.frequency}
        </span>
        <span
          className={cn(
            "font-mono text-xs",
            isRevenue ? "text-emerald-400" : "text-rose-400"
          )}
        >
          ${item.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
