variable "aws_region" {
  description = "the AWS region in which resources are created, you must set the availability_zones variable as well if you define this value to something other than the default"
  default     = "eu-central-1"
}

variable "aws_access_key" {
  
}

variable "aws_secret_key" {
  
}

variable "aws_zones" {
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "vpc_name" {
  default = "my-vpc"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "private_subnets" {
    default = "false"
  
}

variable "tags" {
  default = {}
}

variable "host" {
  default = "analytics-demo"
}

variable "hosted_zone" {
  default = "airy.co"
}

variable "kubeconfig_file" {
  default = "./.kubeconfig"
}