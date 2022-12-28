provider "google" {
  project = var.project_id
  region  = var.region
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
    preemptible  = false
    machine_type = var.gke_instance_type
    oauth_scopes = var.gke_oauth_scopes
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

resource "null_resource" "kubeconfig_file" {
  triggers = {
    project_id      = var.project_id
    region          = var.region
    cluster_name    = var.gke_name
    kubeconfig_path = var.kubeconfig_output_path
  }
  depends_on = [
    resource.google_container_cluster.gke_core
  ]
  provisioner "local-exec" {
    command = "KUBECONFIG=${self.triggers.kubeconfig_path} gcloud container clusters get-credentials ${self.triggers.cluster_name} --region ${self.triggers.region} --project ${self.triggers.project_id}"
  }
}
