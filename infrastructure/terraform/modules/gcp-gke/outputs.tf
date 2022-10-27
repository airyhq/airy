output "kubernetes_cluster_name" {
  value       = google_container_cluster.gke_core.name
  description = "GKE Cluster Name"
}

output "kubeconfig_raw" {
  sensitive = true
  value     = module.gke_auth.kubeconfig_raw
}

output "kubeconfig_output_path" {
  value = var.kubeconfig_output_path
}


