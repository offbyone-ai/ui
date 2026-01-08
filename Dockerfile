# syntax=docker/dockerfile:1

# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/registry/package.json ./packages/registry/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the web app, API, and registry
RUN bun run build && bun run registry:build

# Production stage
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built assets
COPY --from=builder /app/apps/web/dist ./static
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create data directory for SQLite
RUN mkdir -p /app/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/analytics.db
ENV STATIC_PATH=./static

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --eval "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["bun", "run", "dist/index.js"]
