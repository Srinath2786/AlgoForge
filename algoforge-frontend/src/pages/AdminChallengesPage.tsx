import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, ShieldAlert, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { problemService } from "@/lib/services/problems";
import { useWeekSchedule } from "@/components/challenges/useWeekSchedule";
import { DAY_LABELS_FULL, getDateForDay, setDayProblem } from "@/lib/services/challenges";
import { difficultyColor, cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export default function AdminChallengesPage() {
  const navigate = useNavigate();
  const { role, hydrated } = useAuthStore();
  const isAdmin = role === "ADMIN";
  const { schedule, byId } = useWeekSchedule();

  const catalogQuery = useQuery({
    queryKey: ["problems-catalog-full"],
    queryFn: () => problemService.search({ size: 200, page: 0 }),
  });

  useEffect(() => {
    if (hydrated && !isAdmin) {
      toast.error("Admin access required.");
      navigate("/dashboard");
    }
  }, [hydrated, isAdmin, navigate]);

  if (!hydrated || !isAdmin) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <ShieldAlert size={16} /> Checking access…
        </div>
      </DashboardShell>
    );
  }

  const problems = catalogQuery.data?.content ?? [];

  function handleAssign(day: number, value: string) {
    const problemId = value === "" ? null : Number(value);
    setDayProblem(day, problemId);
    toast.success(problemId ? "Challenge pinned" : "Day cleared");
  }

  return (
    <DashboardShell>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forge">Admin workspace</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Weekly challenge schedule</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Pin one problem from your catalog to each day of the week, Sunday through Saturday. The pick shows up as
          the daily challenge on Problems, the Challenges calendar, and each user&apos;s dashboard. This schedule is
          stored in your browser — reassign it here any time.
        </p>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-hairline px-5 py-4">
          <CalendarDays size={16} className="text-forge" />
          <h2 className="font-display text-base font-semibold">Sunday → Saturday</h2>
        </div>

        <div className="divide-y divide-hairline">
          {DAY_LABELS_FULL.map((label, day) => {
            const assignedId = schedule[day];
            const assignedProblem = assignedId != null ? byId.get(assignedId) : null;
            const date = getDateForDay(day);

            return (
              <div key={label} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-hairline bg-surface text-center">
                    <span className="text-[9px] font-bold uppercase text-ink-faint">{label.slice(0, 3)}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{date.getDate()}</span>
                  </div>
                  <p className="text-sm font-medium">{label}</p>
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <select
                    value={assignedId ?? ""}
                    onChange={(e) => handleAssign(day, e.target.value)}
                    className="w-full max-w-sm rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink focus:border-forge/60 focus:outline-none"
                  >
                    <option value="">— Unassigned —</option>
                    {problems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.difficulty})
                      </option>
                    ))}
                  </select>

                  {assignedProblem && (
                    <>
                      <Badge className={difficultyColor(assignedProblem.difficulty)}>
                        {assignedProblem.difficulty}
                      </Badge>
                      <button
                        onClick={() => handleAssign(day, "")}
                        className="rounded-lg border border-hairline p-1.5 text-ink-muted hover:border-danger/30 hover:text-danger"
                        aria-label={`Clear ${label}`}
                        title="Clear this day"
                      >
                        <X size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {catalogQuery.isLoading && (
        <p className="mt-3 text-xs text-ink-faint">Loading your problem catalog…</p>
      )}
      {catalogQuery.isError && (
        <p className="mt-3 text-xs text-danger">Couldn&apos;t load problems from the backend to assign.</p>
      )}
      {!catalogQuery.isLoading && problems.length === 0 && (
        <p className="mt-3 text-xs text-ink-faint">
          No problems in the catalog yet — create some from the Problems page first.
        </p>
      )}
    </DashboardShell>
  );
}
