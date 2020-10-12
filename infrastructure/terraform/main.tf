provider "kubernetes" {
  config_context_cluster   = "minikube"
}

resource "kubernetes_namespace" "example" {
  metadata {
    name = "my-first-namespace"
  }
}

provider "kafka" {
  bootstrap_servers = ["localhost:9092"]
}
