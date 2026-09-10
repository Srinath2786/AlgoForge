import { api } from "@/lib/axios";
import { CodingActivityResponse, DashboardResponse } from "@/types/api";

export const dashboardService = {
  get: () =>
    api.get<DashboardResponse>("/api/dashboard").then((r) => r.data),
  getActivity: () =>
    api.get<CodingActivityResponse>("/api/dashboard/activity").then((r) => r.data),
};
