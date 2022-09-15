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
variable "zone" {
  type        = string
  default     = "us-central1-a"
  description = "The zone defined in gcloud config is us-central1-a"
}
variable "gke_num_nodes" {
  default     = 2
  description = "number of gke nodes"
}
variable "vpc_name" {
  default = "airy-core-vpc"
}
variable "public_subnets" {
  type        = list(string)
  default = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}
variable "kubeconfig_output_path" {
  type        = string
  default     = "./kube.conf"
  description = "The location of the kubeconfig file"
}