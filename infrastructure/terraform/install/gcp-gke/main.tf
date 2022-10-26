module "gcp-gke" {
  #source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/gcp-gke"
  source = "../../modules/gcp-gke"

  project_id                 = var.project_id
  region                     = var.region
  vpc_name                   = var.vpc_name
  gke_num_nodes              = var.gke_num_nodes
  gke_node_locations         = var.gke_node_locations
  gke_instance_type          = var.gke_instance_type
}
