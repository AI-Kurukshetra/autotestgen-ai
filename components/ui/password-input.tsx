"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pr-12", className)}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-stone-500 transition hover:text-stone-900"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
