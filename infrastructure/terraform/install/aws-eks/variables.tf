variable "aws_profile" {
  description = "The AWS Profile associated with your credentials (default = 'default')"
}

variable "aws_region" {
  description = "The AWS region in which resources are created"
}

variable "fargate_profiles" {
  type    = list(string)
  default = []
}
