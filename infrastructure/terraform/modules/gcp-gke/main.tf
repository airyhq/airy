provider "google" {
  project = var.project_id
  region  = var.region
  #credentials = file("credentials.json")
}

resource "google_service_account" "gke_core_sa" {
  account_id   = "gke-core-sa"
  display_name = "Service Account For Terraform GKE Cluster"
}

# note this requires the terraform to be run regularly
resource "time_rotating" "gke_core_key_rotation" {
  rotation_days = 90
}

resource "google_service_account_key" "gke_core_key" {
  service_account_id = google_service_account.gke_core_sa.name

  keepers = {
    rotation_time = time_rotating.gke_core_key_rotation.rotation_rfc3339
  }
}

resource "google_compute_network" "vpc" {
  name = var.vpc_name
}

resource "google_container_cluster" "gke_core" {
  name                     = var.gke_name
  location                 = var.region
  remove_default_node_pool = true
  initial_node_count       = 1
  network                  = google_compute_network.vpc.name

}

resource "google_container_node_pool" "gke_core_nodes" {
  name           = "${google_container_cluster.gke_core.name}-node-pool"
  location       = var.region
  cluster        = google_container_cluster.gke_core.name
  node_count     = var.gke_num_nodes
  node_locations = var.gke_node_locations

  node_config {
    preemptible  = true
    machine_type = var.gke_instance_type

    # Google recommends custom service accounts that have cloud-platform scope and
    # permissions granted via IAM Roles.
    service_account = google_service_account.gke_core_sa.email


    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/userinfo.email",
    ]

    tags = ["gke-node", "${var.project_id}-gke"]
    metadata = {
      disable-legacy-endpoints = "true"
    }
    labels = {
      env = var.project_id
    }
  }

  depends_on = [resource.google_container_cluster.gke_core]
}

module "gke_auth" {
  source = "terraform-google-modules/kubernetes-engine/google//modules/auth"

  project_id   = var.project_id
  location     = google_container_cluster.gke_core.location
  cluster_name = google_container_cluster.gke_core.name

  depends_on = [
    resource.google_container_cluster.gke_core
  ]
}

resource "local_file" "kubeconfig" {
  content  = module.gke_auth.kubeconfig_raw
  filename = var.kubeconfig_output_path
}