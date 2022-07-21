variable "core_id" {
  default     = "core"
  description = "The name of the cluster "
}

variable "host" {
  default = ""
}

variable "hosted_zone" {
  default = "airy.co"
}

variable "airy_workspace" {
  type    = string
  default = "../.."
}
