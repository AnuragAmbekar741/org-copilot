import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/wrappers/app-button";

type DashboardHeaderProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isManualMode: boolean;
  onToggleManualMode: () => void;
  currentPath: string;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  isManualMode,
  onToggleManualMode,
  currentPath,
}) => {
  const isOverviewRoute = currentPath === "/dashboard/home";

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
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
