import React from "react";
import { ArrowRight, Calendar, Trash } from "lucide-react";
import { type Scenario, type FinancialItem } from "@/api/scenario";
import { cn } from "@/utils/cn";

type ScenarioCardProps = {
  scenario: Scenario;
  onClick?: (scenario: Scenario) => void;
  onDelete?: (scenario: Scenario) => void;
  isDeleting?: boolean;
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onClick,
  onDelete,
  isDeleting,
}) => {
  // Calculate totals
  const items = (scenario.financialItems as FinancialItem[]) || [];
  const revenue = items
    .filter((i) => i.type === "revenue")
    .reduce((sum, i) => sum + Number(i.value), 0);
  const costs = items
    .filter((i) => i.type === "cost")
    .reduce((sum, i) => sum + Number(i.value), 0);

  const formattedDate = scenario.createdAt
    ? new Date(scenario.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Just now";

  return (
    <div
      onClick={() => onClick?.(scenario)}
      className={cn(
        "group relative flex flex-col justify-between p-6 h-full",
        "bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40 transition-all duration-300",
        "cursor-pointer rounded-none"
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-light text-white group-hover:text-zinc-100 transition-colors tracking-wide">
            {scenario.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 min-h-[32px] leading-relaxed">
            {scenario.description || "No description provided."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-zinc-800/50 mt-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              Revenue
            </div>
            <div className="text-sm font-medium text-emerald-400">
              ${revenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              Burn
            </div>
            <div className="text-sm font-medium text-rose-400">
              ${costs.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-zinc-800/50 text-[10px] text-zinc-600 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(scenario);
            }}
            disabled={isDeleting}
            className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash className="w-3 h-3" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        <div className="flex items-center gap-1 group-hover:text-white transition-colors text-zinc-500">
          <span>Details</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
