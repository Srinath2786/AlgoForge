import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { BarChart3, CheckCircle2, Code2, Flame, History, Trophy, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CodingActivityCard } from "@/components/dashboard/CodingActivityCard";
import { ContributionHeatmap } from "@/components/dashboard/ContributionHeatmap";
import { DifficultyProgress } from "@/components/dashboard/DifficultyProgress";
import { StatCard } from "@/components/dashboard/StatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { dashboardService } from "@/lib/services/dashboard";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { SubmissionStatus } from "@/types/api";
import { WeekStrip } from "@/components/challenges/WeekStrip";

function statusClass(status: SubmissionStatus) {
  if (status === "ACCEPTED") return "border-cyan/25 bg-cyan/10 text-cyan";
  if (status === "PENDING" || status === "RUNNING") return "border-amber/25 bg-amber/10 text-amber";
  return "border-danger/25 bg-danger/10 text-danger";
}

function relativeTime(value: string) {
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { username } = useAuthStore();
  const dashboardQuery = useQuery({ queryKey: ["dashboard"], queryFn: () => dashboardService.get() });
  const activityQuery = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: () => dashboardService.getActivity(),
  });
  const data = dashboardQuery.data;
  const summary = data?.summary;
  const errorMessage = isAxiosError(dashboardQuery.error)
    ? dashboardQuery.error.response?.data?.message || dashboardQuery.error.message
    : dashboardQuery.error instanceof Error
      ? dashboardQuery.error.message
      : "We couldn't load your dashboard. Check that the backend is reachable and try again.";

  const maxLanguage = Math.max(1, ...(data?.languageUsage ?? []).map((item) => item.count));

  return (
    <DashboardShell>
      <div className="space-y-7">
        <header className="overflow-hidden rounded-[28px] border border-hairline bg-gradient-to-br from-forge/12 via-surface to-surface p-5 shadow-glass sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forge/20 bg-forge/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-forge">
                <span className="h-1.5 w-1.5 rounded-full bg-forge shadow-[0_0_8px_rgba(255,122,61,0.7)]" />
                Practice workspace
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, <span className="text-gradient-forge">{username || "coder"}</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Build consistency one accepted solution at a time. Your practice history, progress and next action are all here.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-hairline bg-elevated/70 px-3 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Rank</p>
                <p className="mt-0.5 font-display text-base font-semibold mono-num">{data?.currentRank ? `#${data.currentRank}` : "Unranked"}</p>
              </div>
              <div className="rounded-2xl border border-cyan/20 bg-cyan/10 px-3 py-2.5 text-cyan">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em]">Streak</p>
                <p className="mt-0.5 font-display text-base font-semibold mono-num">{summary?.totalProblemsSolved ? Math.max(3, Math.min(21, summary.totalProblemsSolved)) : 3}d</p>
              </div>
              <Link to="/problems"><Button variant="forge" size="sm"><Code2 size={15} /> Browse problems</Button></Link>
            </div>
          </div>
        </header>

        {dashboardQuery.isError ? (
          <ErrorState message={errorMessage} onRetry={() => dashboardQuery.refetch()} />
        ) : (
          <>
            <WeekStrip compact />

            {dashboardQuery.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ContributionHeatmap days={data?.submissionHeatmap ?? []} />
            )}

            <CodingActivityCard
              activity={activityQuery.data}
              isLoading={activityQuery.isLoading}
              isError={activityQuery.isError}
              onRetry={() => activityQuery.refetch()}
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Problems solved" value={summary?.totalProblemsSolved ?? 0} hint="all time" icon={CheckCircle2} tone="cyan" />
              <StatCard label="Acceptance rate" value={`${summary?.successRate ?? 0}%`} hint={`${summary?.acceptedSubmissions ?? 0} accepted`} icon={TrendingUp} tone="forge" />
              <StatCard label="Total submissions" value={summary?.totalSubmissions ?? 0} hint="all time" icon={History} tone="amber" />
              <StatCard label="Current rank" value={data?.currentRank ? `#${data.currentRank}` : "—"} hint="leaderboard" icon={Trophy} tone="violet" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
              <DifficultyProgress easy={summary?.easyProblemsSolved ?? 0} medium={summary?.mediumProblemsSolved ?? 0} hard={summary?.hardProblemsSolved ?? 0} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-hairline px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="font-display text-base font-semibold">Recent submissions</h2>
                    <p className="mt-0.5 text-xs text-ink-faint">Your latest judge activity</p>
                  </div>
                  <Link to="/submissions" className="text-xs font-semibold text-forge hover:text-forge-hot">View all</Link>
                </div>
                {dashboardQuery.isLoading ? (
                  <div className="space-y-3 p-5 sm:p-6">
                    {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-12 w-full" />)}
                  </div>
                ) : (data?.recentSubmissions ?? []).length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-surface text-ink-faint"><Code2 size={17} /></div>
                    <p className="mt-4 text-sm font-medium">No submissions yet</p>
                    <p className="mt-1 text-xs text-ink-faint">Your first accepted solution is one problem away.</p>
                    <Link to="/problems"><Button variant="outline" size="sm" className="mt-4">Explore problems</Button></Link>
                  </div>
                ) : (
                  <div className="divide-y divide-hairline">
                    {(data?.recentSubmissions ?? []).slice(0, 6).map((submission) => (
                      <Link key={submission.submissionId} to={`/problems/${submission.problemId}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/70 sm:px-6">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", submission.status === "ACCEPTED" ? "border-cyan/20 bg-cyan/10 text-cyan" : "border-hairline bg-surface text-ink-faint")}>
                          {submission.status === "ACCEPTED" ? <CheckCircle2 size={16} /> : <History size={16} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium group-hover:text-forge">{submission.problemTitle}</p>
                          <p className="mt-0.5 text-[11px] text-ink-faint">{submission.language} · {submission.executionTimeMs != null ? `${submission.executionTimeMs} ms` : "runtime pending"}</p>
                        </div>
                        <div className="hidden text-right sm:block">
                          <Badge className={statusClass(submission.status)}>{submission.status.replace(/_/g, " ")}</Badge>
                          <p className="mt-1 text-[10px] text-ink-faint">{relativeTime(submission.submittedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-base font-semibold">Language activity</h2>
                    <p className="mt-1 text-xs text-ink-faint">Where you spend your practice time</p>
                  </div>
                  <BarChart3 size={17} className="text-ink-faint" />
                </div>
                <div className="mt-6 space-y-5">
                  {dashboardQuery.isLoading ? (
                    [1, 2, 3].map((item) => <Skeleton key={item} className="h-8 w-full" />)
                  ) : (data?.languageUsage ?? []).length === 0 ? (
                    <p className="rounded-xl border border-dashed border-hairline p-5 text-center text-xs text-ink-faint">Language activity appears after you submit code.</p>
                  ) : (
                    (data?.languageUsage ?? []).slice(0, 6).map((item) => (
                      <div key={item.language}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium">{item.language}</span>
                          <span className="font-mono text-ink-muted">{item.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                          <div className="h-full rounded-full bg-forge" style={{ width: `${Math.max(4, (item.count / maxLanguage) * 100)}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-7 rounded-xl border border-hairline bg-surface/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold"><Flame size={14} className="text-forge" /> Consistency beats intensity</div>
                  <p className="mt-1.5 text-[11px] leading-5 text-ink-faint">Aim for one meaningful problem every day. Your heatmap records the habit.</p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
