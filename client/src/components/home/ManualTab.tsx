import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/wrappers/form-field";
import { FormSelect } from "@/components/wrappers/form-select";
import { z } from "zod";
import { Plus } from "lucide-react";
import { AppButton } from "@/components/wrappers/app-button";

const manualItemSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.enum(["cost", "revenue"], {
    message: "Type is required",
  }),
  value: z.coerce.number().min(0, { message: "Value must be positive" }),
  frequency: z.enum(["monthly", "one_time", "yearly"], {
    message: "Frequency is required",
  }),
  startsAt: z.string().min(1, { message: "Start date is required" }),
  endsAt: z.string().optional(),
});

type ManualItemFormValues = z.input<typeof manualItemSchema>;

type ManualTabProps = {
  onAddItem: (item: {
    title: string;
    category: string;
    type: "revenue" | "cost";
    value: number;
    frequency: "monthly" | "one_time" | "yearly";
    startsAt: string;
    endsAt?: string;
  }) => void;
};

export const ManualTab: React.FC<ManualTabProps> = ({ onAddItem }) => {
  const form = useForm<ManualItemFormValues>({
    resolver: zodResolver(manualItemSchema),
    defaultValues: {
      title: "",
      category: "",
      type: "revenue",
      value: "",
      frequency: "monthly",
      startsAt: new Date().toISOString().split("T")[0],
      endsAt: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const parsed = manualItemSchema.parse(values);
    onAddItem({
      title: parsed.title,
      category: parsed.category,
      type: parsed.type,
      value: parsed.value,
      frequency: parsed.frequency,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt || undefined,
    });
    form.reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title and Category in one row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Title"
          register={form.register("title")}
          error={form.formState.errors.title?.message}
          placeholder="e.g. Product Sales"
        />

        <FormField
          label="Category"
          register={form.register("category")}
          error={form.formState.errors.category?.message}
          placeholder="e.g. Sales, Personnel"
        />
      </div>

      {/* Type and Value in one row */}
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Type"
          control={form.control}
          name="type"
          error={form.formState.errors.type?.message}
          options={[
            { value: "revenue", label: "Revenue" },
            { value: "cost", label: "Cost" },
          ]}
          variant="boxed"
        />

        <FormField
          label="Value ($)"
          register={form.register("value")}
          error={form.formState.errors.value?.message}
          placeholder="0.00"
          type="number"
          step="0.01"
          variant="underline"
        />
      </div>

      {/* Frequency */}
      <FormSelect
        label="Frequency"
        control={form.control}
        name="frequency"
        error={form.formState.errors.frequency?.message}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "one_time", label: "One Time" },
          { value: "yearly", label: "Yearly" },
        ]}
        variant="boxed"
      />

      {/* StartsAt and EndsAt in one row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Starts At"
          register={form.register("startsAt")}
          error={form.formState.errors.startsAt?.message}
          type="date"
          variant="boxed"
        />

        <FormField
          label="Ends At (Optional)"
          register={form.register("endsAt")}
          error={form.formState.errors.endsAt?.message}
          type="date"
          variant="boxed"
        />
      </div>

      <AppButton type="submit" variant="outline" label="Add Item" icon={Plus} />
    </form>
  );
};
