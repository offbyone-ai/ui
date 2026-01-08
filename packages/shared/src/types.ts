// Analytics event types
export interface AnalyticsEvent {
	type: "view" | "download";
	componentName: string;
	timestamp: number;
	metadata?: Record<string, unknown>;
}

export interface ViewEvent extends AnalyticsEvent {
	type: "view";
	referrer?: string;
}

export interface DownloadEvent extends AnalyticsEvent {
	type: "download";
	cliVersion?: string;
}

// Registry types (complement shadcn schemas)
export interface RegistryComponent {
	name: string;
	type: RegistryItemType;
	title: string;
	description: string;
	dependencies?: string[];
	registryDependencies?: string[];
	files: RegistryFile[];
	categories?: string[];
}

export interface RegistryFile {
	path: string;
	type: RegistryFileType;
	target?: string;
}

export type RegistryItemType =
	| "registry:block"
	| "registry:component"
	| "registry:lib"
	| "registry:hook"
	| "registry:ui"
	| "registry:page"
	| "registry:file"
	| "registry:style"
	| "registry:theme"
	| "registry:item";

export type RegistryFileType =
	| "registry:component"
	| "registry:lib"
	| "registry:hook"
	| "registry:ui"
	| "registry:page"
	| "registry:file";

// API response types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface AnalyticsStats {
	totalViews: number;
	totalDownloads: number;
	componentStats: ComponentStat[];
}

export interface ComponentStat {
	name: string;
	views: number;
	downloads: number;
}
