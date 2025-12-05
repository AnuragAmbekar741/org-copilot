import { ArrowRight, Terminal, Users, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { signupSchema, type SignupFormValues } from "./schema";
import { useSignup } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "@/components/ui";

export function Signup() {
  const { mutateAsync: signup, isPending } = useSignup();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await signup(values);
  });

  return (
    <div className="flex min-h-screen w-full bg-black text-white font-mono selection:bg-zinc-800">
      {/* Left: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 border-r border-zinc-900 relative z-10 bg-black">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 bg-zinc-500 rounded-full" />
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                New Workspace
              </span>
            </div>
            <h1 className="text-4xl font-light tracking-tighter text-white mb-2">
              Start Planning
            </h1>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              Create an account to begin modeling your organization.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
                Full Name
              </Label>
              <Input
                {...form.register("name")}
                className="bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-12 text-sm transition-colors placeholder:text-zinc-800"
                placeholder="John Doe"
              />
              <p className="text-xs text-red-400">
                {form.formState.errors.name?.message}
              </p>
            </div>

            <div className="space-y-2 group">
              <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
                Email Address
              </Label>
              <Input
                {...form.register("email")}
                className="bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-12 text-sm transition-colors placeholder:text-zinc-800"
                placeholder="name@company.com"
                type="email"
              />
              <p className="text-xs text-red-400">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div className="space-y-2 group">
              <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
                Password
              </Label>
              <Input
                {...form.register("password")}
                className="bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-12 text-sm transition-colors placeholder:text-zinc-800"
                type="password"
                placeholder="••••••••"
              />
              <p className="text-xs text-red-400">
                {form.formState.errors.password?.message}
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 mt-8 rounded-none bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.15em] font-medium group transition-all"
            >
              {isPending ? "Creating..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-xs text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Signup Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_100%,transparent_100%)] opacity-50" />

        <div className="relative w-96 h-96 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm p-8 flex flex-col justify-between animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />

          <div className="space-y-4">
            <div className="h-px w-12 bg-zinc-700" />
            <div className="text-4xl font-light text-zinc-300">
              <span className="text-white font-medium">Active</span> <br />
              <span className="text-sm text-zinc-600 uppercase tracking-widest">
                Scenario Builder
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-zinc-800">
              <Users className="h-5 w-5 text-zinc-400 mb-2" />
              <div className="h-1 w-12 bg-zinc-700 mb-1" />
              <div className="h-1 w-8 bg-zinc-800" />
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800">
              <PieChart className="h-5 w-5 text-zinc-400 mb-2" />
              <div className="h-1 w-12 bg-zinc-700 mb-1" />
              <div className="h-1 w-8 bg-zinc-800" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
            <Terminal className="h-3 w-3" />
            Headcount Ready
          </div>
        </div>
      </div>
    </div>
  );
}
