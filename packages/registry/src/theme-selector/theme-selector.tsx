"use client";

import { cn } from "@/lib/utils";
import {
	type ThemePreset,
	themePresets,
	useTheme,
} from "@/theme-provider/theme-provider";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function ThemeSelector() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const { preset: currentPreset, setPreset } = useTheme();
	const currentTheme = themePresets.find((t) => t.value === currentPreset);

	const applyThemePreview = useCallback((value: string) => {
		const root = window.document.documentElement;

		// Only toggle the data-theme attribute for preview; do not
		// modify light/dark classes so we don't change the color mode
		if (value === "default") {
			root.removeAttribute("data-theme");
		} else {
			root.setAttribute("data-theme", value);
		}
	}, []);

	const restoreTheme = useCallback(() => {
		applyThemePreview(currentPreset);
	}, [applyThemePreview, currentPreset]);

	useEffect(() => {
		if (!isOpen) {
			restoreTheme();
		}
	}, [isOpen, restoreTheme]);

	useEffect(() => {
		restoreTheme();
	}, [restoreTheme]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				<div className="grid grid-cols-2 gap-0.5">
					{currentTheme?.colors.map((color, i) => (
						<div
							key={i}
							className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10"
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
				<span className="flex-1 text-left">
					{currentTheme?.label || "Theme"}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 shrink-0 transition-transform",
						isOpen && "rotate-180"
					)}
				/>
			</button>

			{isOpen && (
				<div
					className="absolute left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
					onMouseLeave={restoreTheme}
				>
					<div className="p-1">
						{themePresets.map((t) => (
							<button
								key={t.value}
								type="button"
								onClick={() => {
									setPreset(t.value as ThemePreset);
									setIsOpen(false);
								}}
								onMouseEnter={() => applyThemePreview(t.value)}
								onMouseLeave={restoreTheme}
								onFocus={() => applyThemePreview(t.value)}
								onBlur={restoreTheme}
								className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
							>
								<div className="grid grid-cols-2 gap-0.5">
									{t.colors.map((color, i) => (
										<div
											key={i}
											className="h-2.5 w-2.5 rounded-full border border-black/10 transition-transform group-hover:scale-110 dark:border-white/10"
											style={{ backgroundColor: color }}
										/>
									))}
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span className="font-medium">{t.label}</span>
										{currentPreset === t.value && (
											<Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
										)}
									</div>
									<p className="truncate text-xs text-muted-foreground">
										{t.description}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
