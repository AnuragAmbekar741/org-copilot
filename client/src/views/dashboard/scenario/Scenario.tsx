import React from "react";
import { useNavigate } from "react-router-dom";
import { useScenarios, useDeleteScenario } from "@/hooks/useScenario";
import { ScenarioCard } from "@/components/scenario/ScenarioCard";
import { type Scenario as ScenarioType } from "@/api/scenario";
import { Loader2 } from "lucide-react";

import { EmptyScenarioState } from "@/components/common/EmptyScenarioState";

export const Scenario: React.FC = () => {
  const navigate = useNavigate();
  const { data: scenariosResponse, isLoading } = useScenarios();
  const { mutateAsync: deleteScenario, isPending: isDeleting } =
    useDeleteScenario();
  const scenarios = scenariosResponse?.data || [];

  const handleScenarioClick = (scenario: ScenarioType) => {
    navigate(`/dashboard/scenario/${scenario.id}`);
  };

  const handleDelete = async (scenario: ScenarioType) => {
    await deleteScenario(scenario.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (scenarios.length === 0) {
    return <EmptyScenarioState />;
  }

  return (
    <div className="flex h-full w-full p-6">
      {/* Left Panel: Scenario List */}
      <div className="w-full h-full px-2 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-light text-white tracking-tight">
              Scenarios
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              View and manage your financial models.
            </p>
          </div>

          {/* Replaced by EmptyScenarioState when no scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onClick={handleScenarioClick}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
