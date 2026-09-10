// Types mirror the Spring Boot backend DTOs exactly (com.codingplatform.*)
// Every endpoint response is wrapped in ApiResponse<T>.

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Spring Data's Page<T> JSON shape
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-indexed
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  tokenType: string;
  username: string;
  role: "USER" | "ADMIN";
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface TestCaseDto {
  id: number | null;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string | null;
  timeLimitMs?: number | null;
}

export interface ProblemResponse {
  id: number;
  title: string;
  description: string;
  constraints?: string | null;
  examples?: string | null;
  difficulty: Difficulty;
  topic?: string | null;
  tags?: string | null;
  testCases: TestCaseDto[];
  createdAt: string;
}

export interface ProblemRequest {
  title: string;
  description: string;
  constraints?: string;
  examples?: string;
  difficulty: Difficulty;
  topic?: string;
  tags?: string;
}

export interface TestCaseRequest {
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
  timeLimitMs?: number;
}

export interface SubmissionRequest {
  problemId: number;
  language: string;
  sourceCode: string;
  /** true = "Run" (sample cases only, nothing persisted); false = "Submit" (graded + saved) */
  sampleRunOnly: boolean;
}

export interface TestCaseResultDto {
  testCaseId: number;
  hidden: boolean;
  status: string;
  expectedOutput: string | null;
  actualOutput: string | null;
  error: string | null;
  executionTimeMs: number | null;
}

export type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR";

export interface SubmissionResponse {
  id: number | null;
  problemId: number;
  language: string;
  status: SubmissionStatus;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  compilerOutput: string | null;
  testCaseResults: TestCaseResultDto[];
  submittedAt: string;
}

export interface LeaderboardDto {
  userId: number;
  username: string;
  solvedCount: number;
  totalSubmissions: number;
  acceptanceRate: number;
  score: number;
  rank: number | null;
}

export interface DashboardSummary {
  totalProblemsSolved: number;
  easyProblemsSolved: number;
  mediumProblemsSolved: number;
  hardProblemsSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  successRate: number;
}

export interface DashboardLanguageUsage {
  language: string;
  count: number;
}

export interface DashboardRecentSubmission {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  language: string;
  status: SubmissionStatus;
  executionTimeMs: number | null;
  submittedAt: string;
}

export interface DashboardHeatmapDay {
  date: string;
  count: number;
}

export interface ActivityDaySummary {
  date: string;
  label: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  problemsSolved: number;
  totalCodingActivity: number;
}

export interface ActivityWeekSummary {
  weekNumber: number;
  label: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  problemsSolved: number;
  activeDays: number;
  days: ActivityDaySummary[];
}

export interface ActivityMonthSummary {
  monthKey: string;
  label: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  problemsSolved: number;
  activeDays: number;
  weeks: ActivityWeekSummary[];
}

export interface CodingActivityResponse {
  months: ActivityMonthSummary[];
}

export interface DashboardStats {
  solvedProblems: number;
  totalSubmissions: number;
  acceptanceRate: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  rank: number | null;
  score: number;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  enabled: boolean;
  createdAt: string;
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  location?: string | null;
}

export interface UpdateProfileRequest {
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  email?: string | null;
  location?: string | null;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  languageUsage: DashboardLanguageUsage[];
  recentSubmissions: DashboardRecentSubmission[];
  submissionHeatmap: DashboardHeatmapDay[];
  currentRank: number | null;
}
