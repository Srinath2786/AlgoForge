import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, ChevronRight, ChevronLeft, Settings2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { problemService } from "@/lib/services/problems";
import { useAuthStore } from "@/store/auth-store";
import { difficultyColor, cn } from "@/lib/utils";
import { Difficulty } from "@/types/api";
import { WeekStrip } from "@/components/challenges/WeekStrip";

const DIFFICULTIES: (Difficulty | "ALL")[] = ["ALL", "EASY", "MEDIUM", "HARD"];

export default function ProblemsPage() {
  const { role } = useAuthStore();
  const isAdmin = role === "ADMIN";

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["problems", query, difficulty, page],
    queryFn: () =>
      problemService.search({
        search: query || undefined,
        difficulty: difficulty === "ALL" ? undefined : difficulty,
        page,
        size: 12,
      }),
  });

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Problems</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {data?.totalElements ?? 0} problems from your backend catalog.
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/admin/problems"
            className="inline-flex items-center gap-2 rounded-full border border-forge/30 bg-forge/10 px-4 py-2 text-xs font-semibold text-forge transition-colors hover:bg-forge/15"
          >
            <Settings2 size={14} /> Manage problems
          </Link>
        )}
      </div>

      <div className="mt-6">
        <WeekStrip compact />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search problems…"
            className="pl-11"
          />
        </div>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                setPage(0);
              }}
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                difficulty === d
                  ? "border-forge/40 bg-forge/10 text-forge"
                  : "border-hairline text-ink-muted hover:text-ink"
              )}
            >
              {d === "ALL" ? "All" : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-forge" size={24} />
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-sm text-danger">
              Couldn&apos;t reach the backend. Confirm it&apos;s running on
              VITE_API_BASE_URL and that Postgres is up.
            </p>
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink-muted">
            No problems match your filters.
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {data.content.map((p) => (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-elevated/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(p.tags ?? "")
                      .split(",")
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-hairline-soft px-2 py-0.5 text-[10px] text-ink-faint"
                        >
                          {t.trim()}
                        </span>
                      ))}
                  </div>
                </div>
                <Badge className={cn("shrink-0", difficultyColor(p.difficulty))}>
                  {p.difficulty}
                </Badge>
                <ChevronRight size={16} className="shrink-0 text-ink-faint" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-muted disabled:opacity-30 hover:text-ink"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono text-xs text-ink-faint mono-num">
            Page {data.number + 1} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-muted disabled:opacity-30 hover:text-ink"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </DashboardShell>
  );
}
