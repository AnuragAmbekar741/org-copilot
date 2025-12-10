import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const baseStyle = "flex w-full 2xl:max-w-6xl mx-auto";

  const handlePreviewGenerated = (data: CreateScenarioPayload) => {
    setPreviewData(data);
    setIsTransitioning(true);

    // Wait for fade-out animation before navigating
    setTimeout(() => {
      navigate("/dashboard/home?mode=manual", { replace: true });
      // Reset transition state after a brief delay
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className={cn(baseStyle, "relative overflow-hidden")}>
      <AnimatePresence mode="wait">
        {isManualMode ? (
          <motion.div
            key="manual"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(baseStyle, "w-full")}
          >
            <ManualMode previewData={previewData} />
          </motion.div>
        ) : (
          <motion.div
            key="ai"
            variants={containerVariants}
            initial="hidden"
            animate={isTransitioning ? "exit" : "visible"}
            exit="exit"
            className={baseStyle}
          >
            <AIMode onPreviewGenerated={handlePreviewGenerated} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
