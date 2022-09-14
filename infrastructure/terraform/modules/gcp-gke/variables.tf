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
variable "private_subnets" {
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}
variable "public_subnets" {
  type        = list(string)
  default = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}
variable "network" {
  description = "The VPC network created to host the cluster in"
  default     = "gke-network"
}
variable "subnetwork" {
  description = "The subnetwork created to host the cluster in"
  default     = "gke-subnet"
}
variable "ip_range_pods_name" {
  description = "The secondary ip range to use for pods"
  default     = "ip-range-pods"
}
variable "ip_range_services_name" {
  description = "The secondary ip range to use for services"
  default     = "ip-range-services"
}
variable "gke_username" {
  default     = ""
  description = "gke username"
}
variable "gke_password" {
  default     = ""
  description = "gke password"
}
variable "ssh_key" {
  description = "The name of the ssh key to use"
  default     = "~/.ssh/id_rsa"
}
variable "kubeconfig_output_path" {
  type        = string
  default     = "./kube.conf"
  description = "The location of the kubeconfig file"
}