import { Link } from "react-router-dom";
import { Flame, CalendarDays, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useWeekSchedule } from "./useWeekSchedule";
import { DAY_LABELS, getDateForDay } from "@/lib/services/challenges";
import { difficultyColor, cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function WeekStrip({ compact = false }: { compact?: boolean }) {
  const { schedule, byId, todayIndex } = useWeekSchedule();
  const { role } = useAuthStore();
  const isAdmin = role === "ADMIN";

  return (
    <Card className={cn("overflow-hidden", compact ? "p-4" : "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-forge/25 bg-forge/10 text-forge">
            <CalendarDays size={15} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forge">This week</p>
            <p className="font-display text-sm font-semibold">Daily &amp; weekly challenges</p>
          </div>
        </div>
        {isAdmin && (
          <Link
            to="/admin/challenges"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[11px] font-semibold text-ink-muted transition-colors hover:border-forge/40 hover:text-forge"
          >
            <Settings2 size={12} /> Manage schedule
          </Link>
        )}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAY_LABELS.map((label, day) => {
          const problemId = schedule[day];
          const problem = problemId != null ? byId.get(problemId) : null;
          const isToday = day === todayIndex;
          const date = getDateForDay(day);

          const content = (
            <div
              className={cn(
                "flex h-full flex-col items-center gap-1.5 rounded-xl border px-1.5 py-3 text-center transition-colors",
                isToday
                  ? "border-forge/40 bg-forge/10 shadow-[0_0_0_1px_rgba(255,122,61,0.15)]"
                  : "border-hairline bg-surface/50 hover:border-hairline"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isToday ? "text-forge" : "text-ink-faint"
                )}
              >
                {label}
              </span>
              <span className="font-mono text-[9px] text-ink-faint">{date.getDate()}</span>
              {isToday && <Flame size={13} className="text-forge" />}
              {problem ? (
                <>
                  <span className="line-clamp-2 text-[10px] font-medium leading-tight text-ink">
                    {problem.title}
                  </span>
                  <span
                    className={cn(
                      "mt-auto rounded-full border px-1.5 py-0.5 text-[8px] font-semibold uppercase",
                      difficultyColor(problem.difficulty)
                    )}
                  >
                    {problem.difficulty.charAt(0)}
                  </span>
                </>
              ) : (
                <span className="mt-auto text-[9px] text-ink-faint">Unassigned</span>
              )}
            </div>
          );

          return problem ? (
            <Link key={label} to={`/problems/${problem.id}`} className="block h-full">
              {content}
            </Link>
          ) : (
            <div key={label} className="h-full">
              {content}
            </div>
          );
        })}
      </div>

      {!compact && (
        <p className="mt-4 text-[11px] leading-5 text-ink-faint">
          One problem is pinned per weekday, Sunday through Saturday. Today&apos;s pick is highlighted — solve it to
          keep your streak moving.
        </p>
      )}
    </Card>
  );
}
