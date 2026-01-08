import type {
	AnalyticsStats,
	ApiResponse,
	DownloadEvent,
	ViewEvent,
} from "@offbyone/shared";
import { Hono } from "hono";
import { getStats, insertEvent } from "../db/schema";

export const analytics = new Hono();

// Track component view
analytics.post("/view", async (c) => {
	try {
		const body = await c.req.json<Omit<ViewEvent, "type">>();

		insertEvent({
			type: "view",
			componentName: body.componentName,
			timestamp: body.timestamp || Date.now(),
			referrer: body.referrer,
			metadata: body.metadata,
		});

		return c.json<ApiResponse<{ recorded: true }>>({
			success: true,
			data: { recorded: true },
		});
	} catch (error) {
		return c.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			400
		);
	}
});

// Track component download
analytics.post("/download", async (c) => {
	try {
		const body = await c.req.json<Omit<DownloadEvent, "type">>();

		insertEvent({
			type: "download",
			componentName: body.componentName,
			timestamp: body.timestamp || Date.now(),
			cliVersion: body.cliVersion,
			metadata: body.metadata,
		});

		return c.json<ApiResponse<{ recorded: true }>>({
			success: true,
			data: { recorded: true },
		});
	} catch (error) {
		return c.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			400
		);
	}
});

// Get analytics stats
analytics.get("/stats", (c) => {
	try {
		const stats = getStats();

		return c.json<ApiResponse<AnalyticsStats>>({
			success: true,
			data: stats,
		});
	} catch (error) {
		return c.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			500
		);
	}
});
