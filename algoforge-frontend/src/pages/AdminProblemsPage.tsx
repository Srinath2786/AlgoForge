import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Pencil,
  Trash2,
  ListChecks,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { problemService } from "@/lib/services/problems";
import { difficultyColor, cn } from "@/lib/utils";
import { Difficulty, ProblemRequest, ProblemResponse } from "@/types/api";

const DIFFICULTIES: (Difficulty | "ALL")[] = ["ALL", "EASY", "MEDIUM", "HARD"];

const EMPTY_DRAFT: ProblemRequest = {
  title: "",
  description: "",
  difficulty: "EASY",
  topic: "",
  tags: "",
  constraints: "",
  examples: "",
};

export default function AdminProblemsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<ProblemRequest>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-problems", query, difficulty, page],
    queryFn: () =>
      problemService.search({
        search: query || undefined,
        difficulty: difficulty === "ALL" ? undefined : difficulty,
        page,
        size: 10,
      }),
  });

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setError(null);
  }

  function openCreate() {
    resetDraft();
    setFormOpen(true);
  }

  function handleEdit(problem: ProblemResponse) {
    setEditingId(problem.id);
    setDraft({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      topic: problem.topic ?? "",
      tags: problem.tags ?? "",
      constraints: problem.constraints ?? "",
      examples: problem.examples ?? "",
    });
    setError(null);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.title.trim() || !draft.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: ProblemRequest = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        difficulty: draft.difficulty,
        topic: draft.topic?.trim() || "General",
        tags: draft.tags?.trim() || "",
        constraints: draft.constraints?.trim() || "",
        examples: draft.examples?.trim() || "",
      };

      if (editingId !== null) {
        await problemService.update(editingId, payload);
        toast.success("Problem updated");
      } else {
        await problemService.create(payload);
        toast.success("Problem created");
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-problems"] });
      await queryClient.invalidateQueries({ queryKey: ["problems"] });
      resetDraft();
      setFormOpen(false);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Couldn't save the problem.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(problemId: number) {
    if (!window.confirm("Delete this problem? This cannot be undone.")) return;

    try {
      await problemService.remove(problemId);
      await queryClient.invalidateQueries({ queryKey: ["admin-problems"] });
      await queryClient.invalidateQueries({ queryKey: ["problems"] });
      if (editingId === problemId) resetDraft();
      toast.success("Problem deleted");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Couldn't delete the problem.");
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forge">Admin workspace</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Problem management</h1>
          <p className="mt-1 text-sm text-ink-muted">{data?.totalElements ?? 0} problems in the catalog.</p>
        </div>
        <Button variant="forge" size="sm" onClick={formOpen ? () => setFormOpen(false) : openCreate}>
          <Plus size={15} /> {formOpen ? "Close form" : "Create problem"}
        </Button>
      </div>

      {formOpen && (
        <Card className="mt-6 overflow-hidden border-forge/20 bg-gradient-to-br from-forge/8 via-surface to-surface p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-semibold">
              {editingId !== null ? "Edit problem" : "Create a new problem"}
            </h2>
            {editingId !== null && (
              <Button variant="ghost" size="sm" onClick={resetDraft}>
                Clear form
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Title</label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Two Sum"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Description</label>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Describe the problem statement..."
                rows={4}
                className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-forge/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Difficulty</label>
              <select
                value={draft.difficulty}
                onChange={(e) => setDraft((d) => ({ ...d, difficulty: e.target.value as Difficulty }))}
                className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink focus:border-forge/60 focus:outline-none"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Topic</label>
              <Input
                value={draft.topic}
                onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
                placeholder="Arrays"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Tags</label>
              <Input
                value={draft.tags}
                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                placeholder="array, hash-map"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Constraints</label>
              <textarea
                value={draft.constraints}
                onChange={(e) => setDraft((d) => ({ ...d, constraints: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-forge/60 focus:outline-none"
                placeholder="1 <= n <= 10^5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Examples</label>
              <textarea
                value={draft.examples}
                onChange={(e) => setDraft((d) => ({ ...d, examples: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-forge/60 focus:outline-none"
                placeholder="Example input/output block"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <Button variant="forge" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId !== null ? "Update problem" : "Save problem"}
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
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
                difficulty === d ? "border-forge/40 bg-forge/10 text-forge" : "border-hairline text-ink-muted hover:text-ink"
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
          <div className="py-16 text-center text-sm text-danger">Couldn&apos;t reach the backend.</div>
        ) : !data || data.content.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink-muted">No problems match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Problem</th>
                  <th className="px-5 py-3 font-medium">Difficulty</th>
                  <th className="px-5 py-3 font-medium">Topic</th>
                  <th className="px-5 py-3 font-medium">Cases</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {data.content.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-elevated/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-faint">#{p.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="max-w-xs truncate font-medium">{p.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={cn("text-[10px]", difficultyColor(p.difficulty))}>{p.difficulty}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{p.topic || "—"}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-faint">{p.testCases?.length ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/problems/${p.id}`)}
                          className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-forge/30 hover:text-forge"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <Link
                          to={`/problems/${p.id}`}
                          className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-forge/30 hover:text-forge"
                          title="Manage test cases"
                        >
                          <ListChecks size={14} />
                        </Link>
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-forge/30 hover:text-forge"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg border border-hairline p-2 text-ink-muted hover:border-danger/30 hover:text-danger"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
