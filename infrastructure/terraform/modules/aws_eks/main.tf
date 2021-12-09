provider "aws" {
  region     = var.region
  profile    = "airy-prod"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

locals {
  create_vpc = var.vpc_id == null ? true : false
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  create_vpc = local.create_vpc

  name = var.vpc_name
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway   = true
  enable_vpn_gateway   = true
  enable_dns_support   = true
  enable_dns_hostnames = true

  single_nat_gateway = true

  tags = {
    Terraform = "true"
  }
}

locals {
  vpc = (
    local.create_vpc ?
    {
      id              = module.vpc.vpc_id
      private_subnets = module.vpc.private_subnets
      public_subnets  = module.vpc.public_subnets
    } :
    {
      id              = var.vpc_id
      private_subnets = var.private_subnets
      public_subnets  = var.public_subnets
    }
  )
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"


  cluster_version        = var.cluster_version
  cluster_name           = var.core_id
  vpc_id                 = local.vpc.id
  subnets                = [local.vpc.private_subnets[0], local.vpc.public_subnets[1]]
  fargate_subnets        = [local.vpc.private_subnets[0]]
  kubeconfig_output_path = var.kubeconfig_output_path
  write_kubeconfig       = true
  map_users              = var.kubernetes_users

  node_groups = {
    default = {
      desired_capacity = var.node_group_size
      min_capacity     = var.node_group_size
      max_capacity     = (var.node_group_size + 1)

      instance_types = [var.instance_type]
      update_config = {
        max_unavailable_percentage = 50
      }
    }
  }

  fargate_profiles = {


     default = {
      name = "default"
      selectors = [
        {
          namespace = "kube-system"
          labels = {
            k8s-app = "kube-dns"
          }
        },
        {
          namespace = var.namespace
          labels = {
            WorkerType = "fargate"
          }
        }
      ]
    }
  }
  manage_aws_auth = false

}

resource "aws_eks_fargate_profile" "example" {


  cluster_name           = var.core_id
  fargate_profile_name   = "stateless"
  pod_execution_role_arn = module.eks.fargate_iam_role_arn
  subnet_ids             = module.vpc.private_subnets

  dynamic "selector" {
    for_each = var.fargate_profiles
    content {
      namespace = selector.value
      labels = {
        WorkerType = "fargate"
      }
    }
  }
}
