import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormField } from "@/components/wrappers/form-field";
import { FormSelect } from "@/components/wrappers/form-select";
import { AppButton } from "@/components/wrappers/app-button";
import { Plus } from "lucide-react";

const addRevenueSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  value: z.coerce.number().min(0, { message: "Value must be positive" }),
  frequency: z.enum(["monthly", "one_time", "yearly"], {
    message: "Frequency is required",
  }),
  startsAt: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Starts at must be >= 0 (timeline index)" }),
  endsAt: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? null : Number(val),
    z.number().int().nonnegative().nullable()
  ),
});

type AddRevenueFormValues = z.input<typeof addRevenueSchema>;

type AddRevenueModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: {
    title: string;
    category: string;
    type: "revenue";
    value: number;
    frequency: "monthly" | "one_time" | "yearly";
    startsAt: number;
    endsAt?: number | null;
  }) => void;
  isPending?: boolean;
};

export const AddRevenueModal: React.FC<AddRevenueModalProps> = ({
  open,
  onOpenChange,
  onAdd,
  isPending,
}) => {
  const form = useForm<AddRevenueFormValues>({
    resolver: zodResolver(addRevenueSchema),
    defaultValues: {
      title: "",
      category: "",
      value: 0,
      frequency: "monthly",
      startsAt: 0,
      endsAt: undefined,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    // Parse values again to ensure types are transformed (e.g. value string to number)
    const parsed = addRevenueSchema.parse(values);
    onAdd({
      title: parsed.title,
      category: parsed.category,
      type: "revenue",
      value: parsed.value,
      frequency: parsed.frequency,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt ?? undefined,
    });
    form.reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Revenue</DialogTitle>
          <DialogDescription>
            Add a new revenue stream to your scenario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Title"
              register={form.register("title")}
              error={form.formState.errors.title?.message}
              placeholder="e.g. SaaS Subscription"
              variant="boxed"
            />
            <FormField
              label="Category"
              register={form.register("category")}
              error={form.formState.errors.category?.message}
              placeholder="e.g. Sales"
              variant="boxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Value ($)"
              register={form.register("value")}
              error={form.formState.errors.value?.message}
              placeholder="0.00"
              type="number"
              step="0.01"
              variant="boxed"
            />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Starts At"
              register={form.register("startsAt")}
              error={form.formState.errors.startsAt?.message}
              type="number"
              variant="boxed"
            />
            <FormField
              label="Ends At (Optional)"
              register={form.register("endsAt")}
              error={form.formState.errors.endsAt?.message}
              type="number"
              variant="boxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <AppButton
              type="button"
              variant="default"
              label="Cancel"
              onClick={() => onOpenChange(false)}
              className="w-auto h-10 border-none bg-transparent hover:bg-zinc-800 text-zinc-400"
            />
            <AppButton
              type="submit"
              variant="outline"
              label={isPending ? "Adding..." : "Add Revenue"}
              icon={Plus}
              disabled={isPending}
              className="w-auto px-6 h-10"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
