import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./schema";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui";
import { FormField } from "@/components/wrappers/form-field";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

export function Login() {
  const { mutateAsync: login, isPending, failureReason } = useLogin();
  const [activeBar, setActiveBar] = useState(0);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

  // Cycle through bars with random heights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar((prev) => (prev + 1) % 7); // Cycle through 7 bars
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Stagger variants for the right side bars
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const barVariants: Variants = {
    hidden: { height: 0 },
    show: (height: number) => ({
      height: `${height}%`,
      transition: { duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-900 text-white font-mono selection:bg-zinc-800">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative z-10 bg-zinc-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="h-2 w-2 bg-zinc-500 rounded-full" />
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Welcome Back
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-light tracking-tighter text-white mb-2"
            >
              Sign In
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-500 text-sm font-light leading-relaxed"
            >
              Access your scenarios and manage your headcount.
            </motion.p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {failureReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-red-950/20 border border-red-500/30 rounded-none"
              >
                <p className="text-xs text-red-400">
                  {failureReason instanceof Error
                    ? failureReason.message
                    : "An error occurred"}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FormField
                label="Email Address"
                register={form.register("email")}
                error={form.formState.errors.email?.message}
                placeholder="name@company.com"
                type="email"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FormField
                label="Password"
                register={form.register("password")}
                error={form.formState.errors.password?.message}
                placeholder="••••••••"
                type="password"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-8 rounded-none bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.15em] font-medium group transition-all"
              >
                {isPending ? "Signing In..." : "Enter Dashboard"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <Link
              to="/signup"
              className="text-xs text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Don't have an account? Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right: Login Visual (Efficiency) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950/80 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-size-[2rem_2rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_100%,transparent_100%)] opacity-50" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-96 h-96 border border-zinc-800 bg-zinc-950 backdrop-blur-sm p-8 flex flex-col justify-between"
        >
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />

          <div className="space-y-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-px bg-zinc-700"
            />
            <div className="text-4xl font-light text-zinc-300">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white font-medium block"
              >
                84%
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-zinc-600 uppercase tracking-widest"
              >
                Efficiency Rating
              </motion.span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex items-end gap-2 h-32 pb-4 border-b border-zinc-800/50"
          >
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => {
              const isActive = i === activeBar;
              return (
                <motion.div
                  key={i}
                  custom={h}
                  variants={barVariants}
                  animate={{
                    height: isActive ? `${h + 10}%` : `${h}%`,
                    backgroundColor: isActive ? "#ffffff" : "#27272a",
                    transition: { duration: 0.4 },
                  }}
                  whileHover={{
                    scaleY: 1.1,
                    backgroundColor: "#ffffff",
                    transition: { duration: 0.2 },
                  }}
                  className="flex-1 origin-bottom"
                />
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest"
          >
            <BarChart3 className="h-3 w-3" />
            Live Metrics
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
