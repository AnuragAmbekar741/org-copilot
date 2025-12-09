import React from "react";
import { BarChart3, FileSpreadsheet, Keyboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyScenarioState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-zinc-950">
      <div className="max-w-2xl w-full">
        {/* Visual Element */}
        <div className="mb-12 relative flex justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 bg-zinc-950 border border-zinc-700 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-2xl font-light text-white mb-3 tracking-wide">
          No Scenarios Yet
        </h2>
        <p className="text-zinc-500 text-sm mb-12 max-w-md mx-auto leading-relaxed">
          Start planning your organization's growth. Create financial models,
          track headcount, and analyze runway with precision.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          <button
            onClick={() => navigate("/dashboard/home")}
            className="group flex flex-col items-start p-5 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-left"
          >
            <div className="mb-3 p-2 bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-zinc-200 mb-1">
              Prompt AI
            </h3>
            <p className="text-xs text-zinc-500">
              Start with pre-built models for SaaS, E-commerce, and more.
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/home?mode=manual")}
            className="group flex flex-col items-start p-5 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-left"
          >
            <div className="mb-3 p-2 bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
              <Keyboard className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-zinc-200 mb-1">
              Build Manually
            </h3>
            <p className="text-xs text-zinc-500">
              Create a custom scenario from scratch with your own data.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
