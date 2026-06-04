"use client";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ModeToggleCompact() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-muted p-0.5">
      <button
        type="button"
        onClick={() => setMode("light")}
        className={cn(
          "rounded p-1.5 transition-colors",
          mode === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setMode("dark")}
        className={cn(
          "rounded p-1.5 transition-colors",
          mode === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setMode("system")}
        className={cn(
          "rounded p-1.5 transition-colors",
          mode === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="System preference"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
