terraform {
  backend "local" {
    path = "../airy-core-gke.tfstate"
  }
}