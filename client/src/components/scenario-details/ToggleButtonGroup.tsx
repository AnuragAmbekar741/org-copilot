import { cn } from "@/utils/cn";

export type ToggleOption<T extends string> = {
  value: T;
  label: string;
};

type ToggleButtonGroupProps<T extends string> = {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export const ToggleButtonGroup = <T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleButtonGroupProps<T>) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-zinc-800 rounded-none",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
            value === option.value
              ? "bg-zinc-800 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
