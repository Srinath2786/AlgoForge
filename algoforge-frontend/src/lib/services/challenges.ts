import { api } from "@/lib/axios";
import type { ApiResponse, ProblemResponse } from "@/types/api";

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LABELS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type WeekSchedule = Record<number, number | null>;

export function emptySchedule(): WeekSchedule {
  return { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
}

export interface WeeklyChallengeResponse { dayOfWeek: number; problem: ProblemResponse; }

export const challengeService = {
  getSchedule: () => api.get<ApiResponse<WeeklyChallengeResponse[]>>("/api/challenges/weekly")
    .then((response) => response.data.data),
  assign: (day: number, problemId: number) => api.put<WeeklyChallengeResponse>(
    `/api/challenges/weekly/${day}`, { problemId }
  ).then(() => undefined),
  clear: (day: number) => api.delete(`/api/challenges/weekly/${day}`).then(() => undefined),
};

export function getTodayIndex() { return new Date().getDay(); }

export function getWeekStart(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - now.getDay());
  return now;
}

export function getDateForDay(day: number): Date {
  const start = getWeekStart();
  const date = new Date(start);
  date.setDate(start.getDate() + day);
  return date;
}
