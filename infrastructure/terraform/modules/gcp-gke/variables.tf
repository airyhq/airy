variable "project_id" {
  default     = "airy-core"
  description = "The project defined in gcloud config is airy-core"
}
variable "region" {
  default     = "us-central1"
  description = "The region defined in gcloud config is us-central1"
}
variable "gke_num_nodes" {
  default     = 1
  description = "Number of gke nodes"
}
variable "gke_node_locations" {
  default     = []
  description = "List of zones for the nodes in the node pool"
}
variable "vpc_name" {
  default     = "airy-core-vpc"
  description = "The name of the created VPC"
}
variable "kubeconfig_output_path" {
  default     = "../kube.conf"
  description = "The location of the kubeconfig file"
}
variable "gke_instance_type" {
  default     = "n1-standard-2"
  description = "The type of the instances in the node pool"
}
