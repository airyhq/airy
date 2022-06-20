provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_output_path
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_output_path
}

module "my-airy-core" {
  source  = "../modules/core"
  values_yaml = data.template_file.airy_yaml.rendered
  resources_yaml = file("${path.module}/files/defaultResourceLimits.yaml")
}

data "template_file" "airy_yaml" {
  template = file("${path.module}/files/airyConfig.yaml")

  vars = {
    host        = var.host
    hosted_zone = var.hosted_zone
  }
}
