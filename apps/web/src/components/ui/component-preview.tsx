import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ComponentPreviewProps {
	children: ReactNode;
	className?: string;
}

export function ComponentPreview({
	children,
	className,
}: ComponentPreviewProps) {
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
