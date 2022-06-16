variable "aws_access_key" {
  description = "AWS Access Key"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
}

variable "core_id" {
  default = "core"
}

variable "kubeconfig_output_path" {
  default = "./.kubeconfig"
}

variable "host" {
  
}
variable "hosted_zone" {
  default = "airy.co"
}
