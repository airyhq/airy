module "gcp-gke" {
  source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/gcp-gke"

  project_id                 = var.project_id
  region                     = var.region
  gke_name                   = var.cluster_name
  vpc_name                   = var.vpc_name
  gke_node_locations         = var.gke_node_locations
}