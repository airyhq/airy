variable "region" {
  description = "the AWS region in which resources are created, you must set the availability_zones variable as well if you define this value to something other than the default"
  default     = "eu-west-1"
}

variable "aws_access_key" {
  description = "AWS Access Key"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
}

variable "ssh_key" {
  description = "The name of the ssh key to use, e.g. \"airytf\""
  default     = "~/.ssh/id_rsa"
}

variable "profile" {
  description = "AWS profile that is used for authentication"
  default     = "airy-prod"
}

variable "vpc_id" {
  type    = string
  default = null
}

variable "vpc_name" {
  default = "core_vpc"
}

variable "private_subnets" {
  description = "Subnet ids for the EKS cluster to be created in"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  default = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "instance_type" {
  default = "t3.large"
}

variable "node_group_size" {
  default = 1
}

variable "cluster_version" {
  default = "1.21"
}

variable "core_id" {
  default = "my-core"
}

variable "namespace" {
  default = "default"
}

variable "kubeconfig_output_path" {
  default = "../main/.kubeconfig"
}

variable "fargate_profiles" {
  type        = list(string)
  description = "List of Fargate namespaces (maximum of 10)"
  default     = []
}

variable "kubernetes_users" {
  type = list(object({
    userarn  = string
    username = string
    groups   = list(string)
  }))
  default = []
}

variable "tags" {
  description = "Tags for all resources"
  default     = {}
}