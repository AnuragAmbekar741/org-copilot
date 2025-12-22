import React, { useMemo } from "react";
import { type FinancialItem } from "@/api/scenario";
import { cn } from "@/utils/cn";
import { calculateAnalytics } from "./helpers/analytics";

type FinancialAnalyticsProps = {
  items: FinancialItem[];
  timelineLength: number;
};

// Horizontal Bar Chart Component
const BarChart: React.FC<{
  data: { name: string; value: number; percent: number; color: string }[];
  total: number;
  label: string;
  totalColor?: string;
}> = ({ data, total, label, totalColor = "text-zinc-200" }) => {
  if (data.length === 0) {
    return (
      <div className="text-zinc-600 text-xs">No {label.toLowerCase()}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
          {label}
        </p>
        <p className={cn("text-xs font-mono", totalColor)}>
          ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* Stacked Bar */}
      <div className="h-4 flex rounded-sm overflow-hidden mb-3">
        {data.map(({ name, percent, color }) => (
          <div
            key={name}
            className={cn(color, "h-full transition-all")}
            style={{ width: `${percent}%` }}
            title={`${name}: ${percent.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
              <span className="text-zinc-400">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 font-mono">
                $
                {item.value.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-zinc-300 font-mono w-10 text-right">
                {item.percent.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({
  items,
  timelineLength,
}) => {
  const analytics = useMemo(
    () => calculateAnalytics(items, timelineLength),
    [items, timelineLength]
  );

  // Calculate Net and Funding Utilized
  const net = analytics.totalRevenue - analytics.totalCost;
  const fundingUtilized =
    analytics.totalCost > analytics.totalRevenue
      ? analytics.totalCost - analytics.totalRevenue
      : 0;

  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <div className="px-6 py-2.5 border-b border-zinc-800">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          Financial Overview
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Summary Grid - Updated to show Revenue, Cost, Net, Funding, Funding Utilized, Runway */}
        <div className="grid grid-cols-2 auto-rows-fr">
          {/* Box 1: Revenue (Operational) */}
          <div className="p-4 border-r border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Revenue
            </p>
            <p className="text-xl font-mono text-emerald-400 mt-1">
              $
              {analytics.totalRevenue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Box 2: Cost */}
          <div className="p-4 border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Cost
            </p>
            <p className="text-xl font-mono text-rose-400 mt-1">
              $
              {analytics.totalCost.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Box 3: Net (Revenue - Cost) */}
          <div className="p-4 border-r border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Net
            </p>
            <p
              className={cn(
                "text-xl font-mono mt-1",
                net >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {net >= 0 ? "+" : ""}$
              {Math.abs(net).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Box 4: Funding Available */}
          <div className="p-4 border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Funding Available
            </p>
            <p className="text-xl font-mono text-violet-400 mt-1">
              $
              {analytics.totalFunding.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Box 5: Funding Utilized */}
          <div className="p-4 border-r border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Funding Utilized
            </p>
            <p className="text-xl font-mono text-violet-400 mt-1">
              $
              {fundingUtilized.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
            {fundingUtilized === 0 && (
              <p className="text-[9px] text-emerald-500 mt-0.5">
                Revenue covers cost
              </p>
            )}
          </div>

          {/* Box 6: Runway */}
          <div className="p-4 border-b border-zinc-800 min-h-[5rem]">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Runway
            </p>
            <p className="text-xl font-mono text-zinc-200 mt-1">
              {analytics.runway === Infinity ? "∞" : `${analytics.runway} mo`}
            </p>
          </div>
        </div>

        {/* Cost Breakdown */}
        {analytics.costByCategory.length > 0 && (
          <div className="p-4 border-b border-zinc-800">
            <BarChart
              data={analytics.costByCategory}
              total={analytics.totalCost}
              label="Cost Breakdown"
              totalColor="text-rose-400"
            />
          </div>
        )}

        {/* Revenue Breakdown (Operational only) */}
        {analytics.revenueByCategory.length > 0 && (
          <div className="p-4 border-b border-zinc-800">
            <BarChart
              data={analytics.revenueByCategory}
              total={analytics.totalRevenue}
              label="Revenue Breakdown"
              totalColor="text-emerald-400"
            />
          </div>
        )}

        {/* Funding Breakdown */}
        {analytics.fundingByCategory.length > 0 && (
          <div className="p-4 border-b border-zinc-800">
            <BarChart
              data={analytics.fundingByCategory}
              total={analytics.totalFunding}
              label="Funding Breakdown"
              totalColor="text-violet-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};
