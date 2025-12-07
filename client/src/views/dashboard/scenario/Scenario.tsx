import React from "react";
import { useScenarios } from "@/hooks/useScenario";
import { ScenarioCard } from "@/components/scenario/ScenarioCard";
import { type Scenario as ScenarioType } from "@/api/scenario";
import { Loader2 } from "lucide-react";

export const Scenario: React.FC = () => {
  const { data: scenariosResponse, isLoading } = useScenarios();
  const scenarios = scenariosResponse?.data || [];

  const handleScenarioClick = (scenario: ScenarioType) => {
    console.log("Clicked scenario:", scenario.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full ">
      {/* Left Panel: Scenario List */}
      <div className="w-full h-full p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-light text-white tracking-tight">
              Scenarios
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              View and manage your financial models.
            </p>
          </div>

          {scenarios.length === 0 ? (
            <div className="text-center py-20 border border-zinc-800 border-dashed rounded-none bg-zinc-900/20">
              <p className="text-zinc-500 text-sm">No scenarios created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onClick={handleScenarioClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
