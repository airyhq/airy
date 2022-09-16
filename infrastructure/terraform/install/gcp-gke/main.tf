module "gcp-gke" {
  source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/gcp-gke"

  project_id                 = var.project_id
  region                     = var.region
}
