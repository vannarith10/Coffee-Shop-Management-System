//
// stores/themeStore.ts
//
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

const initialTheme: Theme =
  localStorage.getItem("theme") === "light" ? "light" : "dark";

applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";

    applyTheme(newTheme);
    set({ theme: newTheme });
  },
}));


// --------------------------- Usages --------------------------------
// 
// const theme = useThemeStore((state) => state.theme);
// const toggleTheme = useThemeStore((state) => state.toggleTheme);
// 
// -------------------------------------------------------------------