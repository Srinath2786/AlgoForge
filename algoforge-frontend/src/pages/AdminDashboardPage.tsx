import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Code2,
  Trophy,
  ArrowRight,
  CalendarDays,
  ListChecks,
  Crown,
  Sparkles,
  Target,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/shared/Skeleton";
import { problemService } from "@/lib/services/problems";
import { leaderboardService } from "@/lib/services/leaderboard";
import { adminService } from "@/lib/services/admin";
import { difficultyColor, cn } from "@/lib/utils";

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: "forge" | "cyan" | "amber" | "violet";
  loading?: boolean;
}) {
  const toneClass = {
    forge: "border-forge/25 bg-forge/10 text-forge",
    cyan: "border-cyan/25 bg-cyan/10 text-cyan",
    amber: "border-amber/25 bg-amber/10 text-amber",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  }[tone];

  return (
    <Card className="p-5">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", toneClass)}>
        <Icon size={18} />
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-16" />
      ) : (
        <p className="mt-1 font-display text-2xl font-semibold mono-num">{value}</p>
      )}
    </Card>
  );
}

export default function AdminDashboardPage() {
  const totalQuery = useQuery({
    queryKey: ["admin-stats", "total"],
    queryFn: () => problemService.search({ size: 1, page: 0 }),
  });
  const easyQuery = useQuery({
    queryKey: ["admin-stats", "easy"],
    queryFn: () => problemService.search({ difficulty: "EASY", size: 1, page: 0 }),
  });
  const mediumQuery = useQuery({
    queryKey: ["admin-stats", "medium"],
    queryFn: () => problemService.search({ difficulty: "MEDIUM", size: 1, page: 0 }),
  });
  const hardQuery = useQuery({
    queryKey: ["admin-stats", "hard"],
    queryFn: () => problemService.search({ difficulty: "HARD", size: 1, page: 0 }),
  });
  const leaderboardTopQuery = useQuery({
    queryKey: ["admin-stats", "leaderboard-top"],
    queryFn: () => leaderboardService.getAll({ size: 5, page: 0 }),
  });
  const recentProblemsQuery = useQuery({
    queryKey: ["admin-stats", "recent-problems"],
    queryFn: () => problemService.search({ size: 30, page: 0 }),
  });
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.getUsers,
  });

  const recentProblems = [...(recentProblemsQuery.data?.content ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const loadingCounts =
    totalQuery.isLoading || easyQuery.isLoading || mediumQuery.isLoading || hardQuery.isLoading;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-hairline bg-gradient-to-br from-forge/12 via-surface to-surface p-5 shadow-glass sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-forge/20 bg-forge/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-forge">
                <Sparkles size={12} /> Admin workspace
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Platform overview</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Live counts pulled straight from your problem catalog, submission engine, and leaderboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/problems">
                <Button variant="forge" size="sm">
                  <ListChecks size={15} /> Manage problems
                </Button>
              </Link>
              <Link to="/admin/challenges">
                <Button variant="outline" size="sm">
                  <CalendarDays size={15} /> Challenge schedule
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            icon={Code2}
            label="Total problems"
            value={totalQuery.data?.totalElements ?? 0}
            tone="forge"
            loading={loadingCounts}
          />
          <StatTile
            icon={Sparkles}
            label="Easy"
            value={easyQuery.data?.totalElements ?? 0}
            tone="cyan"
            loading={loadingCounts}
          />
          <StatTile
            icon={Target}
            label="Medium"
            value={mediumQuery.data?.totalElements ?? 0}
            tone="amber"
            loading={loadingCounts}
          />
          <StatTile
            icon={BarChart3}
            label="Hard"
            value={hardQuery.data?.totalElements ?? 0}
            tone="violet"
            loading={loadingCounts}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <h2 className="font-display text-base font-semibold">Recently added problems</h2>
                <p className="mt-0.5 text-xs text-ink-faint">Newest entries in the catalog</p>
              </div>
              <Link to="/admin/problems" className="text-xs font-semibold text-forge hover:text-forge-hot">
                View all
              </Link>
            </div>
            {recentProblemsQuery.isLoading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentProblems.length === 0 ? (
              <div className="p-10 text-center text-sm text-ink-muted">No problems yet.</div>
            ) : (
              <div className="divide-y divide-hairline">
                {recentProblems.map((p) => (
                  <Link
                    key={p.id}
                    to={`/problems/${p.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-elevated/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">
                        {p.topic || "General"} · {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={difficultyColor(p.difficulty)}>{p.difficulty}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Top of leaderboard</h2>
              <Trophy size={16} className="text-forge" />
            </div>
            <div className="mt-4 space-y-2.5">
              {leaderboardTopQuery.isLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : (leaderboardTopQuery.data?.content ?? []).length === 0 ? (
                <p className="text-xs text-ink-faint">No ranked users yet.</p>
              ) : (
                (leaderboardTopQuery.data?.content ?? []).map((entry, i) => (
                  <div
                    key={entry.userId}
                    className="flex items-center gap-3 rounded-xl border border-hairline bg-surface/60 px-3 py-2.5"
                  >
                    {i === 0 ? (
                      <Crown size={15} className="text-amber" />
                    ) : (
                      <span className="w-4 text-center font-mono text-xs text-ink-faint">{i + 1}</span>
                    )}
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">{entry.username}</p>
                    <p className="font-mono text-xs text-forge">{entry.score.toFixed(0)}</p>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/leaderboard"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-forge hover:text-forge-hot"
            >
              Full leaderboard <ArrowRight size={13} />
            </Link>

            <div className="mt-6 rounded-xl border border-hairline bg-surface/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                  <Users size={14} /> User management
                </div>
                {!usersQuery.isLoading && <span className="font-mono text-xs text-forge">{usersQuery.data?.length ?? 0} total</span>}
              </div>
              {usersQuery.isLoading ? (
                <div className="mt-3 space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : usersQuery.isError ? (
                <p className="mt-2 text-[11px] leading-5 text-rose-300">Unable to load users right now.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {(usersQuery.data ?? []).slice(0, 4).map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{user.username}</p>
                        <p className="truncate text-[10px] text-ink-faint">{user.email}</p>
                      </div>
                      <span className={cn("text-[10px] font-semibold uppercase", user.enabled ? "text-cyan" : "text-rose-300")}>
                        {user.enabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                  ))}
                  {(usersQuery.data ?? []).length === 0 && <p className="text-[11px] text-ink-faint">No users found.</p>}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
