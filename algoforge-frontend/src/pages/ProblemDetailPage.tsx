import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Play,
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ListChecks,
  AlertTriangle,
  BadgeCheck,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { problemService } from "@/lib/services/problems";
import { submissionService } from "@/lib/services/submissions";
import { difficultyColor, cn } from "@/lib/utils";
import { SubmissionResponse, TestCaseDto, TestCaseRequest } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";
import { DAY_LABELS_FULL, getSchedule, getTodayIndex } from "@/lib/services/challenges";

const LANGUAGES = [
  { id: "java", label: "Java", monaco: "java" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
];

const TEMPLATES: Record<string, string> = {
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // read input, solve, print output
    }
}`,
  python: `import sys

def main():
    data = sys.stdin.read().split()
    # solve here

if __name__ == "__main__":
    main()`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // read input, solve, print output
    return 0;
}`,
  javascript: `const lines = require("fs").readFileSync("/dev/stdin", "utf8").split("\\n");
// solve here`,
};

function statusMeta(status: string) {
  if (status === "ACCEPTED") return { color: "text-cyan", icon: CheckCircle2 };
  if (status === "RUNNING" || status === "PENDING") return { color: "text-amber", icon: Clock };
  return { color: "text-danger", icon: XCircle };
}

function isDockerUnavailableMessage(message?: string | null) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("docker is not reachable") ||
    normalized.includes("failed to connect to the docker api") ||
    normalized.includes("dockerdesktoplinuxengine") ||
    normalized.includes("doCKER_EXECUTION_ENABLED".toLowerCase())
  );
}

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { role } = useAuthStore();
  const isAdmin = role === "ADMIN";

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(TEMPLATES.java);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draft, setDraft] = useState<TestCaseRequest>({
    input: "",
    expectedOutput: "",
    description: "",
    hidden: false,
    timeLimitMs: 2000,
  });
  const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);
  const [savingTestCase, setSavingTestCase] = useState(false);
  const [testCaseError, setTestCaseError] = useState<string | null>(null);

  const problemQuery = useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemService.getById(id),
    enabled: !!id,
  });

  const testCasesQuery = useQuery({
    queryKey: ["testcases", id],
    queryFn: () => problemService.getVisibleTestCases(id),
    enabled: !!id,
  });

  const allTestCasesQuery = useQuery({
    queryKey: ["all-testcases", id],
    queryFn: () => problemService.getAllTestCases(id),
    enabled: !!id && isAdmin,
  });

  function resetTestCaseDraft() {
    setDraft({
      input: "",
      expectedOutput: "",
      description: "",
      hidden: false,
      timeLimitMs: 2000,
    });
    setEditingTestCaseId(null);
    setTestCaseError(null);
  }

  function handleEditTestCase(tc: TestCaseDto) {
    setEditingTestCaseId(tc.id ?? null);
    setDraft({
      input: tc.input ?? "",
      expectedOutput: tc.expectedOutput ?? "",
      description: tc.description ?? "",
      hidden: tc.hidden,
      timeLimitMs: tc.timeLimitMs ?? 2000,
    });
    setTestCaseError(null);
  }

  async function handleSaveTestCase() {
    if (!draft.input.trim() || !draft.expectedOutput.trim()) {
      setTestCaseError("Input and expected output are required.");
      return;
    }

    setSavingTestCase(true);
    setTestCaseError(null);

    try {
      if (editingTestCaseId !== null) {
        await problemService.updateTestCase(id, editingTestCaseId, draft);
      } else {
        await problemService.createTestCase(id, draft);
      }

      await queryClient.invalidateQueries({ queryKey: ["testcases", id] });
      await queryClient.invalidateQueries({ queryKey: ["all-testcases", id] });
      resetTestCaseDraft();
      toast.success(editingTestCaseId !== null ? "Test case updated" : "Test case created");
    } catch (err: any) {
      setTestCaseError(err?.response?.data?.message || "Couldn't save this test case.");
    } finally {
      setSavingTestCase(false);
    }
  }

  async function handleDeleteTestCase(testCaseId: number) {
    if (!window.confirm("Delete this test case?")) return;

    try {
      await problemService.deleteTestCase(id, testCaseId);
      await queryClient.invalidateQueries({ queryKey: ["testcases", id] });
      await queryClient.invalidateQueries({ queryKey: ["all-testcases", id] });
      if (editingTestCaseId === testCaseId) resetTestCaseDraft();
      toast.success("Test case deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't delete the test case.");
    }
  }

  function handleLanguageChange(next: string) {
    setLanguage(next);
    setCode(TEMPLATES[next] ?? "");
  }

  useEffect(() => {
    if (!isFullscreen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullscreen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  async function handleRunOrSubmit(action: "run" | "submit") {
    if (!id) return;
    setSubmitting(true);
    setLastAction(action);
    setResult(null);

    try {
      const res = await submissionService.submit({
        problemId: Number(id),
        language,
        sourceCode: code,
        sampleRunOnly: action === "run",
      });
      setResult(res);

      if (action === "submit") {
        if (res.status === "ACCEPTED") {
          toast.success("Accepted - all test cases passed");
        } else {
          toast.error(res.status.replace(/_/g, " "));
        }
        queryClient.invalidateQueries({ queryKey: ["submissions", "mine"] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard", "activity"] });
      } else {
        toast.success("Run complete");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Couldn't reach the backend. Confirm it's running and Docker is available.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const problem = problemQuery.data;
  const testCases = testCasesQuery.data ?? [];
  const allTestCases = allTestCasesQuery.data ?? [];
  const meta = result ? statusMeta(result.status) : null;
  const todayIndex = getTodayIndex();
  const challengeDay = problem
    ? Object.entries(getSchedule()).find(([, pid]) => pid === problem.id)?.[0]
    : undefined;
  const challengeDayNum = challengeDay != null ? Number(challengeDay) : null;

  if (problemQuery.isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-forge" size={26} />
        </div>
      </DashboardShell>
    );
  }

  if (problemQuery.isError || !problem) {
    return (
      <DashboardShell>
        <div className="py-20 text-center text-sm text-danger">
          Couldn&apos;t load this problem from the backend.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className={cn(
        "grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.25fr]",
        isFullscreen && "fixed inset-0 z-50 min-h-0 overflow-hidden bg-void p-4"
      )}>
        <div className={cn("space-y-6", isFullscreen && "min-h-0 overflow-y-auto pr-1")}>
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={difficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
              {challengeDayNum != null && (
                <Badge className="border-forge/30 bg-forge/10 text-forge">
                  <Flame size={11} className="mr-0.5" />
                  {challengeDayNum === todayIndex ? "Today's challenge" : `This week: ${DAY_LABELS_FULL[challengeDayNum]}`}
                </Badge>
              )}
              {(problem.tags ?? "")
                .split(",")
                .filter(Boolean)
                .map((t) => (
                  <Badge key={t} className="border-hairline text-ink-muted">
                    {t.trim()}
                  </Badge>
                ))}
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {problem.title}
            </h1>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
              {problem.description}
            </p>
          </Card>

          <Card className="p-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Examples
            </p>
            {problem.examples ? (
              <pre className="whitespace-pre-wrap rounded-xl border border-hairline bg-surface p-4 font-mono text-xs text-ink-muted">
                {problem.examples}
              </pre>
            ) : (
              <p className="text-xs text-ink-faint">No examples were provided for this problem.</p>
            )}

            <p className="mb-3 mt-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Constraints
            </p>
            {problem.constraints ? (
              <pre className="whitespace-pre-wrap rounded-xl border border-hairline bg-surface p-4 font-mono text-xs text-ink-muted">
                {problem.constraints}
              </pre>
            ) : (
              <p className="text-xs text-ink-faint">No constraints were provided.</p>
            )}
          </Card>

          <Card className="p-6">
            <p className="mb-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              <ListChecks size={12} /> Sample Test Cases ({testCases.length})
            </p>

            <div className="space-y-3">
              {testCases.length === 0 ? (
                <div className="rounded-xl border border-dashed border-hairline bg-surface/60 p-4 text-sm text-ink-muted">
                  This problem currently has no visible sample test cases.
                  Hidden judge cases can still exist behind the scenes when you submit.
                </div>
              ) : (
                testCases.slice(0, 3).map((tc, i) => (
                  <div key={tc.id ?? i} className="rounded-xl border border-hairline bg-surface p-4 font-mono text-xs">
                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-faint">
                      <BadgeCheck size={12} className="text-cyan" />
                      Sample {i + 1}
                    </div>
                    <p className="text-ink-faint">Input</p>
                    <p className="whitespace-pre-wrap text-ink">{tc.input}</p>
                    <p className="mt-3 text-ink-faint">Expected Output</p>
                    <p className="whitespace-pre-wrap text-ink">{tc.expectedOutput}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {isAdmin && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                  Admin Test Cases
                </p>
                <Button variant="forge" size="sm" onClick={resetTestCaseDraft}>
                  <Plus size={14} /> {editingTestCaseId !== null ? "Cancel" : "New"}
                </Button>
              </div>

              <div className="space-y-3 rounded-xl border border-hairline bg-surface p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-muted">Input</label>
                  <textarea
                    value={draft.input}
                    onChange={(e) => setDraft((d) => ({ ...d, input: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-hairline bg-void px-3 py-2 text-xs text-ink focus:border-forge/60 focus:outline-none"
                    placeholder="Input for this case"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-muted">Expected output</label>
                  <textarea
                    value={draft.expectedOutput}
                    onChange={(e) => setDraft((d) => ({ ...d, expectedOutput: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-hairline bg-void px-3 py-2 text-xs text-ink focus:border-forge/60 focus:outline-none"
                    placeholder="Expected output for this case"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-muted">Description</label>
                  <Input
                    value={draft.description ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDraft((d) => ({ ...d, description: e.target.value }))
                    }
                    placeholder="Optional description"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-muted">Time limit (ms)</label>
                    <Input
                      type="number"
                      min={100}
                      value={draft.timeLimitMs ?? 2000}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDraft((d) => ({ ...d, timeLimitMs: Number(e.target.value) || 2000 }))
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, hidden: !d.hidden }))}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-void px-3 py-2 text-xs text-ink-muted hover:text-ink"
                    >
                      {draft.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      {draft.hidden ? "Hidden case" : "Visible case"}
                    </button>
                  </div>
                </div>

                {testCaseError && (
                  <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                    {testCaseError}
                  </p>
                )}

                <div className="flex justify-end">
                  <Button variant="forge" size="sm" onClick={handleSaveTestCase} disabled={savingTestCase}>
                    {savingTestCase ? "Saving..." : editingTestCaseId !== null ? "Update Test Case" : "Create Test Case"}
                  </Button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                  Existing test cases ({allTestCases.length})
                </p>

                {allTestCases.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-hairline bg-surface/60 p-4 text-sm text-ink-muted">
                    No test cases yet for this problem.
                  </div>
                ) : (
                  allTestCases.map((tc) => (
                    <div key={tc.id ?? `${tc.input}-${tc.expectedOutput}`} className="rounded-xl border border-hairline bg-surface p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-faint">
                          {tc.hidden ? <EyeOff size={12} className="text-amber" /> : <Eye size={12} className="text-cyan" />}
                          {tc.hidden ? "Hidden" : "Visible"}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTestCase(tc)}
                            className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-forge/30 hover:text-forge"
                            aria-label={`Edit test case ${tc.id}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTestCase(tc.id ?? 0)}
                            className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-danger/30 hover:text-danger"
                            aria-label={`Delete test case ${tc.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-ink-faint">Input</p>
                      <pre className="mb-2 whitespace-pre-wrap text-xs text-ink">{tc.input}</pre>
                      <p className="text-ink-faint">Expected Output</p>
                      <pre className="whitespace-pre-wrap text-xs text-ink">{tc.expectedOutput}</pre>
                      {tc.description && (
                        <p className="mt-2 text-[11px] text-ink-muted">{tc.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        <Card className={cn(
          "overflow-hidden border border-hairline bg-void",
          isFullscreen && "flex min-h-0 h-full flex-col"
        )}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
            <div className="flex gap-1.5 rounded-lg border border-hairline bg-surface p-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLanguageChange(l.id)}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                    language === l.id ? "bg-forge/15 text-forge" : "text-ink-faint hover:text-ink"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen((current) => !current)}
                aria-label={isFullscreen ? "Exit fullscreen editor" : "Open fullscreen editor"}
                title={isFullscreen ? "Exit fullscreen editor (Esc)" : "Open fullscreen editor"}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunOrSubmit("run")}
                disabled={submitting}
              >
                {submitting && lastAction === "run" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                Run Code
              </Button>
              <Button
                variant="forge"
                size="sm"
                onClick={() => handleRunOrSubmit("submit")}
                disabled={submitting}
              >
                {submitting && lastAction === "submit" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UploadCloud size={14} />
                )}
                Submit Code
              </Button>
            </div>
          </div>

          <div className={isFullscreen ? "min-h-0 flex-1" : "h-[460px]"}>
            <MonacoEditor
              language={LANGUAGES.find((l) => l.id === language)?.monaco}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: "var(--font-mono)",
                padding: { top: 16 },
              }}
            />
          </div>

          <div className={cn(
            "border-t border-hairline bg-elevated/40 p-5",
            isFullscreen && "min-h-0 flex-1 overflow-auto"
          )}>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Console
            </p>

            {!result && !submitting && (
              <p className="font-mono text-xs text-ink-faint">
                Run or submit your code - it compiles and executes in a real sandboxed backend container.
              </p>
            )}

            {submitting && (
              <p className="flex items-center gap-2 font-mono text-xs text-forge">
                <Loader2 size={13} className="animate-spin" /> Compiling and running in Docker...
              </p>
            )}

            {result && !submitting && meta && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <meta.icon size={14} className={meta.color} />
                  <span className={cn("font-semibold", meta.color)}>
                    {result.status.replace(/_/g, " ")}
                  </span>
                  {result.executionTimeMs != null && (
                    <span className="text-ink-faint">
                      · {Math.round(result.executionTimeMs)}ms
                    </span>
                  )}
                </div>

                {result.compilerOutput && (
                  <pre className="whitespace-pre-wrap rounded-lg border border-danger/25 bg-danger/5 p-3 font-mono text-xs text-danger">
                    {result.compilerOutput}
                  </pre>
                )}

                {result.testCaseResults.length > 0 && (
                  <div className="space-y-1.5">
                    {result.testCaseResults.map((tc, i) => {
                      const tcMeta = statusMeta(tc.status);
                      return (
                        <div
                          key={tc.testCaseId ?? i}
                          className="rounded-lg border border-hairline bg-surface px-3 py-2"
                        >
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <tcMeta.icon size={12} className={tcMeta.color} />
                            <span className={cn("font-medium", tcMeta.color)}>
                              Case {i + 1} · {tc.status.replace(/_/g, " ")}
                            </span>
                            {tc.hidden && (
                              <span className="rounded bg-hairline-soft px-1.5 py-0.5 text-[10px] text-ink-faint">
                                hidden
                              </span>
                            )}
                          </div>
                          {tc.error && (
                            <p className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-danger">
                              {tc.error}
                            </p>
                          )}
                          {!tc.hidden && tc.status !== "ACCEPTED" && tc.actualOutput != null && (
                            <p className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-ink-faint">
                              Got: {tc.actualOutput || "(empty output)"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {result.status === "COMPILATION_ERROR" && result.testCaseResults.length === 0 && !result.compilerOutput && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber/25 bg-amber/5 p-3 text-xs text-amber">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    No output returned. If this keeps happening, make sure Docker
                    is installed and running on the machine hosting the backend
                    (execution.docker.enabled).
                  </div>
                )}

                {isDockerUnavailableMessage(result.compilerOutput) && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber/25 bg-amber/5 p-3 text-xs text-amber">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    The backend cannot reach Docker right now, so runs and submissions
                    will fail until Docker Desktop is started or
                    `DOCKER_EXECUTION_ENABLED=false` is set for API-only work.
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
