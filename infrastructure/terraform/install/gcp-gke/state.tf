terraform {
  backend "local" {
    path = "../kubernetes.tfstate"
  }
}