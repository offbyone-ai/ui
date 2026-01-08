output "server_ip" {
  description = "Public IP address of the server"
  value       = hcloud_server.web.ipv4_address
}

output "server_ipv6" {
  description = "IPv6 address of the server"
  value       = hcloud_server.web.ipv6_address
}

output "server_status" {
  description = "Server status"
  value       = hcloud_server.web.status
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh root@${hcloud_server.web.ipv4_address}"
}

output "app_url" {
  description = "Application URL"
  value       = "http://${hcloud_server.web.ipv4_address}:3000"
}
