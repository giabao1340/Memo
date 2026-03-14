import type { ThemeState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({//key
      isDark: false,
      toggleTheme() {
        const newValue = !get().isDark;
        set({isDark: newValue})
        if (newValue) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      setTheme(dark) {
        set({ isDark: dark });
        if (dark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {//value
      name: "theme-storage",
    },
  ),
);
