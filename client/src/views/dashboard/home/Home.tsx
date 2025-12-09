import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AIMode } from "./AiMode";
import { ManualMode } from "./ManualMode";
import { cn } from "@/utils/cn";
import { type CreateScenarioPayload } from "@/api/scenario";

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isManualMode = searchParams.get("mode") === "manual";
  const [previewData, setPreviewData] = useState<CreateScenarioPayload | null>(
    null
  );
  const baseStyle = "flex w-full 2xl:max-w-6xl mx-auto";

  const handlePreviewGenerated = (data: CreateScenarioPayload) => {
    setPreviewData(data);
    navigate("/dashboard/home?mode=manual", { replace: true });
  };

  return isManualMode ? (
    <div className={cn(baseStyle)}>
      <ManualMode previewData={previewData} />
    </div>
  ) : (
    <div className={baseStyle}>
      <AIMode onPreviewGenerated={handlePreviewGenerated} />
    </div>
  );
};
