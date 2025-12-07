import React from "react";
import { useSearchParams } from "react-router-dom";
import { AIMode } from "./AiMode";
import { ManualMode } from "./ManualMode";

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isManualMode = searchParams.get("mode") === "manual";
  const baseStyle = "flex w-full mx-auto";

  return isManualMode ? (
    <div className={baseStyle}>
      <ManualMode />
    </div>
  ) : (
    <div className={baseStyle}>
      <AIMode />
    </div>
  );
};
