export interface SavedSubmissionSnapshot {
  problemId: number;
  submissionId?: number | null;
  status: string;
  language: string;
  sourceCode: string;
  submittedAt: string;
  executionTimeMs?: number | null;
  compilerOutput?: string | null;
  testCaseResults?: Array<{ status: string; hidden?: boolean; expectedOutput?: string | null; actualOutput?: string | null; error?: string | null; executionTimeMs?: number | null }>;
}

const SOLVED_STORAGE_KEY = "algoforge:solved-problems";
const SUBMISSION_STORAGE_PREFIX = "algoforge:submission:";
const SUBMISSION_ID_STORAGE_PREFIX = "algoforge:submission-id:";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveSubmissionSnapshot(snapshot: SavedSubmissionSnapshot) {
  const problemKey = `${SUBMISSION_STORAGE_PREFIX}${snapshot.problemId}`;
  const idKey = snapshot.submissionId != null ? `${SUBMISSION_ID_STORAGE_PREFIX}${snapshot.submissionId}` : null;

  const normalizedSnapshot: SavedSubmissionSnapshot = {
    ...snapshot,
    status: snapshot.status || "PENDING",
  };

  localStorage.setItem(problemKey, JSON.stringify(normalizedSnapshot));
  if (idKey) localStorage.setItem(idKey, JSON.stringify(normalizedSnapshot));

  const solvedSet = new Set<number>(readJson<number[]>(SOLVED_STORAGE_KEY, []));
  if (normalizedSnapshot.status === "ACCEPTED") {
    solvedSet.add(normalizedSnapshot.problemId);
  }
  localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(Array.from(solvedSet).sort((a, b) => a - b)));
}

export function getSubmissionSnapshot(problemId: number | string) {
  try {
    const raw = localStorage.getItem(`${SUBMISSION_STORAGE_PREFIX}${problemId}`);
    return raw ? (JSON.parse(raw) as SavedSubmissionSnapshot) : null;
  } catch {
    return null;
  }
}

export function getSubmissionSnapshotById(submissionId: number | string) {
  try {
    const raw = localStorage.getItem(`${SUBMISSION_ID_STORAGE_PREFIX}${submissionId}`);
    return raw ? (JSON.parse(raw) as SavedSubmissionSnapshot) : null;
  } catch {
    return null;
  }
}

export function getSolvedProblemIdsLocal() {
  return readJson<number[]>(SOLVED_STORAGE_KEY, []);
}
