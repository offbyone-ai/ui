"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemePreset =
  | "default"
  | "forest"
  | "ocean"
  | "sunset"
  | "lavender"
  | "rose";

export type ThemeMode = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultPreset?: ThemePreset;
  defaultMode?: ThemeMode;
  presetStorageKey?: string;
  modeStorageKey?: string;
};

type ThemeProviderState = {
  preset: ThemePreset;
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
};

const initialState: ThemeProviderState = {
  preset: "default",
  mode: "system",
  resolvedMode: "light",
  setPreset: () => null,
  setMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  defaultPreset = "default",
  defaultMode = "system",
  presetStorageKey = "ui-theme-preset",
  modeStorageKey = "ui-theme-mode",
}: ThemeProviderProps) {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    if (typeof window === "undefined") return defaultPreset;
    const stored = localStorage.getItem(presetStorageKey) as ThemePreset;
    return stored || defaultPreset;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    const stored = localStorage.getItem(modeStorageKey) as ThemeMode;
    return stored || defaultMode;
  });

  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">(() => {
    if (mode === "system") {
      return getSystemTheme();
    }
    return mode;
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);

    if (preset === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", preset);
    }
  }, [preset, resolvedMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setResolvedMode(getSystemTheme());

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  // Update resolved mode when mode changes
  useEffect(() => {
    if (mode === "system") {
      setResolvedMode(getSystemTheme());
    } else {
      setResolvedMode(mode);
    }
  }, [mode]);

  const value = {
    preset,
    mode,
    resolvedMode,
    setPreset: (newPreset: ThemePreset) => {
      localStorage.setItem(presetStorageKey, newPreset);
      setPresetState(newPreset);
    },
    setMode: (newMode: ThemeMode) => {
      localStorage.setItem(modeStorageKey, newMode);
      setModeState(newMode);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export type ThemeInfo = {
  value: ThemePreset;
  label: string;
  description: string;
  colors: string[];
};

export const themePresets: ThemeInfo[] = [
  {
    value: "default",
    label: "Default",
    description: "Clean and minimal design",
    colors: ["#171717", "#ffffff", "#a3a3a3", "#525252"],
  },
  {
    value: "forest",
    label: "Forest",
    description: "Bold green accents inspired by nature",
    colors: ["#1e7f5c", "#059669", "#34d399", "#6ee7b7"],
  },
  {
    value: "ocean",
    label: "Ocean",
    description: "Calm blues and aqua tones",
    colors: ["#0c4a6e", "#0284c7", "#38bdf8", "#7dd3fc"],
  },
  {
    value: "sunset",
    label: "Sunset",
    description: "Warm oranges and golden hues",
    colors: ["#ea580c", "#f59e0b", "#fbbf24", "#fcd34d"],
  },
  {
    value: "lavender",
    label: "Lavender",
    description: "Dreamy purples and soft violet tones",
    colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe"],
  },
  {
    value: "rose",
    label: "Rose",
    description: "Elegant pinks and romantic hues",
    colors: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af"],
  },
];

export const themeModes: Array<{
  value: ThemeMode;
  label: string;
  icon: "sun" | "moon" | "monitor";
}> = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];
