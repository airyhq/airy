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
  values_yaml    = file("${var.airy_workspace}/airy.yaml")
  resources_yaml = file("${path.module}/files/defaultResourceLimits.yaml")
}

resource "local_file" "cli_yaml" {
  filename = "${var.airy_workspace}/cli.yaml"
  content  = "apihost: http://${module.airy_core.loadbalancer}\n"
}
