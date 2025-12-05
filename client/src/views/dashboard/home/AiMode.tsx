import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="w-full relative group animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
        <div className="absolute -inset-0.5 bg-zinc-500/50 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative bg-black border border-zinc-800 rounded-lg p-2 shadow-2xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., We are a bootstrapped SaaS with 5 employees, $20k MRR, growing 10% MoM. We want to hire a Sales Lead..."
            className="w-full h-32 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-600 p-4 resize-none focus:outline-none font-mono"
          />
          <div className="flex justify-between items-center px-4 pb-2 pt-2 border-t border-zinc-900/50">
            <div className="text-xs text-zinc-600 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span>Press Enter to generate</span>
            </div>
            <Button
              className="bg-white text-black hover:bg-zinc-200 rounded-none px-6 font-medium transition-all"
              onClick={() => console.log("Generate:", prompt)}
            >
              Generate Scenario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
              className="group flex flex-col gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all text-left"
            >
              <div className="h-8 w-8 rounded-md bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600 transition-colors">
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
