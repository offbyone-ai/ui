#!/bin/bash
set -e

# Manual server setup script (alternative to cloud-init)
# Usage: ./scripts/setup-server.sh <server-ip> <ghcr-token>

SERVER_IP="$1"
GHCR_TOKEN="$2"
GITHUB_USER="${GITHUB_USER:-$(git config user.name)}"
IMAGE="${IMAGE:-ghcr.io/offbyone/ui:latest}"

if [ -z "$SERVER_IP" ] || [ -z "$GHCR_TOKEN" ]; then
    echo "Usage: ./scripts/setup-server.sh <server-ip> <ghcr-token>"
    echo ""
    echo "Environment variables:"
    echo "  GITHUB_USER - GitHub username (default: git config user.name)"
    echo "  IMAGE       - Docker image (default: ghcr.io/offbyone/ui:latest)"
    exit 1
fi

echo "Setting up server at $SERVER_IP..."

ssh root@$SERVER_IP << ENDSSH
    set -e

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl enable docker
        systemctl start docker
    fi

    # Login to GHCR
    echo "Logging into GitHub Container Registry..."
    echo "$GHCR_TOKEN" | docker login ghcr.io -u $GITHUB_USER --password-stdin

    # Create app directory
    mkdir -p /opt/offbyone/data

    # Create docker-compose.yml
    cat > /opt/offbyone/docker-compose.yml << 'EOF'
services:
  app:
    image: $IMAGE
    container_name: offbyone
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/app/data/analytics.db
      - STATIC_PATH=./static
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "bun", "--eval", "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
EOF

    # Pull and start
    cd /opt/offbyone
    docker compose pull
    docker compose up -d

    echo "Setup complete!"
ENDSSH

echo ""
echo "Server setup complete!"
echo "Access your app at: http://$SERVER_IP:3000"
