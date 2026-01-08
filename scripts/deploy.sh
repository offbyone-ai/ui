#!/bin/bash
set -e

# Deploy script for offbyone
# Usage: ./scripts/deploy.sh [server-ip]

SERVER_IP="${1:-$SERVER_HOST}"

if [ -z "$SERVER_IP" ]; then
    echo "Error: Server IP required"
    echo "Usage: ./scripts/deploy.sh <server-ip>"
    echo "   or: SERVER_HOST=<ip> ./scripts/deploy.sh"
    exit 1
fi

echo "Deploying to $SERVER_IP..."

ssh root@$SERVER_IP << 'ENDSSH'
    set -e
    cd /opt/offbyone

    echo "Pulling latest image..."
    docker compose pull

    echo "Restarting container..."
    docker compose up -d

    echo "Cleaning up old images..."
    docker image prune -f

    echo "Checking health..."
    sleep 5
    curl -sf http://localhost:3000/api/health && echo " OK" || echo " FAILED"

    echo "Done!"
ENDSSH

echo "Deployment complete!"
