import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scenarioSchema, type ScenarioFormValues } from "./schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScenarioForm } from "@/components/home/ScenarioForm";
import { SelectedItemsList } from "@/components/home/SelectedItemsList";
import { TemplatesTab } from "@/components/home/TemplateTabs";
import { ManualTab } from "@/components/home/ManualTab";
import { useCreateScenario } from "@/hooks/useScenario";
import { AppButton } from "@/components/wrappers/app-button";

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

export const ManualMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"templates" | "manual">(
    "templates"
  );
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      title: "",
      description: "",
      financialItems: [],
    },
  });

  const { fields, append, prepend, remove } = useFieldArray({
    control: form.control,
    name: "financialItems",
  });

  const { mutateAsync: createScenario, isPending } = useCreateScenario();

  const handleTemplateSelect = (template: Template) => {
    if (selectedTemplates.includes(template.id)) {
      // Deselect: Remove all items from this template
      setSelectedTemplates(
        selectedTemplates.filter((id) => id !== template.id)
      );

      // Find and remove all items that match this template's items
      template.items.forEach((templateItem) => {
        const index = fields.findIndex(
          (item) =>
            item.title === templateItem.title &&
            item.category === templateItem.category &&
            item.type === templateItem.type &&
            Number(item.value) === templateItem.value &&
            item.frequency === templateItem.frequency
        );
        if (index !== -1) {
          remove(index);
        }
      });
    } else {
      // Select: Add all items from this template at the top
      setSelectedTemplates([...selectedTemplates, template.id]);
      // Reverse the items array so they appear in order when prepended
      const reversedItems = [...template.items].reverse();
      reversedItems.forEach((item) => {
        prepend({
          title: item.title,
          category: item.category,
          type: item.type,
          value: item.value,
          frequency: item.frequency,
          startsAt: item.startsAt,
          endsAt: item.endsAt || "",
        });
      });
    }
  };

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(String(index))) {
      newExpanded.delete(String(index));
    } else {
      newExpanded.add(String(index));
    }
    setExpandedItems(newExpanded);
  };

  const handleRemove = (index: number) => {
    console.log(index);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      financialItems:
        values.financialItems && values.financialItems.length > 0
          ? values.financialItems.map((item) => ({
              ...item,
              value: Number(item.value),
              startsAt: item.startsAt || new Date().toISOString(),
              endsAt: item.endsAt || undefined,
            }))
          : undefined,
    };

    await createScenario(payload);
  });

  return (
    <div className="flex h-full w-full">
      {/* Left Side - 40% - Title, Description & Selected Items */}
      <div className="w-[50%] flex flex-col h-full overflow-auto px-6 py-7">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-white">
            Manual Scenario Builder
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Define your organization's baseline metrics precisely.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 flex-1 flex flex-col">
          <ScenarioForm form={form} />

          {/* Scrollable container for selected items */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="max-h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <SelectedItemsList
                fields={fields}
                remove={remove}
                form={form}
                expandedItems={expandedItems}
                onToggleExpand={toggleExpand}
                onRemove={handleRemove}
              />
            </div>
          </div>

          <AppButton
            type="submit"
            variant="outline"
            label={isPending ? "Creating..." : "Initialize Scenario"}
            icon={ArrowRight}
            disabled={isPending}
            className="group mt-auto"
          />
        </form>
      </div>

      {/* Separator - Full Height */}
      <div className="w-px bg-zinc-800/50 h-full"></div>

      {/* Right Side - 60% - Tabs & Content */}
      <div className="w-[50%] flex flex-col h-full px-6 py-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "templates" | "manual")}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="templates">
              <TemplatesTab
                selectedTemplates={selectedTemplates}
                onTemplateSelect={handleTemplateSelect}
              />
            </TabsContent>
            <TabsContent value="manual">
              <ManualTab
                onAddItem={(item) => {
                  append({
                    title: item.title,
                    category: item.category,
                    type: item.type,
                    value: item.value,
                    frequency: item.frequency,
                    startsAt: item.startsAt,
                    endsAt: item.endsAt || "",
                  });
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
