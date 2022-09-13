# output "kubernetes_endpoint" {
#   sensitive = true
#   value     = module.gke_auth.host
# }

# output "client_token" {
#   sensitive = true
#   value     = module.gke_auth.token
# }

# output "ca_certificate" {
#   value = module.gke_auth.cluster_ca_certificate
# }

# output "kubeconfig_raw" {
#   value = module.gke_auth.kubeconfig_raw
# }

# output "service_account" {
#   description = "The default service account used for running nodes."
#   value       = module.gke.service_account
# }


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
  value = module.gke_auth.kubeconfig_raw
}

output "ca_certificate" {
  value = module.gke_auth.cluster_ca_certificate
}

output "kubernetes_endpoint" {
  sensitive = true
  value     = module.gke_auth.host
}
