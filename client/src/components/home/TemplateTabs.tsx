import React from "react";
import { cn } from "@/utils/cn";

type FinancialItem = {
  title: string;
  category: string;
  type: "revenue" | "cost";
  value: number;
  frequency: "monthly" | "one_time" | "yearly";
  startsAt: string;
  endsAt?: string;
};

type Template = {
  id: string;
  title: string;
  description: string;
  items: FinancialItem[];
};

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

const today = new Date().toISOString().split("T")[0];

const templates: Template[] = [
  {
    id: "1",
    title: "Engineering Team Expansion",
    description: "Hire engineers and generate sales from new products",
    items: [
      {
        title: "Engineer 1",
        category: "Personnel",
        type: "cost",
        value: 15000,
        frequency: "monthly",
        startsAt: today,
      },
      {
        title: "Engineer 2",
        category: "Personnel",
        type: "cost",
        value: 15000,
        frequency: "monthly",
        startsAt: today,
      },
      {
        title: "Engineer 3",
        category: "Personnel",
        type: "cost",
        value: 15000,
        frequency: "monthly",
        startsAt: today,
      },
      {
        title: "Product Sales",
        category: "Sales",
        type: "revenue",
        value: 10000,
        frequency: "monthly",
        startsAt: today,
      },
    ],
  },
  {
    id: "2",
    title: "Marketing Campaign Launch",
    description: "Launch campaign with associated costs and revenue",
    items: [
      {
        title: "Marketing Spend",
        category: "Marketing",
        type: "cost",
        value: 20000,
        frequency: "monthly",
        startsAt: today,
      },
      {
        title: "Campaign Revenue",
        category: "Sales",
        type: "revenue",
        value: 50000,
        frequency: "monthly",
        startsAt: today,
      },
    ],
  },
  {
    id: "3",
    title: "Office Setup",
    description: "One-time office setup costs",
    items: [
      {
        title: "Office Equipment",
        category: "Infrastructure",
        type: "cost",
        value: 50000,
        frequency: "one_time",
        startsAt: today,
      },
    ],
  },
  {
    id: "4",
    title: "Subscription Growth",
    description: "New subscription revenue",
    items: [
      {
        title: "Monthly Recurring Revenue",
        category: "Subscription",
        type: "revenue",
        value: 75000,
        frequency: "monthly",
        startsAt: today,
      },
    ],
  },
];

type TemplatesTabProps = {
  selectedTemplates: string[];
  onTemplateSelect: (template: Template) => void;
};

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  selectedTemplates,
  onTemplateSelect,
}) => {
  const getCategoryBadges = (items: FinancialItem[]) => {
    // First classify by revenue/cost, then group by category
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

  return (
    <div className="space-y-3">
      {templates.map((template) => {
        const isSelected = selectedTemplates.includes(template.id);
        const revenueItems = template.items.filter(
          (item) => item.type === "revenue"
        );
        const costItems = template.items.filter((item) => item.type === "cost");
        const hasBothTypes = revenueItems.length > 0 && costItems.length > 0;

        // Calculate sums
        const totalRevenue = revenueItems.reduce(
          (sum, item) => sum + item.value,
          0
        );
        const totalCost = costItems.reduce((sum, item) => sum + item.value, 0);

        const { revenueCategories, costCategories } = getCategoryBadges(
          template.items
        );

        return (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={cn(
              "w-full p-4 border-2 rounded-none text-left transition-all",
              isSelected
                ? "border-white bg-zinc-900/70"
                : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Title and Description */}
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-sm font-medium text-white">
                  {template.title}
                </h3>
                <p className="text-xs text-zinc-500">{template.description}</p>

                {/* Category Badges */}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {/* Revenue Category Badges */}
                  {Object.entries(revenueCategories).map(
                    ([category, count]) => (
                      <Badge key={`revenue-${category}`} type="revenue">
                        {count > 1 ? `${count} ${category}` : category}
                      </Badge>
                    )
                  )}

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
                    <Badge type="revenue">
                      ${totalRevenue.toLocaleString()}
                    </Badge>
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
      })}
    </div>
  );
};
