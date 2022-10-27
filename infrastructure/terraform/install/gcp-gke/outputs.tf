output "cluster_name" {
  value = module.gcp-gke.kubernetes_cluster_name
}

output "kubeconfig_path" {
  value = module.gcp-gke.kubeconfig_output_path
}
