output "core_id" {
  value = var.core_id
}

output "loadbalancer" {
    description = "The URL for the load balancer of the cluster. Used to access the UI via the browser"
    value       = data.kubernetes_service.ingress.status.0.load_balancer.0.ingress.0.hostname
}
