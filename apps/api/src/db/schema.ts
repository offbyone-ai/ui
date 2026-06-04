import { Database } from "bun:sqlite";

const DB_PATH = Bun.env.DATABASE_PATH || "./analytics.db";

export const db = new Database(DB_PATH, { create: true });

// Initialize schema
db.run(`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('view', 'download')),
    component_name TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    referrer TEXT,
    cli_version TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_events_component ON analytics_events(component_name)
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(type)
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_events_timestamp ON analytics_events(timestamp)
`);

export interface AnalyticsEventRow {
  id: number;
  type: "view" | "download";
  component_name: string;
  timestamp: number;
  referrer: string | null;
  cli_version: string | null;
  metadata: string | null;
  created_at: string;
}

export function insertEvent(event: {
  type: "view" | "download";
  componentName: string;
  timestamp: number;
  referrer?: string;
  cliVersion?: string;
  metadata?: Record<string, unknown>;
}) {
  const stmt = db.prepare(`
    INSERT INTO analytics_events (type, component_name, timestamp, referrer, cli_version, metadata)
    VALUES ($type, $componentName, $timestamp, $referrer, $cliVersion, $metadata)
  `);

  stmt.run({
    $type: event.type,
    $componentName: event.componentName,
    $timestamp: event.timestamp,
    $referrer: event.referrer || null,
    $cliVersion: event.cliVersion || null,
    $metadata: event.metadata ? JSON.stringify(event.metadata) : null,
  });
}

export function getStats() {
  const totalViews =
    db
      .query<{ count: number }, []>(
        "SELECT COUNT(*) as count FROM analytics_events WHERE type = 'view'"
      )
      .get()?.count ?? 0;

  const totalDownloads =
    db
      .query<{ count: number }, []>(
        "SELECT COUNT(*) as count FROM analytics_events WHERE type = 'download'"
      )
      .get()?.count ?? 0;

  const componentStats = db
    .query<{ name: string; views: number; downloads: number }, []>(
      `
      SELECT
        component_name as name,
        SUM(CASE WHEN type = 'view' THEN 1 ELSE 0 END) as views,
        SUM(CASE WHEN type = 'download' THEN 1 ELSE 0 END) as downloads
      FROM analytics_events
      GROUP BY component_name
      ORDER BY views + downloads DESC
    `
    )
    .all();

  return {
    totalViews,
    totalDownloads,
    componentStats,
  };
}
