terraform {
  required_version = ">= 1.0"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }

  # Optional: Store state remotely (recommended for team use)
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "offbyone/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "hcloud" {
  token = var.hcloud_token
}

# SSH Key for server access
resource "hcloud_ssh_key" "default" {
  name       = "offbyone-deploy-key"
  public_key = var.ssh_public_key
}

# Firewall rules
resource "hcloud_firewall" "web" {
  name = "offbyone-firewall"

  # SSH
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  # HTTP
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  # HTTPS (for future use)
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  # Application port (direct access, optional)
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "3000"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
}

# Main server
resource "hcloud_server" "web" {
  name        = var.server_name
  image       = "ubuntu-24.04"
  server_type = var.server_type
  location    = var.location
  ssh_keys    = [hcloud_ssh_key.default.id]
  firewall_ids = [hcloud_firewall.web.id]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    gh_username = var.gh_username
    gh_token    = var.gh_token
    app_image   = var.app_image
  })

  labels = {
    app = "offbyone"
    env = var.environment
  }
}

# Optional: Floating IP for static address
# resource "hcloud_floating_ip" "web" {
#   type      = "ipv4"
#   server_id = hcloud_server.web.id
# }
