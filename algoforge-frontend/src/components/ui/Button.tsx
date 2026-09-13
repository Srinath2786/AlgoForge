import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "forge" | "outline" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "forge", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "focus-ring inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[0.01em] transition-all duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variant === "forge" &&
            "bg-gradient-to-r from-forge via-orange-400 to-forge-hot text-void shadow-[0_14px_32px_rgba(255,122,61,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(255,122,61,0.36)] active:translate-y-0",
          variant === "cyan" &&
            "bg-gradient-to-r from-cyan to-teal-300 text-void shadow-[0_14px_28px_rgba(69,217,199,0.22)] hover:-translate-y-0.5 active:translate-y-0",
          variant === "outline" &&
            "border border-white/10 bg-white/60 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-forge/45 hover:text-forge hover:bg-white/80 dark:bg-surface/60 dark:text-ink dark:hover:bg-surface",
          variant === "ghost" && "bg-transparent text-ink-muted hover:text-ink hover:bg-white/5",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-8 py-4 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
