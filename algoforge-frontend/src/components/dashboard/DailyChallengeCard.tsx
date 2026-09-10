import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  completed: boolean;
  streak: number;
}

export function DailyChallengeCard({ completed, streak }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-forge/20 bg-gradient-to-br from-forge/10 via-elevated/70 to-elevated/50 p-5 shadow-glass sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-forge/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-forge/25 bg-forge/10 text-forge">
              <Target size={19} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-forge">Daily coding goal</p>
                {completed && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-cyan">
                    <CheckCircle2 size={11} /> Completed
                  </span>
                )}
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold">Keep the streak alive</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-ink-muted">
                {completed ? "Today's coding activity is recorded. Keep going or come back tomorrow." : "Solve at least one problem today to record your daily coding activity."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-forge/20 bg-surface/50 px-3 py-2">
            <Flame size={16} className="text-forge" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-ink-faint">Current streak</p>
              <p className="font-display text-sm font-semibold mono-num">{streak} days</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="text-ink-muted">Today&apos;s progress</span>
              <span className={cn("font-semibold", completed ? "text-cyan" : "text-ink")}>{completed ? "1 / 1 complete" : "0 / 1 complete"}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className={cn("h-full rounded-full transition-all", completed ? "w-full bg-cyan" : "w-0 bg-forge")} />
            </div>
          </div>
          <Link to="/problems" className="shrink-0">
            <Button variant={completed ? "outline" : "forge"} size="sm">
              {completed ? "Practice another" : "Solve today"}
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
