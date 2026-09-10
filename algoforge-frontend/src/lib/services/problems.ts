import { api } from "@/lib/axios";
import { ApiResponse, Difficulty, Page, ProblemRequest, ProblemResponse, TestCaseDto, TestCaseRequest } from "@/types/api";

export const problemService = {
  search: (params: { difficulty?: Difficulty; topic?: string; search?: string; page?: number; size?: number }) =>
    api
      .get<ApiResponse<Page<ProblemResponse>>>("/api/problems", { params })
      .then((r) => r.data.data),

  getById: (id: number | string) =>
    api.get<ProblemResponse>(`/api/problems/${id}`).then((r) => r.data),

  // Admin only (backend enforces hasRole('ADMIN'))
  create: (payload: ProblemRequest) =>
    api.post<ProblemResponse>("/api/problems", payload).then((r) => r.data),

  update: (id: number | string, payload: ProblemRequest) =>
    api.put<ProblemResponse>(`/api/problems/${id}`, payload).then((r) => r.data),

  remove: (id: number | string) => api.delete<ApiResponse<void>>(`/api/problems/${id}`),

  // Only VISIBLE (non-hidden) sample test cases — separate from the ones
  // embedded in ProblemResponse.testCases.
  getVisibleTestCases: (problemId: number | string) =>
    api
      .get<ApiResponse<TestCaseDto[]>>(`/api/problems/${problemId}/testcases`)
      .then((r) => r.data.data),

  getAllTestCases: (problemId: number | string) =>
    api.get<ApiResponse<TestCaseDto[]>>(`/api/problems/${problemId}/testcases/all`).then((r) => r.data.data),

  createTestCase: (problemId: number | string, payload: TestCaseRequest) =>
    api.post<TestCaseDto>(`/api/problems/${problemId}/testcases`, payload).then((r) => r.data),

  updateTestCase: (problemId: number | string, testCaseId: number, payload: TestCaseRequest) =>
    api.put<TestCaseDto>(`/api/problems/${problemId}/testcases/${testCaseId}`, payload).then((r) => r.data),

  deleteTestCase: (problemId: number | string, testCaseId: number) =>
    api.delete(`/api/problems/${problemId}/testcases/${testCaseId}`),
};
