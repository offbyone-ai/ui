"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggleCompact } from "@/components/ui/mode-toggle-compact";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultMode="system" defaultPreset="default">
			{children}
		</ThemeProvider>
	);
}

export { ModeToggleCompact };
