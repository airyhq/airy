output "ca_certificate" {
  sensitive = true
  value = module.gcp-gke.ca_certificate
}

output "kubernetes_endpoint" {
  sensitive = true
  value     = module.gcp-gke.kubernetes_endpoint
}

output "client_token" {
  sensitive = true
  value     = module.gcp-gke.client_token
}