import React from "react";
import { ArrowRight, Calendar, Trash, Clock } from "lucide-react";
import { type Scenario, type FinancialItem } from "@/api/scenario";
import { formatCompactNumber } from "@/utils/general";
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
      className="group relative flex flex-col h-full bg-black border border-zinc-800 hover:border-zinc-500 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* 1. Header Section */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/10">
        <h3 className="text-xl font-light text-white tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
          {scenario.title}
        </h3>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed ">
          {scenario.description || "System scenario description placeholder."}
        </p>
      </div>

      {/* Meta Info Grid (Date + Timeline) */}
      <div className="grid grid-cols-2 divide-x divide-zinc-800 border-b border-zinc-800 bg-zinc-900/20">
        <div className="p-4 flex items-center justify-center gap-2 bg-zinc-900/5 group-hover:bg-zinc-900/10 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">
            {formattedDate}
          </span>
        </div>
        <div className="p-4 flex items-center justify-center gap-2 bg-zinc-900/5 group-hover:bg-zinc-900/10 transition-colors">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">
            {scenario.timelineLength}{" "}
            {scenario.timelineLength === 1 ? "Month" : "Months"}
          </span>
        </div>
      </div>

      {/* 3. Stats Grid */}
      <div className="grid grid-cols-2 divide-x divide-zinc-800 border-b border-zinc-800">
        <div className="p-6 text-center bg-zinc-900/5 group-hover:bg-zinc-900/20 transition-colors">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-2">
            Revenue
          </div>
          <div className="text-lg font-mono text-emerald-400">
            ${formatCompactNumber(revenue)}
          </div>
        </div>
        <div className="p-6 text-center bg-zinc-900/5 group-hover:bg-zinc-900/20 transition-colors">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-2">
            Burn Rate
          </div>
          <div className="text-lg font-mono text-rose-400">
            ${formatCompactNumber(costs)}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-auto grid grid-cols-2 divide-x divide-zinc-800 bg-zinc-950">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(scenario);
          }}
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-rose-400 hover:bg-rose-950/10 transition-colors disabled:opacity-50"
        >
          <Trash className="w-3 h-3" />
          <span>{isDeleting ? "..." : "Del"}</span>
        </button>

        <button className="flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors group/view">
          <span>View</span>
          <ArrowRight className="w-3 h-3 group-hover/view:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
