import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-black/50 text-white overflow-hidden font-mono selection:bg-zinc-800 flex flex-col items-center justify-center">
      {/* Centered Grid Background - visible only in center */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-4xl lg:max-w-6xl h-full bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] opacity-40 border-x border-zinc-500/30" />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl lg:max-w-5xl 2xl:max-w-7xl mx-auto h-screen">
        {/* Tech Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-4 md:mb-16 flex items-center gap-2 border border-zinc-800 bg-black/50 px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium backdrop-blur-md"
        >
          <div className="h-1.5 w-1.5 bg-zinc-500 animate-pulse rounded-full" />
          System Active
        </motion.div>

        {/* Boxy Headline */}
        <div className="relative p-4 md:p-8">
          {/* Decorative Corners - Animated */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-700"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-700"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-700"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-700"
          />

          <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-light tracking-tighter text-white/90 leading-[0.9] uppercase">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Will You{" "}
              <span className="bg-zinc-100 text-black px-2 md:px-4">
                Make It
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-zinc-700"
            >
              Or Break It?
            </motion.div>
          </h1>
        </div>

        {/* Data Readout Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 max-w-xl lg:max-w-3xl w-full text-left"
        >
          {[
            { label: "Burn Rate", value: "Real-time Analysis" },
            { label: "Runway", value: "Scenario Modeling" },
            { label: "Status", value: "Precision Ready" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.1,
                ease: "easeOut",
              }}
              className="relative bg-black p-4 md:p-8 group cursor-pointer overflow-hidden"
            >
              {/* 1. Scanner Line Effect */}
              <motion.div
                className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-zinc-500 to-transparent opacity-0 z-20"
                initial={{ left: "-10%" }}
                whileHover={{
                  left: "120%",
                  opacity: 1,
                  transition: {
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }}
              />

              {/* 2. Background Highlight */}
              <motion.div
                className="absolute inset-0 bg-zinc-900/0"
                whileHover={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }} // zinc-950/50
                transition={{ duration: 0.2 }}
              />

              {/* 3. Tech Corners (appear on hover) */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <motion.p
                  className="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest"
                  whileHover={{ color: "rgb(161, 161, 170)" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.p>
                <motion.p
                  className="text-sm md:text-base text-zinc-400 font-light"
                  whileHover={{
                    color: "rgb(255, 255, 255)",
                    textShadow: "0 0 8px rgba(255,255,255,0.5)", // Slight glow on text
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.value}
                </motion.p>
              </div>

              {/* Status Indicator (Blinking) */}
              <motion.div
                className="absolute top-4 right-4 w-1 h-1 bg-emerald-500/0 rounded-full"
                whileHover={{ backgroundColor: "rgb(16, 185, 129)" }} // emerald-500
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Tech CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 md:mt-16"
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center focus:outline-none"
          >
            {/* Layer 1: The Deep Shadow/Base */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-[linear-gradient(45deg,#18181b_25%,transparent_25%,transparent_50%,#18181b_50%,#18181b_75%,transparent_75%,transparent_100%)] bg-[size:8px_8px] border border-zinc-800 opacity-60 transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:translate-y-2" />

            {/* Layer 2: The Solid Mid-Block */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-zinc-800 border border-zinc-700 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-zinc-700" />

            {/* Layer 3: The Main Button Face */}
            <Button
              size="lg"
              className="relative h-16 min-w-[240px] rounded-none border border-zinc-500 bg-black text-white hover:bg-zinc-100 hover:text-black hover:border-white transition-all duration-300 ease-out uppercase tracking-[0.15em] group-active:translate-x-2 group-active:translate-y-2"
            >
              <div className="flex items-center gap-4 text-xs font-bold z-10">
                <span>Know Your Numbers!</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Technical Corners */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-zinc-500 group-hover:bg-black transition-colors" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-zinc-500 group-hover:bg-black transition-colors" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-500 group-hover:border-black transition-colors" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-zinc-500 group-hover:border-black transition-colors" />
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
