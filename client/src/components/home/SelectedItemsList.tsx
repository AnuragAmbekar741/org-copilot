import React from "react";
import { type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type ScenarioFormValues } from "@/views/dashboard/home/schema";
import { FormField } from "@/components/wrappers/form-field";

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
  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48  bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-zinc-800/20 rounded-none text-zinc-500 text-sm text-center">
        <span>No items selected yet.</span>
        <span className="mt-1 text-xs text-zinc-600">
          Add financial items from the right to build your scenario.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field, index) => {
        const isExpanded = expandedItems.has(String(index));
        return (
          <div
            key={field.id}
            className="border border-zinc-800 bg-zinc-900/30 rounded-none"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <div className="text-sm text-zinc-200 font-medium truncate">
                  {field.title || `Item ${index + 1}`}
                </div>
                <div className="text-xs text-zinc-500">{field.category}</div>
                <div className="text-xs text-zinc-500">
                  ${Number(field.value).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200 hover:border hover:border-zinc-800 hover:bg-transparent hover:rounded-none transition-all"
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
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400 hover:border hover:border-zinc-800 hover:bg-transparent hover:rounded-none transition-all"
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
                <FormField
                  label="Value ($)"
                  register={form.register(`financialItems.${index}.value`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  variant="boxed"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Starts At"
                    register={form.register(`financialItems.${index}.startsAt`)}
                    type="number"
                    variant="boxed"
                  />
                  <FormField
                    label="Ends At"
                    register={form.register(`financialItems.${index}.endsAt`)}
                    type="number"
                    variant="boxed"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
