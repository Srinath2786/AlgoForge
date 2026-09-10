import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "forge" | "cyan" | "amber" | "violet";
}

export function StatCard({ label, value, hint, icon: Icon, tone = "forge" }: Props) {
  return (
    <Card className="group p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-hairline/90">
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border",
          tone === "forge" && "border-forge/20 bg-forge/10 text-forge",
          tone === "cyan" && "border-cyan/20 bg-cyan/10 text-cyan",
          tone === "amber" && "border-amber/20 bg-amber/10 text-amber",
          tone === "violet" && "border-violet/20 bg-violet/10 text-violet"
        )}>
          <Icon size={17} />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Live</span>
      </div>
      <p className="mt-5 font-display text-2xl font-semibold tracking-tight mono-num">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">{label}</p>
        {hint && <span className="text-[10px] text-ink-faint">{hint}</span>}
      </div>
    </Card>
  );
}
