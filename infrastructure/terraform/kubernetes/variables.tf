variable "aws_access_key" {
  description = "AWS Access Key"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
}

variable "fargate_profiles" {
  type = map
  default = {
    "name" = "default"
  }
}
