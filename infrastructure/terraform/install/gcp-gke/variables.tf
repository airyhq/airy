variable "project_id" {
  default     = "airy-core"
  description = "The project is airy-core"
}

variable "region" {
  default     = "us-central1"
  description = "The region is us-central1"
}

variable "cluster_name" {
  description = "The name of the created GKE cluster"
  default     = "airy-gke"
}

variable "vpc_name" {
  default     = "core-vpc"
  description = "The name of the created VPC"
}

variable "gke_node_locations" {
  default     = ["us-central1-b", "us-central1-c", "us-central1-f"]
  description = "The list of zones in which the node pool's nodes should be located"
}
