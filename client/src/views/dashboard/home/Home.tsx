import React from "react";
import { useSearchParams } from "react-router-dom";
import { AIMode } from "./AiMode";
import { ManualMode } from "./ManualMode";
import { cn } from "@/utils/cn";

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isManualMode = searchParams.get("mode") === "manual";
  const baseStyle = "flex w-full 2xl:max-w-6xl mx-auto";

  return isManualMode ? (
    <div className={cn(baseStyle)}>
      <ManualMode />
    </div>
  ) : (
    <div className={baseStyle}>
      <AIMode />
    </div>
  );
};
