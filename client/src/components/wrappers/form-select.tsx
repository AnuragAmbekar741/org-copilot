import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/utils/cn";

type FormSelectProps<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: FieldPath<T>;
  error?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  variant?: "underline" | "boxed";
};

export function FormSelect<T extends FieldValues>({
  label,
  control,
  name,
  error,
  options,
  className = "",
  variant = "boxed",
}: FormSelectProps<T>) {
  const triggerClasses =
    variant === "underline"
      ? "bg-transparent border-zinc-800 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-white px-0 h-16 text-sm text-zinc-200 w-full transition-colors"
      : "bg-transparent border-zinc-800 border rounded-none focus-visible:ring-0 focus-visible:border-white px-2 py-2 h-10 text-sm text-zinc-200 w-full transition-colors";

  const contentClasses = "rounded-none";
  const itemClasses = "rounded-none";

  return (
    <div className={cn("space-y-2 group", className)}>
      <Label className="text-xs uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className={triggerClasses}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className={contentClasses}>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={itemClasses}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
