output "kubernetes_cluster_name" {
  value       = google_container_cluster.gke_core.name
  description = "GKE Cluster Name"
}

output "kubeconfig_path" {
  description = "The path of the generated KUBECONFIG file"
  value       = var.kubeconfig_output_path
}
