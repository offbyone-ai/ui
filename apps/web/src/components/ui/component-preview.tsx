import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
	children: ReactNode;
	className?: string;
}

export function ComponentPreview({ children, className }: ComponentPreviewProps) {
	return (
		<div
			className={cn(
				"flex min-h-[150px] w-full items-center justify-center rounded-md border bg-background p-10",
				className
			)}
		>
			{children}
		</div>
	);
}
