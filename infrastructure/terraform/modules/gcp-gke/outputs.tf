output "kubernetes_cluster_name" {
  value       = google_container_cluster.gke_core.name
  description = "GKE Cluster Name"
}
output "kubeconfig_raw" {
  sensitive = true
  value     = module.gke_auth.kubeconfig_raw
}
###
output "ca_certificate" {
  sensitive = true
  value = module.gke_auth.cluster_ca_certificate
}

output "kubernetes_endpoint" {
  sensitive = true
  value     = module.gke_auth.host
}

output "client_token" {
  sensitive = true
  value     = module.gke_auth.token
}



