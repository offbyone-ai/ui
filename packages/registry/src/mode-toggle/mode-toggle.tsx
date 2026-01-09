"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, themeModes } from "@/theme-provider/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
	const { mode, setMode } = useTheme();

	const icons = {
		sun: Sun,
		moon: Moon,
		monitor: Monitor,
	};

	return (
		<div className="flex gap-1 rounded-lg bg-muted p-1">
			{themeModes.map((m) => {
				const Icon = icons[m.icon];
				return (
					<button
						key={m.value}
						type="button"
						onClick={() => setMode(m.value)}
						className={cn(
							"flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
							mode === m.value
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
						title={m.label}
					>
						<Icon className="h-4 w-4" />
						<span className="hidden sm:inline">{m.label}</span>
					</button>
				);
			})}
		</div>
	);
}
