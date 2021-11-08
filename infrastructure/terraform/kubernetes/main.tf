module "eks" {
  source = "../modules/aws_eks"

  core_id = "core"


  aws_access_key = var.aws_access_key
  aws_secret_key = var.aws_secret_key

  fargate_profiles = var.fargate_profiles

}
