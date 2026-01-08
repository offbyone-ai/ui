# Deployment Guide

This guide covers deploying offbyone to a Hetzner Cloud server using Terraform and GitHub Actions.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- [Hetzner Cloud account](https://console.hetzner.cloud/)
- GitHub repository with Actions enabled
- SSH key pair

## Quick Start (Manual)

If you just want to deploy quickly without Terraform:

```bash
# 1. Create a Hetzner server manually (Ubuntu 24.04, cx22)
# 2. Run the setup script
./scripts/setup-server.sh <server-ip> <github-pat-token>

# 3. Deploy updates
./scripts/deploy.sh <server-ip>
```

## Infrastructure as Code (Terraform)

### 1. Get Hetzner API Token

1. Go to [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Select your project → Security → API Tokens
3. Create a token with Read & Write permissions

### 2. Configure Terraform

```bash
cd infra

# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
vim terraform.tfvars
```

Required variables:
- `hcloud_token` - Hetzner API token
- `ssh_public_key` - Your SSH public key (`cat ~/.ssh/id_ed25519.pub`)
- `gh_username` - GitHub username
- `gh_token` - GitHub PAT with `read:packages` scope

### 3. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply

# Get server IP
terraform output server_ip
```

### 4. Access Your Server

```bash
# SSH into server
ssh root@$(terraform output -raw server_ip)

# Check app status
docker ps
docker logs offbyone
```

## GitHub Actions CI/CD

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Server IP address |
| `SSH_PRIVATE_KEY` | Private key for SSH (`cat ~/.ssh/id_ed25519`) |
| `HCLOUD_TOKEN` | Hetzner API token (for infra workflow) |
| `SSH_PUBLIC_KEY` | Public key (for infra workflow) |
| `GH_REGISTRY_TOKEN` | GitHub PAT with `read:packages` (for infra workflow) |

### Workflows

**deploy.yml** - Runs on push to main:
1. Runs tests and linting
2. Builds Docker image
3. Pushes to GitHub Container Registry
4. SSHs into server and pulls new image

**infra.yml** - Manual trigger only:
1. Runs Terraform plan/apply/destroy
2. Used for initial setup or infrastructure changes

### Manual Deployment

```bash
# Trigger deployment workflow
gh workflow run deploy.yml

# Or deploy directly
./scripts/deploy.sh <server-ip>
```

## Server Management

### Update Application

```bash
ssh root@<server-ip> "/opt/offbyone/update.sh"
```

### View Logs

```bash
ssh root@<server-ip> "docker logs -f offbyone"
```

### Restart Application

```bash
ssh root@<server-ip> "cd /opt/offbyone && docker compose restart"
```

### Backup Database

```bash
ssh root@<server-ip> "cat /opt/offbyone/data/analytics.db" > backup.db
```

## Scaling Up

### Vertical Scaling

Change `server_type` in `terraform.tfvars`:

| Type | vCPU | RAM | Price/mo |
|------|------|-----|----------|
| cx22 | 2 | 4GB | ~€4 |
| cx32 | 4 | 8GB | ~€8 |
| cx42 | 8 | 16GB | ~€16 |
| cx52 | 16 | 32GB | ~€32 |

Then run `terraform apply`.

### Adding HTTPS (Future)

To add HTTPS, update the docker-compose to include Caddy:

```yaml
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - app

  app:
    # ... existing config, but change ports to:
    expose:
      - "3000"

volumes:
  caddy_data:
```

Caddyfile:
```
offbyone.dev {
    reverse_proxy app:3000
}
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs offbyone

# Check if port is in use
ss -tlnp | grep 3000
```

### Can't pull image

```bash
# Re-authenticate to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USER --password-stdin
```

### Terraform state issues

```bash
# Refresh state
terraform refresh

# Import existing resource
terraform import hcloud_server.web <server-id>
```
