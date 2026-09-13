import { create } from "zustand";

type ThemeMode = "dark" | "light";

interface ThemeState {
  mode: ThemeMode;
  hydrate: () => void;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "algoforge_theme_mode";

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.classList.toggle("light", mode === "light");
  document.documentElement.style.colorScheme = mode;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  hydrate: () => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const nextMode: ThemeMode = stored === "light" || stored === "dark" ? stored : "dark";
    applyTheme(nextMode);
    set({ mode: nextMode });
  },
  setMode: (mode) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }

    applyTheme(mode);
    set({ mode });
  },
  toggleTheme: () => {
    set((state) => {
      const nextMode: ThemeMode = state.mode === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      }
      applyTheme(nextMode);
      return { mode: nextMode };
    });
  },
}));
