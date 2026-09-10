import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  username: string | null;
  token: string | null;
  role: string | null;
  userId: number | null;
  hydrated: boolean;
  setAuth: (token: string, username: string, role: string, userId: number) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  token: null,
  role: null,
  userId: null,
  hydrated: false,
  setAuth: (token, username, role, userId) => {
    Cookies.set("algoforge_token", token, { expires: 1 });
    Cookies.set("algoforge_user", username, { expires: 1 });
    Cookies.set("algoforge_role", role, { expires: 1 });
    Cookies.set("algoforge_user_id", String(userId), { expires: 1 });
    set({ token, username, role, userId });
  },
  logout: () => {
    Cookies.remove("algoforge_token");
    Cookies.remove("algoforge_user");
    Cookies.remove("algoforge_role");
    Cookies.remove("algoforge_user_id");
    set({ token: null, username: null, role: null, userId: null });
  },
  hydrate: () => {
    const token = Cookies.get("algoforge_token") ?? null;
    const username = Cookies.get("algoforge_user") ?? null;
    const role = Cookies.get("algoforge_role") ?? null;
    const userIdRaw = Cookies.get("algoforge_user_id");
    const userId = userIdRaw ? Number(userIdRaw) : null;
    set({ token, username, role, userId, hydrated: true });
  },
}));
