import { ArrowRight, Terminal, Users, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { signupSchema, type SignupFormValues } from "./schema";
import { useSignup } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { FormField } from "@/components/wrappers/form-field";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

export function Signup() {
  const { mutateAsync: signup, isPending, failureReason } = useSignup();
  const [activeCard, setActiveCard] = useState(0);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await signup(values);
  });

  // Cycle through active cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 2); // Cycle between 2 cards
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Stagger variants for cards
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-900 text-white font-mono selection:bg-zinc-800">
      {/* Left: Signup Form */}
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
                New Workspace
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-light tracking-tighter text-white mb-2"
            >
              Start Planning
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-500 text-sm font-light leading-relaxed"
            >
              Create an account to begin modeling your organization.
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
                label="Full Name"
                register={form.register("name")}
                error={form.formState.errors.name?.message}
                placeholder="John Doe"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
              transition={{ delay: 0.7 }}
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
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-8 rounded-none bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.15em] font-medium group transition-all"
              >
                {isPending ? "Creating..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <Link
              to="/login"
              className="text-xs text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Already have an account? Login
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right: Signup Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950/80 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-size-[2rem_2rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_100%,transparent_100%)] opacity-50" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-96 h-96 border border-zinc-800 bg-zinc-950 backdrop-blur-sm p-8 flex flex-col justify-between"
        >
          {/* Corner Accents */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />

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
                Active
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-zinc-600 uppercase tracking-widest"
              >
                Scenario Builder
              </motion.span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Users, label: "Headcount" },
              { icon: PieChart, label: "Burn Rate" },
            ].map((item, i) => {
              const isActive = i === activeCard;
              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  animate={{
                    borderColor: isActive
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(39,39,42,1)",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(39,39,42,0.4)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(255,255,255,0.8)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: { duration: 0.2 },
                  }}
                  className="p-4 bg-zinc-800/40 border border-zinc-800 transition-colors"
                >
                  <item.icon
                    className={`h-5 w-5 mb-2 transition-colors ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  />
                  <motion.div
                    animate={{
                      width: isActive ? 24 : 48,
                      backgroundColor: isActive ? "#ffffff" : "#3f3f46",
                    }}
                    className="h-1 bg-zinc-700 mb-1"
                  />
                  <div className="h-1 w-8 bg-zinc-800" />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest"
          >
            <Terminal className="h-3 w-3" />
            Headcount Ready
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
