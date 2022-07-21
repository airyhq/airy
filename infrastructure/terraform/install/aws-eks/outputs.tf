output "cluster_name" {
  value = module.eks.cluster_name
}

output "kubeconfig_path" {
  value = module.eks.kubeconfig_output_path
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

