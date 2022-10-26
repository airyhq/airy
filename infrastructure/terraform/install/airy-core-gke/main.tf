data "terraform_remote_state" "gcp-gke" {
  backend = "local"
  config = {
    path = "../gcp-gke/terraform.tfstate"
  }
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_output_path
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_output_path
}


# data "google_client_config" "default" {}
# data.google_client_config.default.access_token
# data.terraform_remote_state.gcp-gke.resources.google_container_cluster.gke_core.modules.gke_auth.cluster_ca_certificate
# data.terraform_remote_state.gcp-gke.resources.google_container_cluster.gke_core.modules.gke_auth.host
# data.terraform_remote_state.gcp-gke.outputs.ca_certificate


module "airy_core" {
  source         = "github.com/airyhq/airy.git/infrastructure/terraform/modules/core"
  values_yaml    = file("${var.airy_workspace}/airy.yaml")
  resources_yaml = file("${path.module}/files/defaultResourceLimits.yaml")
}

resource "local_file" "cli_yaml" {
  filename = "${var.airy_workspace}/cli.yaml"
  content  = "apihost: http://${module.airy_core.loadbalancer}\n"
}
