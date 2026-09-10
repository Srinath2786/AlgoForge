import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Flame, Settings2, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useWeekSchedule } from "@/components/challenges/useWeekSchedule";
import { DAY_LABELS_FULL, getDateForDay } from "@/lib/services/challenges";
import { difficultyColor, cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export default function ChallengesPage() {
  const { schedule, byId, todayIndex, todayProblem, isLoading } = useWeekSchedule();
  const { role } = useAuthStore();
  const isAdmin = role === "ADMIN";

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Challenges</h1>
          <p className="mt-1 text-sm text-ink-muted">
            A fresh problem pinned to every day of the week, Sunday through Saturday.
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin/challenges">
            <Button variant="outline" size="sm">
              <Settings2 size={15} /> Manage schedule
            </Button>
          </Link>
        )}
      </div>

      <Card className="relative mt-6 overflow-hidden border-forge/20 bg-gradient-to-br from-forge/10 via-elevated/70 to-elevated/50 p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-forge/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-forge/25 bg-forge/10 text-forge">
              <Flame size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-forge">
                {DAY_LABELS_FULL[todayIndex]} · Today&apos;s challenge
              </p>
              {isLoading ? (
                <div className="mt-2 h-7 w-56 animate-pulse rounded-lg bg-elevated-2/70" />
              ) : todayProblem ? (
                <>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{todayProblem.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className={difficultyColor(todayProblem.difficulty)}>{todayProblem.difficulty}</Badge>
                    {todayProblem.topic && (
                      <span className="rounded-full bg-hairline-soft px-2.5 py-1 text-[11px] text-ink-faint">
                        {todayProblem.topic}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-1 font-display text-xl font-semibold">No challenge pinned for today yet</h2>
                  <p className="mt-1 max-w-md text-sm text-ink-muted">
                    {isAdmin
                      ? "Pin a problem to today from the admin schedule."
                      : "Check back soon, or pick anything from the problem catalog."}
                  </p>
                </>
              )}
            </div>
          </div>
          {todayProblem && (
            <Link to={`/problems/${todayProblem.id}`}>
              <Button variant="forge" size="md">
                Solve now <ArrowRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="mt-6 flex items-center gap-2">
        <CalendarDays size={16} className="text-ink-faint" />
        <h2 className="font-display text-base font-semibold">Full week</h2>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DAY_LABELS_FULL.map((label, day) => {
          const problemId = schedule[day];
          const problem = problemId != null ? byId.get(problemId) : null;
          const isToday = day === todayIndex;
          const date = getDateForDay(day);

          return (
            <Card
              key={label}
              className={cn(
                "flex flex-col gap-3 p-4",
                isToday && "border-forge/40 shadow-[0_0_0_1px_rgba(255,122,61,0.15)]"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-xs font-semibold", isToday ? "text-forge" : "text-ink")}>{label}</p>
                  <p className="font-mono text-[10px] text-ink-faint">
                    {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
                {isToday && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-forge/25 bg-forge/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-forge">
                    <Sparkles size={10} /> Today
                  </span>
                )}
              </div>

              {problem ? (
                <>
                  <p className="line-clamp-2 text-sm font-medium">{problem.title}</p>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <Badge className={cn("text-[10px]", difficultyColor(problem.difficulty))}>
                      {problem.difficulty}
                    </Badge>
                    <Link
                      to={`/problems/${problem.id}`}
                      className="text-[11px] font-semibold text-forge hover:text-forge-hot"
                    >
                      Solve →
                    </Link>
                  </div>
                </>
              ) : (
                <p className="mt-auto text-xs text-ink-faint">Unassigned</p>
              )}
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
