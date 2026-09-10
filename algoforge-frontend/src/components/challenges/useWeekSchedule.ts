import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { problemService } from "@/lib/services/problems";
import { getSchedule, getTodayIndex, WeekSchedule } from "@/lib/services/challenges";
import { ProblemResponse } from "@/types/api";

export function useWeekSchedule() {
  const [schedule, setSchedule] = useState<WeekSchedule>(() => getSchedule());

  useEffect(() => {
    function refresh() {
      setSchedule(getSchedule());
    }
    window.addEventListener("algoforge:schedule-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("algoforge:schedule-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Pull a broad slice of the catalog once so day chips can resolve
  // title/difficulty for whatever problem ids are scheduled, without a
  // network round trip per day.
  const catalogQuery = useQuery({
    queryKey: ["problems-catalog-for-schedule"],
    queryFn: () => problemService.search({ size: 200, page: 0 }),
    staleTime: 60_000,
  });

  const byId = new Map<number, ProblemResponse>(
    (catalogQuery.data?.content ?? []).map((p) => [p.id, p])
  );

  const todayIndex = getTodayIndex();
  const todayProblemId = schedule[todayIndex] ?? null;
  const todayProblem = todayProblemId != null ? byId.get(todayProblemId) ?? null : null;

  return {
    schedule,
    byId,
    isLoading: catalogQuery.isLoading,
    isError: catalogQuery.isError,
    todayIndex,
    todayProblemId,
    todayProblem,
  };
}
