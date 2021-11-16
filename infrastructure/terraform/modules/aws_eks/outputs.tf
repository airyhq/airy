output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  value = module.eks.cluster_certificate_authority_data
}

output "cluster_name" {
  value = module.eks.cluster_id
}

output "cluster_iam_role_arn" {
  value = module.eks.fargate_iam_role_arn
}

output "subnet_ids" {
  value = module.vpc.private_subnets
}
