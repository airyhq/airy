variable "core_id" {
  default     = "core"
  description = ""
}

variable "host" {
  default = ""
}

variable "hosted_zone" {
  default = "airy.co"
}

variable "airy_workspace" {
  type    = string
  default = "../../"
}
