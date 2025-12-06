import React from "react";
import { cn } from "@/utils/cn";
import { type Template, type FinancialItem } from "@/constants/templates";

type BadgeProps = {
  type: "revenue" | "cost";
  children: React.ReactNode;
  borderColor?: string;
};

const Badge: React.FC<BadgeProps> = ({ type, children, borderColor }) => {
  const isRevenue = type === "revenue";
  const bgColor = isRevenue ? "bg-green-300" : "bg-red-300";
  const defaultBorderColor = borderColor || "border-zinc-950";

  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-none border text-black font-medium",
        bgColor,
        defaultBorderColor
      )}
    >
      {children}
    </span>
  );
};

type TemplateCardProps = {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  const getCategoryBadges = (items: FinancialItem[]) => {
    const revenueCategories: Record<string, number> = {};
    const costCategories: Record<string, number> = {};

    items.forEach((item) => {
      if (item.type === "revenue") {
        revenueCategories[item.category] =
          (revenueCategories[item.category] || 0) + 1;
      } else {
        costCategories[item.category] =
          (costCategories[item.category] || 0) + 1;
      }
    });

    return { revenueCategories, costCategories };
  };

  const revenueItems = template.items.filter((item) => item.type === "revenue");
  const costItems = template.items.filter((item) => item.type === "cost");
  const hasBothTypes = revenueItems.length > 0 && costItems.length > 0;

  // Calculate sums
  const totalRevenue = revenueItems.reduce((sum, item) => sum + item.value, 0);
  const totalCost = costItems.reduce((sum, item) => sum + item.value, 0);

  const { revenueCategories, costCategories } = getCategoryBadges(
    template.items
  );

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 border rounded-none text-left transition-all relative",
        isSelected
          ? "border-zinc-600 bg-zinc-900/70"
          : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
      )}
    >
      {/* White square indicator at bottom right when selected */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-100 flex items-center justify-center"></div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left: Title and Description */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-sm font-medium text-white">{template.title}</h3>
          <p className="text-xs text-zinc-500">{template.description}</p>

          {/* Category Badges */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {/* Revenue Category Badges */}
            {Object.entries(revenueCategories).map(([category, count]) => (
              <Badge key={`revenue-${category}`} type="revenue">
                {count > 1 ? `${count} ${category}` : category}
              </Badge>
            ))}

            {/* Cost Category Badges */}
            {Object.entries(costCategories).map(([category, count]) => (
              <Badge key={`cost-${category}`} type="cost">
                {count > 1 ? `${count} ${category}` : category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right: Badges - Sum of Revenue and Cost */}
        <div
          className={cn(
            "flex gap-2",
            hasBothTypes ? "flex-col" : "flex-row flex-wrap items-center"
          )}
        >
          {/* Revenue Total (Upper) */}
          {revenueItems.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge type="revenue">${totalRevenue.toLocaleString()}</Badge>
            </div>
          )}

          {/* Cost Total (Lower) */}
          {costItems.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge type="cost">${totalCost.toLocaleString()}</Badge>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
