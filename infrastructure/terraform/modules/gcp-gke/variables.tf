variable "project_id" {
  description = "The project is airy-core-gke"
}

variable "region" {
  description = "The region is us-central1"
}

variable "gke_username" {
  default     = ""
  description = "gke username"
}

variable "gke_password" {
  default     = ""
  description = "gke password"
}

variable "gke_num_nodes" {
  default     = 2
  description = "number of gke nodes"
}
