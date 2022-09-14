variable "profile" {
  description = "The profile to be used for Minikube"
  default     = "airy-core"
}

variable "driver" {
  description = "The driver to be used for Minikube"
  default     = "docker"
}

variable "cpus" {
  description = "Number of CPUs Minikube should use"
  default     = 3
}

variable "memory" {
  description = "Amount of memory Minikube should use"
  default     = 7168
}

variable "nodeport" {
  description = "The port on which the ingress controller, the API and the web UI will be reached"
  default     = 80
}

variable "kubeconfig_output_path" {
  description = "The path where the KUBECONFIG file will be written"
}
