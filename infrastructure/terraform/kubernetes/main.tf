module "eks" {
  source = "../modules/aws_eks"

  core_id = "core"
  region = var.region
 
  aws_profile = var.aws_profile

  fargate_profiles = var.fargate_profiles

}
