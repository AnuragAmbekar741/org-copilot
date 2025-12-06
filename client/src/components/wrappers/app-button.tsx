import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";

const appButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border-zinc-700 text-zinc-300 uppercase tracking-wider h-10 px-6 hover:!bg-zinc-950 hover:!text-white hover:!border-zinc-600 dark:hover:!bg-zinc-950 dark:hover:!text-white dark:hover:!border-zinc-600 active:!bg-zinc-800",
        outline:
          "w-full h-12 bg-white text-zinc-950 border border-zinc-950 uppercase tracking-[0.15em] hover:!bg-zinc-200 hover:!text-zinc-950 [&:hover]:!border-zinc-950",
      },
      isActive: {
        true: "bg-zinc-800 text-white border-zinc-600 shadow-sm",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isActive: false,
    },
  }
);

type AppButtonProps = {
  label: string;
  icon?: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "default" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
} & VariantProps<typeof appButtonVariants>;

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  icon: Icon,
  isActive = false,
  onClick,
  variant = "default",
  type = "button",
  disabled = false,
  className = "",
}) => {
  // For default variant, use base Button's outline variant
  // For outline variant, use ghost to avoid conflicting hover styles
  const buttonVariant = variant === "default" ? "outline" : "ghost";
  const buttonSize = variant === "default" ? "sm" : undefined;

  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(appButtonVariants({ variant, isActive }), className)}
    >
      {Icon && (
        <Icon className="mr-2 h-4 w-4 transition-transform duration-200" />
      )}
      {label}
    </Button>
  );
};
