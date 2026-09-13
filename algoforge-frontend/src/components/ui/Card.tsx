import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(20,25,38,0.9),rgba(11,14,20,0.98))] shadow-[0_14px_42px_rgba(3,6,15,0.42),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-forge/25 hover:shadow-[0_18px_46px_rgba(3,6,15,0.5)] dark:bg-[linear-gradient(180deg,rgba(20,25,38,0.9),rgba(11,14,20,0.98))] light:bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,245,252,0.96))] light:shadow-[0_14px_42px_rgba(148,163,184,0.18),inset_0_1px_0_rgba(255,255,255,0.7)]",
        className
      )}
      {...props}
    />
  );
}
