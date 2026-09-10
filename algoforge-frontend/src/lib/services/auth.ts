import { api } from "@/lib/axios";
import { ApiResponse, DashboardStats, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UpdateProfileRequest, UserProfile } from "@/types/api";

const PROFILE_STORAGE_KEY = "algoforge_profile";

const readStoredProfile = (): Partial<UserProfile> | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserProfile>) : null;
  } catch {
    return null;
  }
};

const writeStoredProfile = (profile: Partial<UserProfile>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const authService = {
  register: (payload: RegisterRequest) =>
    api
      .post<ApiResponse<RegisterResponse>>("/api/auth/register", payload)
      .then((r) => r.data.data),

  login: (payload: LoginRequest) =>
    api
      .post<ApiResponse<LoginResponse>>("/api/auth/login", payload)
      .then((r) => r.data.data),

  getCurrentUser: async (): Promise<UserProfile> => {
    const fallback = readStoredProfile();

    try {
      const response = await api.get<ApiResponse<UserProfile>>("/api/users/me");
      const profile = response.data.data;
      const merged = { ...fallback, ...profile };
      writeStoredProfile(merged);
      return merged as UserProfile;
    } catch {
      return (fallback ?? {
        id: 0,
        username: "Guest",
        email: "",
        role: "USER",
        enabled: true,
        createdAt: new Date().toISOString(),
      }) as UserProfile;
    }
  },

  getDashboardStats: () =>
    api
      .get<ApiResponse<DashboardStats>>("/api/users/me/dashboard")
      .then((r) => r.data.data),

  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const merged = { ...readStoredProfile(), ...payload } as Partial<UserProfile>;
    writeStoredProfile(merged);

    try {
      const response = await api.put<ApiResponse<UserProfile>>("/api/users/me/profile", payload);
      const profile = response.data.data;
      const next = { ...merged, ...profile };
      writeStoredProfile(next);
      return next as UserProfile;
    } catch {
      return merged as UserProfile;
    }
  },
};
