import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import { AppButton } from "@/components/wrappers/app-button";

export const AIMode: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  const quickStarts = [
    {
      icon: Users,
      label: "Tech Startup",
      text: "We are a team of 4 engineers with $50k MRR, planning to hire 2 more next quarter...",
    },
    {
      icon: DollarSign,
      label: "Growth Phase",
      text: "Series A funded SaaS with $2M ARR looking to double headcount in engineering...",
    },
    {
      icon: Building2,
      label: "Agency Model",
      text: "Design agency with 10 retainers of $5k/mo, calculating burn rate for new office...",
    },
  ];

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
            placeholder="e.g., We are a bootstrapped SaaS with 5 employees, $20k MRR, growing 10% MoM. We want to hire a Sales Lead..."
            className="w-full h-32 bg-transparent border-zinc-800 border rounded-none focus:outline-none focus:border-white px-2 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 resize-none transition-colors"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-zinc-600 flex items-center gap-2">
            <Zap className="h-3 w-3" />
            <span>Press Enter to generate</span>
          </div>
          <AppButton
            variant="outline"
            label="Generate Scenario"
            icon={ArrowRight}
            onClick={() => console.log("Generate:", prompt)}
            className="w-auto"
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
              className="group flex flex-col gap-3 p-4 border border-zinc-800 bg-zinc-900/20 rounded-none hover:bg-zinc-900/60 hover:border-zinc-700 transition-all text-left"
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
