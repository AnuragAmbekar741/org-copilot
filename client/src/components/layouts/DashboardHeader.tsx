import { PanelLeftClose, PanelLeftOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/wrappers/app-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { type Scenario } from "@/api/scenario";
import { cn } from "@/utils/cn";
import { Separator } from "@radix-ui/react-select";

type DashboardHeaderProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isManualMode: boolean;
  onToggleManualMode: () => void;
  currentPath: string;
  scenarios?: Scenario[];
  currentScenario?: Scenario;
  currentScenarioId?: string;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  isManualMode,
  onToggleManualMode,
  currentPath,
  scenarios = [],
  currentScenarioId,
}) => {
  const navigate = useNavigate();
  const isOverviewRoute = currentPath === "/dashboard/home";
  const isScenarioDetailRoute =
    currentPath.startsWith("/dashboard/scenario/") && currentScenarioId;
  const isAnalyzeRoute = currentPath === "/dashboard/scenario";

  const handleScenarioChange = (scenarioId: string) => {
    navigate(`/dashboard/scenario/${scenarioId}`);
  };

  const getBreadcrumbLabel = () => {
    if (isOverviewRoute) return "Overview";
    if (isAnalyzeRoute || isScenarioDetailRoute) return "Analyze";
    return "";
  };

  const handleBreadcrumbClick = () => {
    if (isOverviewRoute) return; // Already there
    navigate("/dashboard/scenario"); // Default to analyze list for analyze route
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-200 h-8 w-8"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>

        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <button
            onClick={isOverviewRoute ? undefined : handleBreadcrumbClick}
            className={cn(
              "hover:text-white transition-colors uppercase tracking-wider text-xs",
              isOverviewRoute && "cursor-default hover:text-zinc-400"
            )}
          >
            {getBreadcrumbLabel()}
          </button>

          {/* Scenario Dropdown on detail page */}
          {isScenarioDetailRoute && scenarios.length > 0 && (
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <Select
                value={currentScenarioId}
                onValueChange={handleScenarioChange}
              >
                <SelectTrigger className="w-[200px] h-8 text-xs bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white text-zinc-200 hover:text-white transition-colors">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent className="rounded-none left-1.5 border-zinc-800 bg-zinc-950">
                  {scenarios.map((scenario) => (
                    <SelectItem
                      key={scenario.id}
                      value={scenario.id || ""}
                      className="rounded-none hover:bg-zinc-800"
                    >
                      {scenario.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Separator className="bg-zinc-800 h-8 w-[1px]" />
              <span className="text-sm text-zinc-400">
                {
                  scenarios.filter(
                    (scenario) => scenario.id === currentScenarioId
                  )[0].timelineLength
                }{" "}
                months
              </span>
            </div>
          )}
        </div>
      </div>

      {isOverviewRoute && (
        <div className="flex items-center gap-4">
          <AppButton
            onClick={onToggleManualMode}
            label={isManualMode ? "Build With Prompt" : "Build Manually"}
            isActive
          />
        </div>
      )}
    </header>
  );
};
