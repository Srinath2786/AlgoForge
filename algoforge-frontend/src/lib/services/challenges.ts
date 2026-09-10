// AlgoForge does not have a backend endpoint for scheduling a "problem of
// the day" per weekday, so this schedule is kept client-side (localStorage)
// and shared by every page that needs it (Problems, Problem Detail,
// Dashboard, and the admin Challenges console). If a backend endpoint is
// added later, swap the two functions below for real API calls — every
// consumer of this module only touches getSchedule/setDayProblem/getToday,
// so the call sites elsewhere never need to change.

const STORAGE_KEY = "algoforge_weekly_challenge_schedule";

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LABELS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekSchedule = Record<number, number | null>; // 0 (Sun) .. 6 (Sat) -> problemId

function emptySchedule(): WeekSchedule {
  return { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
}

export function getSchedule(): WeekSchedule {
  if (typeof window === "undefined") return emptySchedule();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySchedule();
    const parsed = JSON.parse(raw);
    return { ...emptySchedule(), ...parsed };
  } catch {
    return emptySchedule();
  }
}

export function setDayProblem(day: number, problemId: number | null) {
  const current = getSchedule();
  current[day] = problemId;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("algoforge:schedule-changed"));
  return current;
}

export function clearSchedule() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("algoforge:schedule-changed"));
}

export function getTodayIndex() {
  return new Date().getDay(); // 0 = Sunday .. 6 = Saturday
}

export function getWeekStart(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - now.getDay());
  return now;
}

export function getDateForDay(day: number): Date {
  const start = getWeekStart();
  const d = new Date(start);
  d.setDate(start.getDate() + day);
  return d;
}
