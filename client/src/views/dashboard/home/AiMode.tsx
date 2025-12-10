import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import { AppButton } from "@/components/wrappers/app-button";
import { usePreviewScenarioFromPrompt } from "@/hooks/useScenario";
import { type CreateScenarioPayload } from "@/api/scenario";
import { cn } from "@/utils/cn";
import { validateScenarioViability } from "@/utils/scenarioValidation";
import { toast } from "sonner";

type AIModeProps = {
  onPreviewGenerated: (data: CreateScenarioPayload) => void;
};

export const AIMode: React.FC<AIModeProps> = ({ onPreviewGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const { mutateAsync: previewScenario, isPending } =
    usePreviewScenarioFromPrompt();

  const quickStarts = [
    {
      icon: Users,
      label: "Seed Stage SaaS",
      text: "Seed-funded SaaS startup with $500k funding. Current team: 2 engineers at $12k/month each, 1 designer at $8k/month. Monthly MRR is $8k. Planning to hire 1 sales rep at $10k/month starting month 3. Infrastructure costs $2k/month. Timeline: 12 months.",
    },
    {
      icon: DollarSign,
      label: "Series A Growth",
      text: "Series A fintech with $3M funding. Team: 3 senior engineers at $15k/month, 1 PM at $12k/month, 2 sales reps at $10k/month each. Current MRR $25k/month, projected to grow to $60k by month 6. AWS costs $5k/month, office rent $6k/month. Timeline: 18 months.",
    },
    {
      icon: Building2,
      label: "Bootstrapped Agency",
      text: "Design agency with no funding. 3 designers at $7k/month each, 1 account manager at $8k/month. Monthly retainer revenue: $45k from 8 clients. Office space $4k/month, software tools $1.5k/month. Planning to add 1 designer in month 4. Timeline: 12 months.",
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }
    try {
      const response = await previewScenario(prompt);
      if (response?.success && response?.data) {
        onPreviewGenerated(response.data);
      }
    } catch (error) {
      // Error is already handled by the hook's onError
      console.error("Failed to generate preview:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-2 px-4 relative">
      {/* Header Section */}
      <div className="space-y-4 text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-400">
          <Sparkles className="h-3 w-3 text-yellow-500" />
          <span>AI-Powered Scenario Modeling</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight text-white">
          Describe your organization <br />
          <span className="text-zinc-500">and we'll build the model.</span>
        </h1>
      </div>

      {/* Main Input Area */}
      <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
        <div className="space-y-2 group">
          <label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors block">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., We have funding of 1M and ARR of 50k and engineering team of 3 engineers with 150k each"
            className="w-full h-32 bg-transparent border-zinc-800 border rounded-none focus:outline-none focus:border-white px-2 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 resize-none transition-colors"
            disabled={isPending}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-zinc-600 flex items-center gap-2">
            <Zap className="h-3 w-3" />
            <span>
              {isPending ? "Generating..." : "Press Cmd/Ctrl+Enter to generate"}
            </span>
          </div>
          <AppButton
            variant="outline"
            label={isPending ? "Thinking..." : "Generate Scenario"}
            icon={isPending ? Loader2 : ArrowRight}
            onClick={handleGenerate}
            disabled={isPending || !prompt.trim()}
            className={cn("w-auto", isPending && "[&_svg]:animate-spin")}
          />
        </div>
      </div>

      {/* Quick Starts */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {quickStarts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setPrompt(item.text)}
              disabled={isPending}
              className="group flex flex-col gap-3 p-4 border border-zinc-800 bg-zinc-900/20 rounded-none hover:bg-zinc-900/60 hover:border-zinc-700 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="h-8 w-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center group-hover:border-zinc-600 transition-colors rounded-none">
                <Icon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-300 mb-1 group-hover:text-white">
                  {item.label}
                </div>
                <div className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  "{item.text}"
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
