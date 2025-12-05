import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ScenarioFormValues } from "@/views/dashboard/home/schema";

type ScenarioFormProps = {
  form: UseFormReturn<ScenarioFormValues>;
};

export const ScenarioForm: React.FC<ScenarioFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 group">
        <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
          Scenario Title
        </Label>
        <Input
          {...form.register("title")}
          className="bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-12 text-sm transition-colors placeholder:text-zinc-800"
          placeholder="e.g. Q1 Growth Plan"
        />
        {form.formState.errors.title && (
          <p className="text-xs text-red-400">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
          Description (Optional)
        </Label>
        <Input
          {...form.register("description")}
          className="bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-12 text-sm transition-colors placeholder:text-zinc-800"
          placeholder="Brief description of your scenario"
        />
      </div>
    </div>
  );
};
