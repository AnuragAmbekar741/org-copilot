import { PanelLeftClose, PanelLeftOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

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
    <header className="flex h-16 items-center justify-between gap-4 border-b-[var(--dashboard-border-width)] border-[var(--dashboard-border)] bg-zinc-800/40 px-6 backdrop-blur-md sticky top-0 z-40">
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
          <Button
            variant="outline"
            className={cn(
              "border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-wider h-9",
              isManualMode && "bg-zinc-800 text-white border-zinc-600"
            )}
            onClick={onToggleManualMode}
          >
            <PenTool className="mr-2 h-3 w-3" />
            {isManualMode ? "Exit Manual Mode" : "Build Manually"}
          </Button>
        </div>
      )}
    </header>
  );
};
