import React from "react";
import { type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ScenarioFormValues } from "@/views/dashboard/home/schema";

type SelectedItemsListProps = {
  fields: UseFieldArrayReturn<ScenarioFormValues, "financialItems">["fields"];
  remove: UseFieldArrayReturn<ScenarioFormValues, "financialItems">["remove"];
  form: UseFormReturn<ScenarioFormValues>;
  expandedItems: Set<string>;
  onToggleExpand: (index: number) => void;
  onRemove: (index: number) => void;
};

export const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
  fields,
  remove,
  form,
  expandedItems,
  onToggleExpand,
  onRemove,
}) => {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-2 mt-8">
      <Label className="text-xs uppercase tracking-widest text-zinc-500">
        Selected Items ({fields.length})
      </Label>
      <div className="space-y-2">
        {fields.map((field, index) => {
          const isExpanded = expandedItems.has(String(index));
          return (
            <div
              key={field.id}
              className="border border-zinc-800 bg-zinc-900/30 rounded-none"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 font-medium truncate">
                    {field.title || `Item ${index + 1}`}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {field.category} • ${Number(field.value).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                    onClick={() => onToggleExpand(index)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400"
                    onClick={() => {
                      remove(index);
                      onRemove(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-zinc-800 pt-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Type</Label>
                      <select
                        {...form.register(`financialItems.${index}.type`)}
                        className="bg-transparent border-zinc-800 border rounded-none focus:outline-none focus:border-white px-2 h-8 text-sm text-zinc-200 w-full"
                      >
                        <option value="cost">Cost</option>
                        <option value="revenue">Revenue</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Frequency</Label>
                      <select
                        {...form.register(`financialItems.${index}.frequency`)}
                        className="bg-transparent border-zinc-800 border rounded-none focus:outline-none focus:border-white px-2 h-8 text-sm text-zinc-200 w-full"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="one_time">One Time</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Value ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register(`financialItems.${index}.value`, {
                        valueAsNumber: true,
                      })}
                      className="bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white px-2 h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Starts At</Label>
                      <Input
                        type="date"
                        {...form.register(`financialItems.${index}.startsAt`)}
                        className="bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white px-2 h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Ends At</Label>
                      <Input
                        type="date"
                        {...form.register(`financialItems.${index}.endsAt`)}
                        className="bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white px-2 h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
