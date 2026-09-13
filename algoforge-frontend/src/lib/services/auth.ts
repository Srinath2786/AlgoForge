import { api } from "@/lib/axios";
import { ApiResponse, DashboardStats, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UpdateProfileRequest, UserProfile } from "@/types/api";

const PROFILE_STORAGE_KEY = "algoforge_profile";

export const generateAutoProfile = (
  username: string | null | undefined,
  role: "USER" | "ADMIN" = "USER"
): Partial<UserProfile> => {
  const baseName = (username ?? "algoforge-user").trim() || "algoforge-user";
  const normalized = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "algoforge-user";
  const seed = [...normalized].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const names = ["Builder", "Optimizer", "Problem Solver", "Systems Thinker", "Code Artisan", "Debugging Strategist"];
  const locations = ["Remote", "Bengaluru", "Singapore", "New York", "Berlin", "London"];
  const focus = ["algorithmic thinking", "clean architecture", "daily practice", "performance tuning", "systems design", "hard problem solving"];
  const accentColors = ["#FF7A3D", "#45D9C7", "#8C7BFF", "#FFB84D"];

  const safeUser = normalized.replace(/-/g, " ");
  const displayName = safeUser
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "AlgoForge User";

  return {
    username: baseName,
    fullName: displayName,
    email: `${normalized.replace(/-/g, "").replace(/\s+/g, "") || "user"}@algoforge.dev`,
    bio: `I’m a ${names[seed % names.length]} focused on ${focus[seed % focus.length]} and turning steady practice into consistent wins.`,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(baseName)}`,
    website: `https://${normalized}.dev`,
    github: `https://github.com/${normalized}`,
    linkedIn: `https://linkedin.com/in/${normalized}`,
    location: locations[seed % locations.length],
    role,
  };
};

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
      const merged = {
        ...generateAutoProfile(profile?.username ?? fallback?.username ?? "algoforge-user", profile?.role ?? fallback?.role ?? "USER"),
        ...fallback,
        ...profile,
      };
      writeStoredProfile(merged);
      return merged as UserProfile;
    } catch {
      const generated = {
        ...generateAutoProfile(fallback?.username ?? "algoforge-user", fallback?.role ?? "USER"),
        ...fallback,
        id: 0,
        username: fallback?.username ?? "Guest",
        email: fallback?.email ?? "",
        role: (fallback?.role ?? "USER") as "USER" | "ADMIN",
        enabled: true,
        createdAt: new Date().toISOString(),
      } as UserProfile;
      writeStoredProfile(generated);
      return generated;
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
