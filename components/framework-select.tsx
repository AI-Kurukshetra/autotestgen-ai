"use client";

import { cn } from "@/lib/utils";

type FrameworkSelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export function FrameworkSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: FrameworkSelectProps<T>) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-stone-500">
        Select {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                active
                  ? "border-black/10 bg-white text-stone-700 hover:bg-white "
                  : "border-white-10 text-white",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
