import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

export const PipelineSkeleton: React.FC = () => {
  // Generate 6 skeleton columns
  const columns = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 w-full no-scrollbar">
      <div className="flex h-full w-full hide-scrollbar">
        {columns.map((col) => (
          <div
            key={col}
            className="flex flex-col h-full border-r border-zinc-800 bg-zinc-900/50 flex-1 min-w-[280px]"
          >
            {/* Period Header Skeleton */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                  <Skeleton className="h-3 w-16 bg-zinc-800" />
                </div>
                <Skeleton className="h-2.5 w-12 bg-zinc-800" />
              </div>

              {/* Analytics Summary Skeleton */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-12 bg-zinc-800" />
                  <Skeleton className="h-2.5 w-16 bg-zinc-800" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-10 bg-zinc-800" />
                  <Skeleton className="h-2.5 w-16 bg-zinc-800" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-8 bg-zinc-800" />
                  <Skeleton className="h-2.5 w-16 bg-zinc-800" />
                </div>
                <div className="flex items-center justify-between border-t border-zinc-800 pt-1.5 mt-1.5">
                  <Skeleton className="h-2.5 w-14 bg-zinc-800" />
                  <Skeleton className="h-2.5 w-20 bg-zinc-800" />
                </div>
              </div>
            </div>

            {/* Period Content Skeleton */}
            <div className="flex-1 overflow-y-auto p-3 no-scrollbar space-y-2 min-h-0">
              {/* Revenue Section */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-800/50" />
                {/* Revenue Cards */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={`revenue-${i}`}
                    className="p-3 border border-zinc-800 bg-zinc-900/30 rounded-none"
                  >
                    <Skeleton className="h-3 w-24 mb-2 bg-zinc-800" />
                    <Skeleton className="h-2.5 w-16 bg-zinc-800" />
                  </div>
                ))}
              </div>

              {/* Cost Section */}
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-16 bg-zinc-800/50" />
                {/* Cost Cards */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`cost-${i}`}
                    className="p-3 border border-zinc-800 bg-zinc-900/30 rounded-none"
                  >
                    <Skeleton className="h-3 w-28 mb-2 bg-zinc-800" />
                    <Skeleton className="h-2.5 w-20 bg-zinc-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
