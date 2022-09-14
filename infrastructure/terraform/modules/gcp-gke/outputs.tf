output "region" {
  value       = var.region
  description = "GCloud Region"
}
output "zone" {
  value       = var.zone
  description = "GCloud Zone"
}
output "project_id" {
  value       = var.project_id
  description = "GCloud Project ID"
}
output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Name"
}
output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "GKE Cluster Host"
}
output "kubeconfig_raw" {
  sensitive = true
  value = module.gke_auth.kubeconfig_raw
}
output "kubernetes_endpoint" {
  sensitive = true
  value     = module.gke_auth.host
}
output "ca_certificate" {
  sensitive = true
  value = module.gke_auth.cluster_ca_certificate
}