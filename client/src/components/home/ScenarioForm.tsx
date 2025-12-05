import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { type ScenarioFormValues } from "@/views/dashboard/home/schema";
import { FormField } from "@/components/ui/form-field";

type ScenarioFormProps = {
  form: UseFormReturn<ScenarioFormValues>;
};

export const ScenarioForm: React.FC<ScenarioFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Scenario Title"
        register={form.register("title")}
        error={form.formState.errors.title?.message}
        placeholder="e.g. Q1 Growth Plan"
      />

      <FormField
        label="Description (Optional)"
        register={form.register("description")}
        error={form.formState.errors.description?.message}
        placeholder="Brief description of your scenario"
      />
    </div>
  );
};
