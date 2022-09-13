provider "google" {
  project = var.project_id
  region  = var.region
}

# VPC
resource "google_compute_network" "vpc" {
  name                    = var.vpc_name
  auto_create_subnetworks = "false"
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.project_id}-subnet"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.10.0.0/24" ## Check here on EKS it is this --> "10.0.0.0/16"
}

#Public subnet #0 !!example here this is not used. The one above is already a public one
resource "google_compute_subnetwork" "public" {
  name          = "${google_compute_network.vpc.name}-public-0"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = var.public_subnets[0]
}

# Private subnet #0 !!example here this is not used yet
resource "google_compute_subnetwork" "private" {
  name                     = "${google_compute_network.vpc.name}-private-0"
  region                   = var.region
  private_ip_google_access = true
  network                  = google_compute_network.vpc.name
  ip_cidr_range            = var.private_subnets[0]
}


# GKE cluster
resource "google_container_cluster" "primary" {
  name     = "${var.project_id}-gke"
  location = var.zone #var.region
  
  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "${google_container_cluster.primary.name}-node-pool"
  location   = var.zone #var.region
  cluster    = google_container_cluster.primary.name
  node_count = var.gke_num_nodes

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
    ]


    labels = {
      env = var.project_id
    }

    # preemptible  = true
    machine_type = "n1-standard-1"
    tags         = ["gke-node", "${var.project_id}-gke"]
    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

module "gke_auth" {
  source = "terraform-google-modules/kubernetes-engine/google//modules/auth"

  project_id   = var.project_id
  location     = google_container_cluster.primary.location
  cluster_name = google_container_cluster.primary.name
}

resource "local_file" "kubeconfig" {
  content  = module.gke_auth.kubeconfig_raw
  filename = "kube.conf"
}

locals {
  env              = "prod"
  project          = var.project_id
  region           = var.region
  vpc_name         = var.vpc_name
  credentials_path = "./gcp-credentials.json"
}
