import React, { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { type FinancialItem } from "@/api/scenario";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";
import { groupItemsByCategory } from "./helpers/financialItemsHelpers";
import { type TimePeriod } from "./TimelineColumn";
import { FinancialAnalytics } from "./FinancialAnalyticsList";

type FinancialItemsListProps = {
  items: FinancialItem[];
  groupMode: "group" | "ungroup";
  periods: TimePeriod[];
  timelineLength: number;
  onUpdate?: (itemId: string, payload: Partial<FinancialItem>) => Promise<void>;
  onDelete?: (itemId: string) => Promise<void>;
};

type EditingCell = {
  itemId: string;
  field: keyof FinancialItem;
} | null;

export const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  items,
  groupMode,
  timelineLength,
  onUpdate,
  onDelete,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [editValue, setEditValue] = useState<string | number>("");

  const groupedItems = useMemo(() => {
    if (groupMode === "ungroup") return null;
    return groupItemsByCategory(items);
  }, [items, groupMode]);

  const handleCellClick = (
    itemId: string,
    field: keyof FinancialItem,
    currentValue: FinancialItem[keyof FinancialItem]
  ) => {
    if (!onUpdate) return;
    setEditingCell({ itemId, field });
    setEditValue(currentValue ?? "");
  };

  const handleSave = async () => {
    if (!editingCell || !onUpdate) return;

    const { itemId, field } = editingCell;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    // Check if value actually changed
    const currentValue = item[field];
    let newValue: string | number | null;

    if (field === "value" || field === "startsAt") {
      newValue = Number(editValue);
    } else if (field === "endsAt") {
      newValue = editValue === "" ? null : Number(editValue);
    } else {
      newValue = editValue;
    }

    // Skip API call if value hasn't changed
    if (currentValue === newValue) {
      setEditingCell(null);
      setEditValue("");
      return;
    }

    const payload: Partial<FinancialItem> = { [field]: newValue };
    await onUpdate(itemId, payload);

    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const inputClass =
    "bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs px-2 py-1 focus:outline-none focus:border-zinc-500";

  const isEditing = (itemId: string, field: keyof FinancialItem) =>
    editingCell?.itemId === itemId && editingCell?.field === field;

  const renderEditableCell = (
    item: FinancialItem,
    field: keyof FinancialItem,
    displayValue: React.ReactNode,
    inputType: "text" | "number" | "select" = "text",
    options?: { value: string; label: string }[]
  ) => {
    if (isEditing(item.id!, field)) {
      if (inputType === "select" && options) {
        return (
          <select
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={cn(inputClass, "w-full")}
            autoFocus
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      return (
        <input
          type={inputType}
          value={editValue}
          onChange={(e) =>
            setEditValue(
              inputType === "number" ? e.target.value : e.target.value
            )
          }
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn(
            inputClass,
            "w-full",
            inputType === "number" && "text-right font-mono"
          )}
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={() => handleCellClick(item.id!, field, item[field])}
        className="cursor-pointer hover:bg-zinc-800/50 px-1 -mx-1 rounded"
      >
        {displayValue}
      </span>
    );
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/50">
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9 pl-6">
          Title
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Category
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Type
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9 text-right">
          Value
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Frequency
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Starts
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9">
          Ends
        </TableHead>
        <TableHead className="text-zinc-500 text-[10px] uppercase tracking-widest font-normal h-9 w-10"></TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderCategoryRow = (
    category: string,
    totals: { revenue: number; cost: number },
    itemCount: number
  ) => {
    const hasRevenue = totals.revenue > 0;
    const hasCost = totals.cost > 0;
    const type =
      hasRevenue && hasCost ? "Mixed" : hasRevenue ? "revenue" : "cost";

    return (
      <TableRow
        key={category}
        className="border-zinc-800/50 hover:bg-zinc-800/30 group transition-colors"
      >
        <TableCell className="text-zinc-300 text-xs py-3 font-medium pl-6">
          {category}
        </TableCell>
        <TableCell className="py-3">
          <span className="inline-block text-[10px] text-zinc-400 uppercase tracking-wider border border-zinc-800 px-1.5 py-0.5 bg-zinc-900">
            {category}
          </span>
        </TableCell>
        <TableCell className="py-3">
          <span
            className={cn(
              "text-[9px] uppercase tracking-wider px-1.5 py-0.5 border",
              // Use neutral for mixed, specific for others but maybe less intense
              type === "Mixed"
                ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                : type === "revenue"
                ? "bg-emerald-500/10 text-emerald-500/70 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500/70 border-rose-500/20"
            )}
          >
            {type}
          </span>
        </TableCell>
        <TableCell className="text-right py-3">
          <div className="flex flex-col items-end gap-0.5">
            {hasRevenue && (
              <span className="font-mono text-xs text-emerald-400">
                +${totals.revenue.toLocaleString()}
              </span>
            )}
            {hasCost && (
              <span className="font-mono text-xs text-rose-400">
                -${totals.cost.toLocaleString()}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-zinc-500 text-xs font-mono py-3">
          {itemCount}
        </TableCell>
      </TableRow>
    );
  };

  const renderItemRow = (item: FinancialItem) => (
    <TableRow
      key={item.id}
      className="border-zinc-800/50 hover:bg-zinc-800/30 group transition-colors no-scrollbar"
    >
      {/* Title */}
      <TableCell className="py-2 pl-6">
        {renderEditableCell(
          item,
          "title",
          <span className="text-zinc-300 text-xs">{item.title}</span>,
          "text"
        )}
      </TableCell>

      {/* Category */}
      <TableCell className="py-2">
        {renderEditableCell(
          item,
          "category",
          <span className="text-[10px] text-zinc-400 uppercase">
            {item.category}
          </span>,
          "text"
        )}
      </TableCell>

      {/* Type */}
      <TableCell className="py-2">
        {renderEditableCell(
          item,
          "type",
          <span
            className={cn(
              "text-[9px] uppercase px-1.5 py-0.5 border",
              item.type === "revenue"
                ? "bg-emerald-500/10 text-emerald-500/70 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500/70 border-rose-500/20"
            )}
          >
            {item.type}
          </span>,
          "select",
          [
            { value: "cost", label: "Cost" },
            { value: "revenue", label: "Revenue" },
          ]
        )}
      </TableCell>

      {/* Value */}
      <TableCell className="text-right py-2">
        {renderEditableCell(
          item,
          "value",
          <span className="font-mono text-xs text-zinc-300">
            ${item.value.toLocaleString()}
          </span>,
          "number"
        )}
      </TableCell>

      {/* Frequency */}
      <TableCell className="py-2">
        {renderEditableCell(
          item,
          "frequency",
          <span className="text-[10px] text-zinc-500 uppercase">
            {item.frequency.replace("_", " ")}
          </span>,
          "select",
          [
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
            { value: "one_time", label: "One Time" },
          ]
        )}
      </TableCell>

      {/* Starts At */}
      <TableCell className="py-2">
        {renderEditableCell(
          item,
          "startsAt",
          <span className="text-zinc-500 text-xs font-mono">
            {item.startsAt}
          </span>,
          "number"
        )}
      </TableCell>

      {/* Ends At */}
      <TableCell className="py-2">
        {renderEditableCell(
          item,
          "endsAt",
          <span className="text-zinc-500 text-xs font-mono">
            {item.endsAt ?? "—"}
          </span>,
          "number"
        )}
      </TableCell>

      {/* Delete */}
      <TableCell className="py-2 pr-4">
        {onDelete && item.id && (
          <button
            onClick={() => onDelete(item.id!)}
            className="p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </TableCell>
    </TableRow>
  );

  const renderTableBody = () => {
    if (groupMode === "group" && groupedItems) {
      return (
        <TableBody className="no-scrollbar">
          {Object.entries(groupedItems).map(([category, categoryItems]) => {
            const totals = {
              revenue: 0,
              cost: 0,
            };
            categoryItems.forEach((item) => {
              const monthlyValue = item.value; // Use item.value directly
              if (item.type === "revenue") {
                totals.revenue += monthlyValue;
              } else {
                totals.cost += monthlyValue;
              }
            });
            return renderCategoryRow(category, totals, categoryItems.length);
          })}
        </TableBody>
      );
    }

    return <TableBody>{items.map((item) => renderItemRow(item))}</TableBody>;
  };

  return (
    <div className="flex h-full w-full overflow-hidden no-scrollbar">
      {/* List Section - 60% */}
      <div className="w-[60%] h-full flex flex-col border-r border-zinc-800 bg-zinc-950/50 overflow-hidden no-scrollbar">
        <div className="flex-1 overflow-y-auto p-0 no-scrollbar">
          <Table className="no-scrollbar">
            {renderTableHeader()}
            {renderTableBody()}
          </Table>
        </div>
      </div>

      {/* Analytics Section - 40% */}
      <div className="w-[40%] h-full">
        <FinancialAnalytics items={items} timelineLength={timelineLength} />
      </div>
    </div>
  );
};
