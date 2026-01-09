"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function HeaderThemeToggle() {
	const [mode, setModeState] = useState<ThemeMode>("system");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("ui-theme-mode") as ThemeMode;
		if (stored) {
			setModeState(stored);
		}
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		root.classList.remove("light", "dark");

		const resolvedMode = mode === "system" ? getSystemTheme() : mode;
		root.classList.add(resolvedMode);
		localStorage.setItem("ui-theme-mode", mode);
	}, [mode, mounted]);

	// Listen for system theme changes
	useEffect(() => {
		if (mode !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			const root = document.documentElement;
			root.classList.remove("light", "dark");
			root.classList.add(getSystemTheme());
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [mode]);

	const setMode = (newMode: ThemeMode) => {
		setModeState(newMode);
	};

	// Prevent hydration mismatch
	if (!mounted) {
		return (
			<div className="flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
				<div className="rounded p-1.5"><Sun className="h-4 w-4 text-muted-foreground" /></div>
				<div className="rounded p-1.5"><Moon className="h-4 w-4 text-muted-foreground" /></div>
				<div className="rounded p-1.5"><Monitor className="h-4 w-4 text-muted-foreground" /></div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
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
