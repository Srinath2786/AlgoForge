import { useQuery } from "@tanstack/react-query";
import { challengeService, emptySchedule, getTodayIndex, WeekSchedule } from "@/lib/services/challenges";
import { ProblemResponse } from "@/types/api";

export function useWeekSchedule() {
  const scheduleQuery = useQuery({
    queryKey: ["weekly-challenge-schedule"],
    queryFn: challengeService.getSchedule,
    staleTime: 60_000,
  });
  const schedule: WeekSchedule = emptySchedule();
  const byId = new Map<number, ProblemResponse>();
  for (const entry of scheduleQuery.data ?? []) {
    schedule[entry.dayOfWeek] = entry.problem.id;
    byId.set(entry.problem.id, entry.problem);
  }
  const todayIndex = getTodayIndex();
  const todayProblemId = schedule[todayIndex] ?? null;
  const todayProblem = todayProblemId != null ? byId.get(todayProblemId) ?? null : null;

  return {
    schedule, byId, isLoading: scheduleQuery.isLoading, isError: scheduleQuery.isError,
    todayIndex, todayProblemId, todayProblem,
  };
}
