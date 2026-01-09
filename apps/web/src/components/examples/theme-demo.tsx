import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ThemeSelector } from "@/components/ui/theme-selector";

export function ModeToggleDemo() {
	return (
		<ThemeProvider
			defaultMode="light"
			modeStorageKey="demo-mode"
			presetStorageKey="demo-preset"
		>
			<ModeToggle />
		</ThemeProvider>
	);
}

export function ThemeSelectorDemo() {
	return (
		<ThemeProvider
			defaultMode="light"
			modeStorageKey="demo-mode"
			presetStorageKey="demo-preset"
		>
			<div className="w-64">
				<ThemeSelector />
			</div>
		</ThemeProvider>
	);
}

export function ThemeSwitcherDemo() {
	return (
		<ThemeProvider
			defaultMode="light"
			modeStorageKey="demo-mode"
			presetStorageKey="demo-preset"
		>
			<div className="space-y-4">
				<div>
					<p className="mb-2 text-sm font-medium text-muted-foreground">
						Color Mode
					</p>
					<ModeToggle />
				</div>
				<div>
					<p className="mb-2 text-sm font-medium text-muted-foreground">
						Theme Preset
					</p>
					<div className="w-64">
						<ThemeSelector />
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}
