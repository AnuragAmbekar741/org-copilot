import React from "react";
import { Label } from "@/components/ui/label";
import { type UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  variant?: "underline" | "boxed";
};

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  register,
  error,
  options,
  className = "",
  variant = "underline",
}) => {
  const baseSelectClasses =
    variant === "underline"
      ? "bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus:outline-none focus:border-white px-0 h-12 text-sm text-zinc-200 w-full transition-colors"
      : "bg-transparent border-zinc-800 border rounded-none focus:outline-none focus:border-white px-2 h-8 text-sm text-zinc-200 w-full transition-colors";

  return (
    <div className={`space-y-2 group ${className}`}>
      <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
        {label}
      </Label>
      <select {...register} className={baseSelectClasses}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
