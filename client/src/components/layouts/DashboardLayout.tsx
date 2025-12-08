import { useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Home, FileText, Settings, PanelLeftClose, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { clearAccessToken } from "@/utils/storage";
import { DashboardHeader } from "./DashboardHeader";

const menuItems = [
  {
    title: "Create",
    icon: Home,
    path: "/dashboard/home",
  },
  {
    title: "Analyze",
    icon: FileText,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isManualMode = searchParams.get("mode") === "manual";

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
          <div className="mb-2 px-2 text-[10px] uppercase tracking-wider text-zinc-500 font-medium whitespace-nowrap">
            Main Module
          </div>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out whitespace-nowrap",
                    isActive
                      ? "bg-sidebar text-zinc-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "text-zinc-400 hover:bg-sidebar hover:text-zinc-200"
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
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.5)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div
          className={cn(
            "absolute bottom-0 w-full p-4 border-t border-border transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3 px-2 py-2 rounded-none">
            <div className="h-8 w-8 rounded-full bg-sidebar flex items-center justify-center text-xs text-zinc-400 font-medium shrink-0">
              US
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                User Pilot
              </span>
              <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                Level 3 Clearance
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 hover:bg-sidebar rounded-none"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
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
