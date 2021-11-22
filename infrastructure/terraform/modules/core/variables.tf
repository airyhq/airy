variable "kubeconfig_output_path" {
  description = "The KUBECONFIG file"
  default     = "./.kubeconfig"
}

variable "core_id" {
  description = "Unique ID if the Airy Core instance"
  default     = "airy-core"
}

variable "namespace" {
  description = "The Kubernetes namespace where Airy Core will be deployed"
  default     = "default"
}

variable "values_yaml" {
  description = "The helm values overrides"
}

variable "core_version" {
  description = "Version of the Airy Core instance"
  type        = string
  default     = ""
}

variable "ingress_controller_enabled" {
  description = "Whether to create the NGinx ingress controller"
  type        = string
  default     = "true"
}
