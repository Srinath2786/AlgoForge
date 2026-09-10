import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring w-full rounded-xl border border-hairline bg-surface/85 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:border-forge/60 focus:bg-surface",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
