provider "aws" {
  region     = var.aws_region
  profile    = "airy-prod"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

provider "kubernetes" {
  config_path    = var.kubeconfig_file
  config_context = "admin@kubernetes"
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_file
  }
}

module "vpc" {
  source = "scholzj/vpc/aws"

  aws_region      = var.aws_region
  aws_zones       = var.aws_zones
  vpc_name        = var.vpc_name
  vpc_cidr        = var.vpc_cidr
  private_subnets = var.private_subnets

  ## Tags
  tags = var.tags
}

module "minikube" {
  source  = "scholzj/minikube/aws"
  version = "1.14.1"

  aws_subnet_id     = module.vpc.subnet_ids[0]
  aws_instance_type = "m4.xlarge"
  cluster_name      = var.host
  hosted_zone       = var.hosted_zone
  tags = {
    Application = "Minikube"
  }
  aws_region     = var.aws_region
  ssh_public_key = "~/.ssh/id_rsa.pub"

  addons = [
    "https://raw.githubusercontent.com/scholzj/terraform-aws-minikube/master/addons/storage-class.yaml",
    "https://raw.githubusercontent.com/scholzj/terraform-aws-minikube/master/addons/metrics-server.yaml",
    "https://raw.githubusercontent.com/scholzj/terraform-aws-minikube/master/addons/dashboard.yaml"
  ]
}

resource "null_resource" "k8s_configuration" {
  triggers = {
    host        = var.host
    hosted_zone = var.hosted_zone
  }
  provisioner "local-exec" {
    command = "sleep 300 && scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null  centos@${self.triggers.host}.${var.hosted_zone}:/home/centos/kubeconfig ${var.kubeconfig_file}"
  }
  depends_on = [
    module.minikube,
    module.minikube.aws_eip_association
  ]
}

data "template_file" "values_yaml" {
  template = file("${path.module}/files/values.yaml")

  vars = {
    host          = var.host
    hosted_zone   = var.hosted_zone
    app_image_tag = replace(file("${path.module}/../../../../VERSION"), "\n", "")
  }
}

resource "helm_release" "airy_core" {
  name  = "airy-release"
  chart = "https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-${replace(file("${path.module}/../../../../VERSION"), "\n", "")}.tgz"

  timeout = "600"
  values = [
    data.template_file.values_yaml.rendered
  ]

  set {
    name  = "cluster.enabled"
    value = "true"
  }

  depends_on = [
    null_resource.k8s_configuration
  ]

}

resource "helm_release" "jupyterhub" {
  name  = "jupyterhub"
  chart = "https://jupyterhub.github.io/helm-chart/jupyterhub-1.1.3.tgz"

  values = [file("${path.module}/files/jupyter-config.yaml")]

  depends_on = [
    null_resource.k8s_configuration
  ]
}
