data "terraform_remote_state" "gcp-gke" {
  backend = "local"
  config = {
    path = "../gcp-gke/terraform.tfstate"
  }
}


# data "google_client_config" "default" {}

# provider "kubernetes" {
#   host                   = "https://${module.gcp-gke.kubernetes_endpoint}"
#   token                  = data.google_client_config.default.access_token
#   cluster_ca_certificate = base64decode(module.gcp-gke.ca_certificate)
# }


# data "google_client_config" "default" {}
# data.google_client_config.default.access_token
# data.terraform_remote_state.gcp-gke.resources.google_container_cluster.gke_core.modules.gke_auth.cluster_ca_certificate
# data.terraform_remote_state.gcp-gke.resources.google_container_cluster.gke_core.modules.gke_auth.host
# data.terraform_remote_state.gcp-gke.outputs.ca_certificate

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_output_path
    host  = "https://${data.terraform_remote_state.gcp-gke.outputs.kubernetes_endpoint}"
    token = data.terraform_remote_state.gcp-gke.outputs.client_token
    cluster_ca_certificate = base64decode(
      data.terraform_remote_state.gcp-gke.outputs.ca_certificate
      )
    # cluster_ca_certificate = base64decode(
    #   data.terraform_remote_state.gcp-gke.google_container_cluster.gke_core.master_auth[0].cluster_ca_certificate
    # )
}
}

# module "airy_core" {
#   source         = "github.com/airyhq/airy.git/infrastructure/terraform/modules/core"
#   values_yaml    = file("${var.airy_workspace}/airy.yaml")
#   resources_yaml = file("${path.module}/files/defaultResourceLimits.yaml")
# }

# resource "local_file" "cli_yaml" {
#   filename = "${var.airy_workspace}/cli.yaml"
#   content  = "apihost: http://${module.airy_core.loadbalancer}\n"
# }
