#!/bin/bash
# Setup script to migrate existing server to Caddy reverse proxy
# Run this once on the server: bash setup-caddy.sh

set -e

echo "=== Setting up Caddy reverse proxy ==="

# Create shared Docker network (if not exists)
echo "Creating 'web' Docker network..."
docker network create web 2>/dev/null || echo "Network 'web' already exists"

# Create Caddy directory
echo "Setting up Caddy..."
mkdir -p /opt/caddy

# Create Caddyfile
cat > /opt/caddy/Caddyfile << 'EOF'
# Off By One Caddy Configuration
# Add new sites by adding blocks below

ui.offbyone.ai {
    reverse_proxy offbyone-ui:3000
}

# Example: Add more sites
# api.offbyone.ai {
#     reverse_proxy offbyone-api:3001
# }
EOF

# Create Caddy docker-compose
cat > /opt/caddy/docker-compose.yml << 'EOF'
services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - web
    restart: unless-stopped

networks:
  web:
    external: true

volumes:
  caddy_data:
  caddy_config:
EOF

# Update offbyone app to use the web network
echo "Updating offbyone app configuration..."
cat > /opt/offbyone/docker-compose.yml << 'EOF'
services:
  app:
    image: ghcr.io/offbyone-ai/ui:latest
    container_name: offbyone-ui
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/app/data/analytics.db
      - STATIC_PATH=./static
    volumes:
      - ./data:/app/data
    networks:
      - web
    healthcheck:
      test: ["CMD", "bun", "--eval", "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

networks:
  web:
    external: true
EOF

# Start Caddy
echo "Starting Caddy..."
cd /opt/caddy && docker compose up -d

# Restart offbyone app with new network config
echo "Restarting offbyone app..."
cd /opt/offbyone && docker compose down && docker compose up -d

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "1. Add DNS record in Cloudflare:"
echo "   Type: A"
echo "   Name: ui"
echo "   Content: $(curl -s ifconfig.me)"
echo "   Proxy: On (orange cloud) for SSL + protection"
echo ""
echo "2. Wait a few minutes for DNS propagation and SSL provisioning"
echo ""
echo "3. Test: curl https://ui.offbyone.ai/api/health"
echo ""
