import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-mono selection:bg-zinc-800 flex flex-col items-center justify-center">
      {/* Centered Grid Background - visible only in center */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-4xl lg:max-w-6xl h-full bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] opacity-20 border-x border-zinc-900/30" />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl lg:max-w-5xl 2xl:max-w-7xl mx-auto h-screen">
        {/* Tech Badge */}
        <div className="mb-16 md:mb-20 flex items-center gap-2 border border-zinc-800 bg-black/50 px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium backdrop-blur-md">
          <div className="h-1.5 w-1.5 bg-zinc-500 animate-pulse rounded-full" />
          System Active
        </div>

        {/* Boxy Headline */}
        <div className="relative p-4 md:p-8">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-700" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-700" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-700" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-700" />

          <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-light tracking-tighter text-white/90 leading-[0.9] uppercase">
            <span className="block font-thin text-zinc-600 text-lg md:text-2xl lg:text-3xl mb-4 tracking-[0.3em]">
              Scenario_Mode
            </span>
            Will You{" "}
            <span className="bg-zinc-100 text-black px-2 md:px-4">Make It</span>
            <br />
            <span className="text-zinc-700">Or Break It?</span>
          </h1>
        </div>

        {/* Data Readout Grid */}
        <div className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 max-w-xl lg:max-w-3xl w-full text-left">
          <div className="bg-black p-6 group hover:bg-zinc-950 transition-colors">
            <p className="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest">
              Burn Rate
            </p>
            <p className="text-sm md:text-base text-zinc-400 font-light group-hover:text-white transition-colors">
              Real-time Analysis
            </p>
          </div>
          <div className="bg-black p-6 group hover:bg-zinc-950 transition-colors">
            <p className="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest">
              Runway
            </p>
            <p className="text-sm md:text-base text-zinc-400 font-light group-hover:text-white transition-colors">
              Scenario Modeling
            </p>
          </div>
          <div className="bg-black p-6 group hover:bg-zinc-950 transition-colors">
            <p className="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest">
              Status
            </p>
            <p className="text-sm md:text-base text-zinc-400 font-light group-hover:text-white transition-colors">
              Precision Ready
            </p>
          </div>
        </div>

        {/* Tech CTA */}
        <div className="mt-16 md:mt-20">
          <Button
            size="lg"
            className="h-14 px-10 rounded-none border border-zinc-800 bg-transparent text-zinc-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 text-xs md:text-sm uppercase tracking-[0.15em] group"
          >
            <Terminal className="mr-3 h-4 w-4" />
            Initialize Pilot
            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
