import { useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import {
  FileChartColumn,
  FilePlusCorner,
  Settings,
  PanelLeftClose,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { clearAccessToken } from "@/utils/storage";
import { DashboardHeader } from "./DashboardHeader";
import { useScenarios, useScenario } from "@/hooks/useScenario";
import { useMe } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "Create",
    icon: FilePlusCorner,
    path: "/dashboard/home",
  },
  {
    title: "Analyze",
    icon: FileChartColumn,
    path: "/dashboard/scenario",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: scenarioId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isManualMode = searchParams.get("mode") === "manual";

  // Fetch scenarios for dropdown
  const { data: scenariosResponse } = useScenarios();
  const scenarios = scenariosResponse?.data || [];

  // Fetch current scenario if on detail page
  const { data: currentScenarioResponse } = useScenario(scenarioId);
  const currentScenario = currentScenarioResponse?.data;

  // Fetch current user data
  const { data: meResponse, isLoading: isLoadingUser } = useMe();
  const user = meResponse?.data;

  const toggleManualMode = () => {
    if (isManualMode) {
      searchParams.delete("mode");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ mode: "manual" });
      if (location.pathname !== "/dashboard/home") {
        navigate("/dashboard/home?mode=manual");
      }
    }
  };

  const handleLogout = () => {
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans selection:bg-zinc-800/50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-border bg-sidebar transition-all duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          isSidebarOpen ? "lg:w-64" : "lg:w-0 lg:border-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b border-border px-6 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:pointer-events-none"
          )}
        >
          <span className="text-sm font-bold tracking-widest text-zinc-100 uppercase whitespace-nowrap">
            Warp<span className="text-zinc-500">_OS</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-400 hover:text-zinc-200 h-8 w-8"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn(
            "flex flex-col gap-1 p-4 transition-opacity duration-300 overflow-hidden",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:pointer-events-none"
          )}
        >
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-none px-3 py-2 text-sm transition-all duration-200 ease-in-out whitespace-nowrap border",
                    isActive
                      ? "bg-sidebar text-zinc-50 border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "text-zinc-400 hover:bg-sidebar hover:text-zinc-200 border-transparent hover:border-zinc-800"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors shrink-0",
                      isActive
                        ? "text-zinc-50"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <span>{item.title}</span>
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-none bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.5)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card - Bottom of Sidebar */}
        <div
          className={cn(
            "absolute bottom-0 w-full p-2.5 border-t border-zinc-800 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:pointer-events-none"
          )}
        >
          {/* Card Container */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-none p-2.5 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-200">
            <div className="flex items-center gap-3">
              {/* Avatar - Boxy Style */}
              <div className="h-10 w-10 rounded-none bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "US"}
              </div>

              {/* User Info */}
              <div className="flex flex-col min-w-0 flex-1">
                {isLoadingUser ? (
                  <>
                    <div className="h-3 w-24 bg-zinc-700/50 rounded-none animate-pulse mb-1" />
                    <div className="h-2 w-20 bg-zinc-700/30 rounded-none animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-zinc-100 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">
                      {user?.email || "No email"}
                    </p>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex-shrink-0 p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded-none transition-all duration-200"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col min-w-0 bg-background no-scrollbar">
        {/* Top Header */}
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isManualMode={isManualMode}
          onToggleManualMode={toggleManualMode}
          currentPath={location.pathname}
          scenarios={scenarios}
          currentScenario={currentScenario}
          currentScenarioId={scenarioId}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <div
            className={cn(
              "animate-in fade-in slide-in-from-bottom-2 duration-500 w-full h-full"
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
