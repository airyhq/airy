variable "project_id" {
  type        = string
  default     = "airy-core"
  description = "The project defined in gcloud config is airy-core"
}
variable "region" {
  type        = string
  default     = "us-central1"
  description = "The region defined in gcloud config is us-central1"
}
variable "gke_num_nodes" {
  default     = 2
  description = "number of gke nodes"
}
variable "vpc_name" {
  default     = "airy-core-vpc"
}
variable "kubeconfig_output_path" {
  type        = string
  default     = "./kube.conf"
  description = "The location of the kubeconfig file"
}
variable "gke_instance_type" {
  type      = string
  default   = "n1-standard-2"
}
variable "gke_initial_node_count" {
  default   = 1
}