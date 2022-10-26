terraform {
  backend "local" {
    path = "../gcp-gke/terraform.tfstate" #"../airy-core-gke.tfstate"
  }
}