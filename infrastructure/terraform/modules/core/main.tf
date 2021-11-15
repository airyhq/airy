provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_output_path
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_output_path
}

resource "kubernetes_namespace" "core" {
  metadata {
    name = var.core_id
  }
}

data "http" "core_version" {
  url = "https://airy-core-binaries.s3.amazonaws.com/stable.txt"

  request_headers = {
    Accept = "application/json"
  }
}

resource "helm_release" "airy_core" {
  name  = "airy-release"
  chart = "https://airy-core-helm-charts.s3.amazonaws.com/testing/airy-${trimspace(data.http.core_version.body)}.tgz"

  timeout = "600"
  values = [
    var.values_yaml
  ]


  namespace = var.namespaced ? var.core_id : "default"

  set {
    name = "global.appImageTag"
    value = trimspace(data.http.core_version.body)
  }

  depends_on = [
    kubernetes_namespace.core
  ]

}

