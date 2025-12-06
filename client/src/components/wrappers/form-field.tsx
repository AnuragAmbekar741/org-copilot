import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  type?: string;
  step?: string;
  className?: string;
  inputClassName?: string;
  variant?: "underline" | "boxed";
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  register,
  error,
  placeholder,
  type = "text",
  step,
  className = "",
  inputClassName = "",
  variant = "underline",
}) => {
  const baseInputClasses =
    variant === "underline"
      ? "bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-10 text-sm transition-colors placeholder:text-zinc-500"
      : "bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white px-2 py-2 h-10 text-sm transition-colors placeholder:text-zinc-500";

  return (
    <div className={`space-y-2 group ${className}`}>
      <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
        {label}
      </Label>
      <Input
        {...register}
        type={type}
        step={step}
        placeholder={placeholder}
        className={`${baseInputClasses} ${inputClassName}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
