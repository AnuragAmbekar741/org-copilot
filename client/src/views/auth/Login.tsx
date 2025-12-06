import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./schema";
import { useLogin } from "@/hooks/useAuth";
import { Button, Input, Label } from "@/components/ui";
import { FormField } from "@/components/wrappers/form-field";

export function Login() {
  const { mutateAsync: login, isPending, failureReason } = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

  return (
    <div className="flex min-h-screen w-full bg-zinc-900 text-white font-mono selection:bg-zinc-800">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative z-10 bg-zinc-900">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 bg-zinc-500 rounded-full" />
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Welcome Back
              </span>
            </div>
            <h1 className="text-4xl font-light tracking-tighter text-white mb-2">
              Sign In
            </h1>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              Access your scenarios and manage your headcount.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {failureReason && (
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-none">
                <p className="text-xs text-red-400">
                  {failureReason instanceof Error
                    ? failureReason.message
                    : "An error occurred"}
                </p>
              </div>
            )}

            <FormField
              label="Email Address"
              register={form.register("email")}
              error={form.formState.errors.email?.message}
              placeholder="name@company.com"
              type="email"
            />

            <FormField
              label="Password"
              register={form.register("password")}
              error={form.formState.errors.password?.message}
              placeholder="••••••••"
              type="password"
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 mt-8 rounded-none bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.15em] font-medium group transition-all"
            >
              {isPending ? "Signing In..." : "Enter Dashboard"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link
              to="/signup"
              className="text-xs text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Login Visual (Efficiency) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950/80 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_100%,transparent_100%)] opacity-50" />

        <div className="relative w-96 h-96 border border-zinc-800 bg-zinc-950 backdrop-blur-sm p-8 flex flex-col justify-between animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />

          <div className="space-y-4">
            <div className="h-px w-12 bg-zinc-700" />
            <div className="text-4xl font-light text-zinc-300">
              <span className="text-white font-medium">84%</span> <br />
              <span className="text-sm text-zinc-600 uppercase tracking-widest">
                Efficiency Rating
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-32 pb-4 border-b border-zinc-800/50">
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-zinc-800 hover:bg-white transition-colors duration-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
            <BarChart3 className="h-3 w-3" />
            Live Metrics
          </div>
        </div>
      </div>
    </div>
  );
}
