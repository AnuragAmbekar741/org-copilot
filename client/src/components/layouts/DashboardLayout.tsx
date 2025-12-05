import { useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  Home,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    path: "/dashboard/home",
  },
  {
    title: "Scenarios",
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

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-800/50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-zinc-800/50 bg-zinc-900/50 transition-all duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          isSidebarOpen ? "lg:w-64" : "lg:w-0 lg:border-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b border-zinc-800/50 px-6 transition-opacity duration-300",
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
                      ? "bg-zinc-800/60 text-zinc-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
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
            "absolute bottom-0 w-full p-4 border-t border-zinc-800/50 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3 px-2 py-2 rounded-none">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-medium shrink-0">
              US
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                User Pilot
              </span>
              <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                Level 3 Clearance
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col min-w-0 bg-zinc-950/50 no-scrollbar">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-800/50 bg-zinc-900/30 px-6 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-zinc-200 h-8 w-8"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className={cn(
                "border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-wider h-9",
                isManualMode && "bg-zinc-800 text-white border-zinc-600"
              )}
              onClick={toggleManualMode}
            >
              <PenTool className="mr-2 h-3 w-3" />
              {isManualMode ? "Exit Manual Mode" : "Build Manually"}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
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
