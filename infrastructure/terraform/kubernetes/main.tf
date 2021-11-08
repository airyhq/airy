module "eks" {
  source = "../modules/aws_eks"

  core_id = "core"


  aws_access_key = var.aws_access_key
  aws_secret_key = var.aws_secret_key

}

resource "aws_eks_fargate_profile" "example" {


  cluster_name           = module.eks.cluster_name
  fargate_profile_name   = "example"
  pod_execution_role_arn = module.eks.cluster_iam_role_arn
  subnet_ids             = module.eks.subnet_ids

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
