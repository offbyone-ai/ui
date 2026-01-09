import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
	defaultValue?: string;
	children: ReactNode;
	className?: string;
}

interface TabsListProps {
	children: ReactNode;
	className?: string;
}

interface TabsTriggerProps {
	value: string;
	children: ReactNode;
	className?: string;
}

interface TabsContentProps {
	value: string;
	children: ReactNode;
	className?: string;
}

interface TabsContextValue {
	value: string;
	setValue: (value: string) => void;
}

import { createContext, useContext } from "react";

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs components must be used within a Tabs provider");
	}
	return context;
}

export function Tabs({ defaultValue = "", children, className }: TabsProps) {
	const [value, setValue] = useState(defaultValue);

	return (
		<TabsContext.Provider value={{ value, setValue }}>
			<div className={cn("w-full", className)}>{children}</div>
		</TabsContext.Provider>
	);
}

export function TabsList({ children, className }: TabsListProps) {
	return (
		<div
			className={cn(
				"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
				className
			)}
		>
			{children}
		</div>
	);
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
	const { value: selectedValue, setValue } = useTabsContext();
	const isSelected = selectedValue === value;

	return (
		<button
			type="button"
			onClick={() => setValue(value)}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				isSelected
					? "bg-background text-foreground shadow"
					: "hover:bg-background/50 hover:text-foreground",
				className
			)}
		>
			{children}
		</button>
	);
}

export function TabsContent({ value, children, className }: TabsContentProps) {
	const { value: selectedValue } = useTabsContext();

	if (selectedValue !== value) {
		return null;
	}

	return (
		<div
			className={cn(
				"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className
			)}
		>
			{children}
		</div>
	);
}
