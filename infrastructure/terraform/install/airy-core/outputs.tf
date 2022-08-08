output "API" {
  description = "The URL where the API and the UI can be reached"
  value       = module.airy_core.api_host
}

output "NGROK" {
  description = "The URL where the API and the UI can be reached"
  value       = "https://${module.airy_core.unique_id}.tunnel.airy.co"
}

output "Info" {
  description = "More information"
  value       = "For more information about the AWS provider visit https://airy.co/docs/core/getting-started/installation/aws"
}
