variable "project_id" {
  description = "The project defined in gcloud config is airy-core"
  default     = "airy-core"
}

variable "region" {
  description = "The region defined in gcloud config is us-central1"
  default     = "us-central1"
}

variable "gke_name" {
  description = "The name of the created GKE cluster"
  default     = "airy-core-gke"
}

variable "gke_num_nodes" {
  description = "Number of gke nodes"
  default     = 2
}

variable "gke_node_locations" {
  description = "List of zones for the nodes in the node pool"
  default     = []
}

variable "vpc_name" {
  description = "The name of the created VPC"
  default     = "airy-core-vpc"
}

variable "kubeconfig_output_path" {
  description = "The location of the kubeconfig file"
  default     = "../kube.conf"
}

variable "gke_instance_type" {
  description = "The type of the instances in the node pool"
  default     = "n1-standard-2"
}

variable "gke_oauth_scopes" {
  description = "The OAuth scopes used for the nodegroups in Kubernetes"
  default = [
    "https://www.googleapis.com/auth/logging.write",
    "https://www.googleapis.com/auth/monitoring",
    "https://www.googleapis.com/auth/cloud-platform"
  ]
}
