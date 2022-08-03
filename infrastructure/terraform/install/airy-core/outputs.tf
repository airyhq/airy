output "API" {
  description = "The URL where the API and the UI can be reached"
  value       = module.airy_core.loadbalancer
}

output "Info" {
  description = "More information"
  value       = "For more information about the AWS provider visit https://airy.co/docs/core/getting-started/installation/aws"
}
