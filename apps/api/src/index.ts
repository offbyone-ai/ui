import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { analytics } from "./routes/analytics";

const app = new Hono();

// Use Bun.env to prevent build-time inlining
const isProduction = Bun.env.NODE_ENV === "production";
const staticPath = Bun.env.STATIC_PATH || "./static";

// Middleware
app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: Bun.env.CORS_ORIGIN || "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: Date.now() });
});

// Mount API routes
app.route("/api/analytics", analytics);

// In production, serve static files from Astro build
if (isProduction) {
  // Serve static assets with explicit path handling
  app.get("/*", async (c) => {
    const path = c.req.path;

    // Try to serve the file directly first
    let filePath = `${staticPath}${path}`;

    // If path doesn't have an extension, try index.html
    if (!path.includes(".")) {
      if (path.endsWith("/")) {
        filePath = `${staticPath}${path}index.html`;
      } else {
        filePath = `${staticPath}${path}/index.html`;
      }
    }

    try {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const contentType = getContentType(filePath);
        return new Response(file, {
          headers: { "Content-Type": contentType },
        });
      }
    } catch {
      // File doesn't exist, continue to next handler
    }

    // Fallback to index.html for SPA routing
    try {
      const indexFile = Bun.file(`${staticPath}/index.html`);
      if (await indexFile.exists()) {
        return new Response(indexFile, {
          headers: { "Content-Type": "text/html" },
        });
      }
    } catch {
      // Index doesn't exist either
    }

    return c.json({ error: "Not found" }, 404);
  });
}

function getContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
  };
  return types[ext || ""] || "application/octet-stream";
}

// 404 handler for API routes
app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "Not found" }, 404);
  }
  // For non-API routes in production, try to serve index.html
  if (isProduction) {
    return c.redirect("/");
  }
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

const port = Number(Bun.env.PORT) || 3001;

console.log(`Server running on http://localhost:${port}`);
if (isProduction) {
  console.log(`Serving static files from: ${staticPath}`);
}

export default {
  port,
  fetch: app.fetch,
};
