data "http" "core_version" {
  url = "https://raw.githubusercontent.com/airyhq/airy/main/VERSION"
}

locals {
  core_version = var.core_version != "" ? var.core_version : trimspace(data.http.core_version.body)
}

resource "helm_release" "airy_core" {
  name  = "airy-release"
  chart = "https://helm.airy.co/charts/airy-${local.core_version}.tgz"

  timeout = var.timeout
  values = [
    var.values_yaml,
    var.resources_yaml,
    var.prerequisite_properties_yaml
  ]

  namespace        = var.namespace
  create_namespace = true
  wait            = false

  set {
    name  = "global.appImageTag"
    value = local.core_version
  }

  set {
    name  = "ingress-controller.enabled"
    value = var.ingress_controller_enabled
  }
}

data "kubernetes_service" "ingress" {
  metadata {
    name      = "ingress-nginx-controller"
    namespace = "kube-system"
  }
  depends_on = [
    helm_release.airy_core
  ]
}

data "kubernetes_config_map" "core_config" {
  metadata {
    name      = "core-config"
    namespace = var.namespace
  }
  depends_on = [
    helm_release.airy_core
  ]
}
