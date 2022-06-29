module "eks" {
  #source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/aws_eks"
  source = "../../modules/aws_eks"

  aws_profile            = var.aws_profile
  aws_region             = var.aws_region

  kubeconfig_output_path = "../kube.conf"
  fargate_profiles       = var.fargate_profiles
}