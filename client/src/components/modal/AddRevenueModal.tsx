import React, { useState } from "react";
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
import { Plus, FileText, PenLine, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  REVENUE_ITEM_TEMPLATES,
  COST_ITEM_TEMPLATES,
} from "@/constants/templates";

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
    type: "revenue" | "cost";
    value: number;
    frequency: "monthly" | "one_time" | "yearly";
    startsAt: number;
    endsAt?: number | null;
  }) => void;
  isPending?: boolean;
  itemType?: "revenue" | "cost"; // Add this prop
};

type ModalStep = "type" | "choose" | "template" | "manual";

export const AddRevenueModal: React.FC<AddRevenueModalProps> = ({
  open,
  onOpenChange,
  onAdd,
  isPending,
  itemType = "revenue", // Default to revenue for backward compatibility
}) => {
  const [step, setStep] = useState<ModalStep>("type");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<"revenue" | "cost">(
    itemType
  );

  // Get templates based on selected item type
  const templates =
    selectedItemType === "revenue"
      ? REVENUE_ITEM_TEMPLATES
      : COST_ITEM_TEMPLATES;
  const itemTypeLabel = selectedItemType === "revenue" ? "Revenue" : "Cost";

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

  const handleClose = () => {
    setStep("type");
    setSelectedTemplate(null);
    setSelectedItemType(itemType); // Reset to default
    form.reset();
    onOpenChange(false);
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("title", template.title);
      form.setValue("category", template.category);
      form.setValue("value", template.value);
      form.setValue("frequency", template.frequency);
      setSelectedTemplate(templateId);
    }
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setStep("manual"); // Go to form with pre-filled values
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    const parsed = addRevenueSchema.parse(values);
    onAdd({
      title: parsed.title,
      category: parsed.category,
      type: selectedItemType,
      value: parsed.value,
      frequency: parsed.frequency,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt ?? undefined,
    });
    handleClose();
  });

  // Step 1: Choose Template or Manual
  const renderChooseStep = () => (
    <div className="space-y-4 pt-4">
      <button
        onClick={() => setStep("type")}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <button
        onClick={() => setStep("template")}
        className="w-full p-4 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group text-left"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2 border",
              selectedItemType === "revenue"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            )}
          >
            <FileText
              className={cn(
                "h-5 w-5",
                selectedItemType === "revenue"
                  ? "text-emerald-500"
                  : "text-red-500"
              )}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
              Use a Template
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Choose from common {selectedItemType.toLowerCase()} types like{" "}
              {selectedItemType === "revenue"
                ? "MRR, funding rounds, or enterprise deals"
                : "salaries, infrastructure, or marketing costs"}
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => setStep("manual")}
        className="w-full p-4 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group text-left"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20">
            <PenLine className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
              Add Manually
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Create a custom {selectedItemType.toLowerCase()} item with your
              own details
            </p>
          </div>
        </div>
      </button>
    </div>
  );

  // Step 2a: Template Selection
  const renderTemplateStep = () => (
    <div className="space-y-4 pt-4">
      <button
        onClick={() => setStep("choose")}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={cn(
              "p-3 border text-left transition-all",
              selectedTemplate === template.id
                ? selectedItemType === "revenue"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-red-500 bg-red-500/10"
                : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-zinc-200">
                {template.title}
              </p>
              {selectedTemplate === template.id && (
                <Check
                  className={cn(
                    "h-3 w-3",
                    selectedItemType === "revenue"
                      ? "text-emerald-500"
                      : "text-red-500"
                  )}
                />
              )}
            </div>
            <p className="text-[10px] text-zinc-500">{template.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "text-[10px] font-mono",
                  selectedItemType === "revenue"
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                ${template.value.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-[10px] text-zinc-500 uppercase">
                {template.frequency.replace("_", " ")}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <AppButton
          type="button"
          variant="default"
          label="Cancel"
          onClick={handleClose}
          className="w-auto h-10 border-none bg-transparent hover:bg-zinc-800 text-zinc-400"
        />
        <AppButton
          type="button"
          variant="outline"
          label="Customize Template"
          onClick={handleUseTemplate}
          disabled={!selectedTemplate}
          className="w-auto px-6 h-10"
        />
      </div>
    </div>
  );

  // Step 2b: Manual Form (or customizing template)
  const renderManualStep = () => (
    <form onSubmit={onSubmit} className="space-y-6 pt-4">
      {step === "manual" && selectedTemplate && (
        <button
          type="button"
          onClick={() => setStep("template")}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to templates
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Title"
          register={form.register("title")}
          error={form.formState.errors.title?.message}
          placeholder={`e.g. ${
            selectedItemType === "revenue"
              ? "SaaS Subscription"
              : "Software Engineer"
          }`}
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
          label="Starts At (Month)"
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
          onClick={handleClose}
          className="w-auto h-10 border-none bg-transparent hover:bg-zinc-800 text-zinc-400"
        />
        <AppButton
          type="submit"
          variant="outline"
          label={isPending ? `Adding...` : `Add ${itemTypeLabel}`}
          icon={Plus}
          disabled={isPending}
          className="w-auto px-6 h-10"
        />
      </div>
    </form>
  );

  // New step: Type selection
  const renderTypeStep = () => (
    <div className="space-y-4 pt-4">
      <button
        onClick={() => {
          setSelectedItemType("revenue");
          setStep("choose");
        }}
        className="w-full p-4 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group text-left"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20">
            <FileText className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
              Add Revenue
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              MRR, funding rounds, enterprise deals, and other income sources
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => {
          setSelectedItemType("cost");
          setStep("choose");
        }}
        className="w-full p-4 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group text-left"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-500/10 border border-red-500/20">
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
              Add Cost
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Salaries, infrastructure, marketing, and other expenses
            </p>
          </div>
        </div>
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "type" && "Add Financial Item"}
            {step === "choose" && `Add ${itemTypeLabel}`}
            {step === "template" && "Choose Template"}
            {step === "manual" &&
              (selectedTemplate
                ? `Customize ${itemTypeLabel}`
                : `Add ${itemTypeLabel} Manually`)}
          </DialogTitle>
          <DialogDescription>
            {step === "type" &&
              "What type of financial item would you like to add?"}
            {step === "choose" &&
              `How would you like to add a ${itemTypeLabel.toLowerCase()} item?`}
            {step === "template" && "Select a template to get started quickly"}
            {step === "manual" &&
              `Fill in the details for your ${itemTypeLabel.toLowerCase()} item`}
          </DialogDescription>
        </DialogHeader>

        {step === "type" && renderTypeStep()}
        {step === "choose" && renderChooseStep()}
        {step === "template" && renderTemplateStep()}
        {step === "manual" && renderManualStep()}
      </DialogContent>
    </Dialog>
  );
};
