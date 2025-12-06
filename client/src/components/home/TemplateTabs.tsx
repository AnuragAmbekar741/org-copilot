import React from "react";
import { TemplateCard } from "./TemplateCard";
import { templates, type Template } from "@/constants/templates";

type TemplatesTabProps = {
  selectedTemplates: string[];
  onTemplateSelect: (template: Template) => void;
};

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  selectedTemplates,
  onTemplateSelect,
}) => {
  return (
    <div className="max-h-[calc(100vh-15rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplates.includes(template.id)}
            onSelect={() => onTemplateSelect(template)}
          />
        ))}
      </div>
    </div>
  );
};
