import { api } from "@/lib/axios";
import { ApiResponse, LeaderboardDto, Page } from "@/types/api";

export const leaderboardService = {
  // Backend recomputes this automatically after every graded submission —
  // there is no manual "update leaderboard" endpoint (by design).
  getAll: (params: { page?: number; size?: number } = {}) =>
    api
      .get<ApiResponse<Page<LeaderboardDto>>>("/api/leaderboard", { params })
      .then((r) => r.data.data),
};
