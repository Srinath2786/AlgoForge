import { api } from "@/lib/axios";
import { UserProfile } from "@/types/api";

export const adminService = {
  getUsers: () => api.get<UserProfile[]>("/api/users").then((response) => response.data),
};
