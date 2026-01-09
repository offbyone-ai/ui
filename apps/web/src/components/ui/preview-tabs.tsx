import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";
import { ComponentPreview } from "./component-preview";
import { CopyButton } from "./copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface PreviewTabsProps {
	children: ReactNode;
	code: string;
	className?: string;
}

export function PreviewTabs({ children, code, className }: PreviewTabsProps) {
	return (
		<Tabs defaultValue="preview" className={cn("relative w-full", className)}>
			<TabsList className="mb-4">
				<TabsTrigger value="preview">Preview</TabsTrigger>
				<TabsTrigger value="code">Code</TabsTrigger>
			</TabsList>
			<TabsContent value="preview">
				<ComponentPreview>{children}</ComponentPreview>
			</TabsContent>
			<TabsContent value="code" className="relative">
				<div className="absolute right-4 top-4 z-10">
					<CopyButton value={code} />
				</div>
				<CodeBlock code={code} />
			</TabsContent>
		</Tabs>
	);
}

export default PreviewTabs;
