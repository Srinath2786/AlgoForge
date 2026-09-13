import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  Loader2,
  MemoryStick,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { submissionService } from "@/lib/services/submissions";
import { problemService } from "@/lib/services/problems";
import { cn } from "@/lib/utils";

function statusMeta(status: string) {
  if (status === "ACCEPTED") return { color: "text-cyan", bg: "border-cyan/25 bg-cyan/10", icon: CheckCircle2 };
  if (status === "RUNNING" || status === "PENDING") return { color: "text-amber", bg: "border-amber/25 bg-amber/10", icon: Clock };
  return { color: "text-danger", bg: "border-danger/25 bg-danger/10", icon: XCircle };
}

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const submissionQuery = useQuery({
    queryKey: ["submission", id],
    queryFn: () => submissionService.getById(id),
    enabled: !!id,
  });

  const submission = submissionQuery.data;

  const problemQuery = useQuery({
    queryKey: ["problem", submission?.problemId],
    queryFn: () => problemService.getById(submission!.problemId),
    enabled: submission?.problemId != null,
  });

  const submissionErrorMessage = (() => {
    const error = submissionQuery.error as { response?: { status?: number; data?: { message?: string } }; message?: string } | null;

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return "Your session expired or this submission is not available to your account.";
    }

    if (error?.response?.status === 404) {
      return "This submission was not found or it does not belong to your account.";
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Couldn't load this submission from the backend.";
  })();

  if (submissionQuery.isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-forge" size={26} />
        </div>
      </DashboardShell>
    );
  }

  if (submissionQuery.isError || !submission) {
    return (
      <DashboardShell>
        <div className="py-20 text-center text-sm text-danger">
          {submissionErrorMessage}
        </div>
      </DashboardShell>
    );
  }

  const meta = statusMeta(submission.status);
  const problem = problemQuery.data;

  return (
    <DashboardShell>
      <Link
        to="/submissions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={14} /> Back to submissions
      </Link>

      <Card className="mt-4 overflow-hidden p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Submission #{submission.id ?? "—"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <meta.icon size={20} className={meta.color} />
              <h1 className="font-display text-2xl font-semibold">{submission.status.replace(/_/g, " ")}</h1>
            </div>
            {problem ? (
              <Link
                to={`/problems/${problem.id}`}
                className="mt-2 inline-flex text-sm font-medium text-forge hover:text-forge-hot"
              >
                {problem.title} →
              </Link>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Problem #{submission.problemId}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink-faint">
              {submission.language}
            </span>
            <Badge className={meta.bg}>{submission.status.replace(/_/g, " ")}</Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-hairline bg-surface/60 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-faint">
              <Cpu size={12} /> Runtime
            </div>
            <p className="mt-1.5 font-mono text-sm font-semibold">
              {submission.executionTimeMs != null ? `${Math.round(submission.executionTimeMs)} ms` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface/60 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-faint">
              <MemoryStick size={12} /> Memory
            </div>
            <p className="mt-1.5 font-mono text-sm font-semibold">
              {submission.memoryUsedKb != null ? `${(submission.memoryUsedKb / 1024).toFixed(1)} MB` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface/60 p-3.5 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase tracking-widest text-ink-faint">Test cases</div>
            <p className="mt-1.5 font-mono text-sm font-semibold">
              {submission.testCaseResults.filter((t) => t.status === "ACCEPTED").length} / {submission.testCaseResults.length}
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface/60 p-3.5 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase tracking-widest text-ink-faint">Submitted</div>
            <p className="mt-1.5 text-sm font-medium">{new Date(submission.submittedAt).toLocaleString()}</p>
          </div>
        </div>

        {submission.compilerOutput && (
          <div className="mt-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Compiler output</p>
            <pre className="whitespace-pre-wrap rounded-lg border border-danger/25 bg-danger/5 p-3 font-mono text-xs text-danger">
              {submission.compilerOutput}
            </pre>
          </div>
        )}

        {submission.testCaseResults.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Test case results</p>
            {submission.testCaseResults.map((tc, i) => {
              const tcMeta = statusMeta(tc.status);
              return (
                <div key={tc.testCaseId ?? i} className="rounded-xl border border-hairline bg-surface p-3.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <tcMeta.icon size={13} className={tcMeta.color} />
                    <span className={cn("font-semibold", tcMeta.color)}>
                      Case {i + 1} · {tc.status.replace(/_/g, " ")}
                    </span>
                    {tc.hidden && (
                      <span className="rounded bg-hairline-soft px-1.5 py-0.5 text-[10px] text-ink-faint">hidden</span>
                    )}
                    {tc.executionTimeMs != null && (
                      <span className="text-ink-faint">· {Math.round(tc.executionTimeMs)}ms</span>
                    )}
                  </div>
                  {tc.error && (
                    <p className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-danger">{tc.error}</p>
                  )}
                  {!tc.hidden && tc.status !== "ACCEPTED" && tc.expectedOutput != null && (
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-ink-faint">Expected</p>
                        <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-ink-muted">
                          {tc.expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-ink-faint">Got</p>
                        <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-ink-muted">
                          {tc.actualOutput || "(empty output)"}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-[11px] text-ink-faint">
          Source code isn&apos;t shown here — the submissions API doesn&apos;t return it back, only the grading
          result. Add a <code className="rounded bg-hairline-soft px-1 py-0.5">sourceCode</code> field to{" "}
          <code className="rounded bg-hairline-soft px-1 py-0.5">SubmissionResponse</code> on the backend to display
          it on this page.
        </p>
      </Card>
    </DashboardShell>
  );
}
