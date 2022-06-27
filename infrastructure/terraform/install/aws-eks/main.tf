module "eks" {
  source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/aws_eks"

  region = var.aws_region

  aws_profile            = var.aws_profile
  kubeconfig_output_path = "../kube.conf"
  fargate_profiles       = var.fargate_profiles
}