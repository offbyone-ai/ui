variable "hcloud_token" {
  description = "Hetzner Cloud API token"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for server access"
  type        = string
}

variable "server_name" {
  description = "Name of the server"
  type        = string
  default     = "offbyone-web"
}

variable "server_type" {
  description = "Hetzner server type (cx22 = 2 vCPU, 4GB RAM, ~€4/mo)"
  type        = string
  default     = "cx22"
}

variable "location" {
  description = "Hetzner datacenter location"
  type        = string
  default     = "nbg1" # Nuremberg, Germany. Options: nbg1, fsn1, hel1, ash, hil
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "gh_username" {
  description = "GitHub username for GHCR authentication"
  type        = string
}

variable "gh_token" {
  description = "GitHub Personal Access Token with read:packages scope"
  type        = string
  sensitive   = true
}

variable "app_image" {
  description = "Docker image to deploy"
  type        = string
  default     = "ghcr.io/offbyone/ui:latest"
}
