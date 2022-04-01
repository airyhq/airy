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

locals {
  core_version = var.core_version != "" ? var.core_version : trimspace(data.http.core_version.body)
}

resource "helm_release" "airy_core" {
  name  = "airy-release"
  chart = "https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-${local.core_version}.tgz"

  timeout = "600"
  values = [
    var.values_yaml,
    var.resources_yaml,
    var.prerequisite_properties_yaml
  ]

  namespace = var.namespace

  set {
    name  = "global.appImageTag"
    value = local.core_version
  }

  set {
    name  = "ingress-controller.enabled"
    value = var.ingress_controller_enabled
  }

  depends_on = [
    kubernetes_namespace.core
  ]

}

