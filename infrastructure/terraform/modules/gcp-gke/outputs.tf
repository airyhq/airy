output "kubernetes_endpoint" {
  sensitive = true
  value     = module.gke_auth.host
}

output "client_token" {
  sensitive = true
  value     = module.gke_auth.token
}

output "ca_certificate" {
  value = module.gke_auth.cluster_ca_certificate
}

output "kubeconfig_raw" {
  value = module.gke_auth.kubeconfig_raw
}

output "service_account" {
  description = "The default service account used for running nodes."
  value       = module.gke.service_account
}