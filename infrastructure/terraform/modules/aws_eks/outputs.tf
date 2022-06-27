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

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  value = module.vpc.vpc_cidr_block
}

output "fargate_iam_role_arn" {
  value = module.eks.fargate_iam_role_arn
}

output "vpc_private_subnets" {
  value = module.vpc.private_subnets
}

output "kubeconfig_output_path" {
  value = var.kubeconfig_output_path
}