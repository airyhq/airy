data "terraform_remote_state" "kubernetes" {
  backend = "local"

  config = {
    path = "../kubernetes.tfstate"
  }
}

provider "helm" {
  kubernetes {
    config_path = data.terraform_remote_state.kubernetes.outputs.kubeconfig_path
  }
}

provider "kubernetes" {
  config_path = data.terraform_remote_state.kubernetes.outputs.kubeconfig_path
}

module "my_airy_core" {
  source         = "github.com/airyhq/airy.git/infrastructure/terraform/modules/core"
  values_yaml    = data.template_file.airy_yaml.rendered
  resources_yaml = file("${path.module}/files/defaultResourceLimits.yaml")
}

data "template_file" "airy_yaml" {
  template = file("${var.airy_workspace}/airy.yaml")

  vars = {
    host        = var.host
    hosted_zone = var.hosted_zone
  }
}