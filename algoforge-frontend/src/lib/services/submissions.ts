import { api } from "@/lib/axios";
import { ApiResponse, Page, SubmissionRequest, SubmissionResponse } from "@/types/api";

export const submissionService = {
  // Synchronous — the backend compiles + runs in Docker and returns the
  // final graded result directly, no polling needed.
  submit: (payload: SubmissionRequest) =>
    api
      .post<ApiResponse<SubmissionResponse>>("/api/submissions", payload)
      .then((r) => r.data.data),

  getById: (submissionId: number | string) =>
    api
      .get<ApiResponse<SubmissionResponse>>(`/api/submissions/${submissionId}`)
      .then((r) => r.data.data),

  getMine: (params: { page?: number; size?: number } = {}) =>
    api
      .get<ApiResponse<Page<SubmissionResponse>>>("/api/submissions/me", { params })
      .then((r) => r.data.data),

  getSolvedProblemIds: () =>
    api.get<ApiResponse<number[]>>("/api/submissions/me/solved-problems").then((r) => r.data.data),
};
