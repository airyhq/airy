output "loadbalancer" {
  description = "The URL for the load balancer of the cluster. Used to access the UI via the browser"
  value       = module.my_airy_core.loadbalancer
}