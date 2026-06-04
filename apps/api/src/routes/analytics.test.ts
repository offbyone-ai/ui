import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { analytics } from "./analytics";

describe("Analytics API", () => {
  const app = new Hono();
  app.route("/api/analytics", analytics);

  test("POST /api/analytics/view records a view event", async () => {
    const res = await app.request("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        componentName: "button",
        timestamp: Date.now(),
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.recorded).toBe(true);
  });

  test("POST /api/analytics/download records a download event", async () => {
    const res = await app.request("/api/analytics/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        componentName: "button",
        timestamp: Date.now(),
        cliVersion: "2.1.8",
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.recorded).toBe(true);
  });

  test("GET /api/analytics/stats returns statistics", async () => {
    const res = await app.request("/api/analytics/stats");

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty("totalViews");
    expect(json.data).toHaveProperty("totalDownloads");
    expect(json.data).toHaveProperty("componentStats");
  });
});
