import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-[linear-gradient(180deg,rgba(20,25,38,0.82),rgba(11,14,20,0.96))] shadow-[0_14px_42px_rgba(3,6,15,0.42)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
