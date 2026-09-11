import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { leaderboardService } from "@/lib/services/leaderboard";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const rankTone = (rank: number | null) => {
  if (rank === 1) return "text-amber";
  if (rank === 2) return "text-slate-300";
  if (rank === 3) return "text-orange-300";
  return "text-ink-faint";
};

export default function LeaderboardPage() {
  const [page, setPage] = useState(0);
  const { username } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () => leaderboardService.getAll({ page, size: 25 }),
  });

  const entries = useMemo(() => data?.content ?? [], [data?.content]);

  const metrics = useMemo(() => {
    const averageScore =
      entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length : 0;
    const activePlayers = data?.totalElements ?? entries.length;
    const topPlayer = entries[0]?.username ?? "—";

    return { averageScore, activePlayers, topPlayer };
  }, [data?.totalElements, entries]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-hairline bg-gradient-to-br from-forge/12 via-surface to-surface p-6 shadow-glass sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forge/25 bg-forge/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-forge">
                <Sparkles size={12} /> Leaderboard
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                The arena is live.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Ranked by score, recalculated automatically after every graded submission.
              </p>
            </div>

            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Top</p>
                <p className="mt-2 truncate font-display text-lg font-semibold text-amber">{metrics.topPlayer}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Players</p>
                <p className="mt-2 font-display text-lg font-semibold mono-num">{metrics.activePlayers}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Avg</p>
                <p className="mt-2 font-display text-lg font-semibold mono-num">{metrics.averageScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </header>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-forge" size={24} />
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-sm text-danger">
              Couldn&apos;t load the leaderboard from the backend.
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center text-sm text-ink-muted">No entries yet.</div>
          ) : (
            <div className="p-4 sm:p-5">
              {page === 0 && entries.length >= 3 && (
                <div className="mb-6 grid grid-cols-3 items-end gap-3">
                  {[entries[1], entries[0], entries[2]].map((e, idx) => {
                    const podiumRank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                    const height = podiumRank === 1 ? "h-28" : podiumRank === 2 ? "h-20" : "h-16";
                    return (
                      <div key={e.userId} className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-forge/20 bg-gradient-to-br from-forge/15 to-cyan/10 text-sm font-bold text-forge">
                          {e.username.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="mt-2 max-w-[6rem] truncate text-xs font-medium">{e.username}</p>
                        <p className="font-mono text-[11px] text-forge">{e.score.toFixed(0)}</p>
                        <div
                          className={cn(
                            "mt-2 flex w-full items-start justify-center rounded-t-xl border border-b-0 pt-2",
                            height,
                            podiumRank === 1
                              ? "border-amber/30 bg-amber/10 text-amber"
                              : podiumRank === 2
                                ? "border-hairline bg-surface text-ink-faint"
                                : "border-orange-300/25 bg-orange-300/10 text-orange-300"
                          )}
                        >
                          <span className="font-display text-lg font-bold">#{podiumRank}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
                  <Trophy size={16} className="text-forge" />
                  Live rankings
                </div>
                <div className="rounded-full border border-hairline bg-surface px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                  Updated live
                </div>
              </div>

              <div className="space-y-3">
                {entries.map((e, i) => (
                  <motion.div
                    key={e.userId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 10) * 0.03 }}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all sm:px-5",
                      e.username === username
                        ? "border-forge/25 bg-forge/5 shadow-[inset_0_0_0_1px_rgba(255,122,61,0.08)]"
                        : "border-hairline bg-surface/40 hover:border-forge/20 hover:bg-elevated/35"
                    )}
                  >
                    <div className="flex w-9 shrink-0 items-center justify-center">
                      {e.rank === 1 ? (
                        <Crown size={18} className={cn("drop-shadow-[0_0_16px_rgba(255,194,75,0.5)]", rankTone(e.rank))} />
                      ) : e.rank !== null && e.rank <= 3 ? (
                        <Medal size={17} className={rankTone(e.rank)} />
                      ) : (
                        <span className="font-mono text-sm font-semibold text-ink-faint mono-num">#{e.rank ?? "—"}</span>
                      )}
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forge/20 bg-gradient-to-br from-forge/15 to-cyan/10 text-xs font-bold text-forge">
                      {e.username.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-ink">{e.username}</p>
                        {e.username === username && (
                          <span className="rounded-full border border-forge/20 bg-forge/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forge">
                            You
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-faint">
                        {e.solvedCount} solved · {e.totalSubmissions} submissions · {e.acceptanceRate.toFixed(0)}% acceptance
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">Score</p>
                        <p className="mt-0.5 font-mono text-base font-semibold text-forge mono-num">{e.score.toFixed(1)}</p>
                      </div>
                      <div className="rounded-lg border border-hairline bg-elevated/60 p-2 text-ink-faint transition-colors group-hover:text-forge">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {data && data.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={data.first}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs text-ink-faint mono-num">
              Page {data.number + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.last}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
