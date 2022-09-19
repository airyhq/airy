provider "google" {
  project = var.project_id
  region    = var.region
}

resource "google_compute_network" "vpc" {
  name                    = var.vpc_name
}

resource "google_container_cluster" "gke_core" {
  name     = "${var.project_id}-gke"
  location = var.region
  remove_default_node_pool = true
  initial_node_count       = 1
  network    = google_compute_network.vpc.name
}

resource "google_container_node_pool" "gke_core_nodes" {
  name       = "${google_container_cluster.gke_core.name}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.gke_core.name
  node_count = var.gke_num_nodes
  node_locations = var.gke_node_locations

  node_config {
    preemptible  = true
    machine_type = var.gke_instance_type

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    tags         = ["gke-node", "${var.project_id}-gke"]
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