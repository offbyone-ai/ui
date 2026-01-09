"use client";

import { ModeToggleCompact } from "@/components/ui/mode-toggle-compact";
import { ThemeProvider } from "@/components/ui/theme-provider";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultMode="system" defaultPreset="default">
			{children}
		</ThemeProvider>
	);
}

export { ModeToggleCompact };
