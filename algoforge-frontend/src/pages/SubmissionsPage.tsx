import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { submissionService } from "@/lib/services/submissions";
import { cn } from "@/lib/utils";

function statusStyle(status?: string) {
  if (status === "ACCEPTED") return "border-cyan/30 bg-cyan/10 text-cyan";
  if (status === "PENDING" || status === "RUNNING") return "border-amber/30 bg-amber/10 text-amber";
  return "border-danger/30 bg-danger/10 text-danger";
}

function statusAccent(status?: string) {
  if (status === "ACCEPTED") return "border-cyan/20 bg-cyan/10 text-cyan";
  if (status === "PENDING" || status === "RUNNING") return "border-amber/20 bg-amber/10 text-amber";
  return "border-danger/20 bg-danger/10 text-danger";
}

export default function SubmissionsPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", "mine", page],
    queryFn: () => submissionService.getMine({ page, size: 15 }),
  });

  const submissions = data?.content ?? [];

  const metrics = useMemo(() => {
    const accepted = submissions.filter((s) => s.status === "ACCEPTED").length;
    const pending = submissions.filter((s) => s.status === "PENDING" || s.status === "RUNNING").length;
    const failed = submissions.filter((s) => s.status !== "ACCEPTED" && s.status !== "PENDING" && s.status !== "RUNNING").length;
    return { accepted, pending, failed, total: data?.totalElements ?? submissions.length };
  }, [data?.totalElements, submissions]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header className="rounded-[28px] border border-hairline bg-gradient-to-br from-cyan/10 via-surface to-surface p-6 shadow-glass sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
                <Sparkles size={12} /> Submission archive
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Judge results</h1>
              <p className="mt-2 text-sm text-ink-muted">
                {data?.totalElements ?? 0} submissions, graded by the real Docker sandbox.
              </p>
            </div>

            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Accepted</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-cyan">
                  <CheckCircle2 size={16} /> {metrics.accepted}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Queued</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-amber">
                  <Clock3 size={16} /> {metrics.pending}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Failed</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-danger">
                  <XCircle size={16} /> {metrics.failed}
                </p>
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
              Couldn&apos;t load submissions from the backend.
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-ink-muted">You haven&apos;t submitted anything yet.</p>
              <Link
                to="/problems"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forge hover:text-forge-hot"
              >
                <Code2 size={14} /> Browse problems
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {submissions.map((s, index) => (
                <Link
                  key={s.id}
                  to={`/submissions/${s.id}`}
                  className="group flex flex-col gap-4 px-4 py-4 transition-all hover:bg-elevated/60 sm:px-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold", statusAccent(s.status))}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink">Problem #{s.problemId}</p>
                        <span className="rounded-full border border-hairline bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {s.language}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-faint">
                        {new Date(s.submittedAt).toLocaleString()} · {s.executionTimeMs != null ? `${Math.round(s.executionTimeMs)} ms` : "runtime pending"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="text-left md:text-right">
                      <Badge className={cn("shrink-0", statusStyle(s.status))}>
                        {s.status.replace(/_/g, " ")}
                      </Badge>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                        {s.status === "ACCEPTED" ? "Passed" : s.status === "PENDING" || s.status === "RUNNING" ? "In queue" : "Needs fix"}
                      </p>
                    </div>
                  </div>
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
