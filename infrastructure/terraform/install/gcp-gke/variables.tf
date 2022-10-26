variable "project_id" {
  default     = "airy-core"
  description = "The project is airy-core"
}
variable "region" {
  default     = "us-central1"
  description = "The region is us-central1"
}
variable "vpc_name" {
  default     = "the-core-vpc"
  description = "The name of the created VPC"
}

variable "gke_num_nodes" {
  default     = 2
  description = "Number of gke nodes"
}

variable "gke_node_locations" {
  default     = ["us-central1-b", "us-central1-c", "us-central1-f"]
  description = "The list of zones in which the node pool's nodes should be located"
}

variable "gke_instance_type" {
  default     = "n1-standard-4"
  description = "The type of the instances in the node pool"
}