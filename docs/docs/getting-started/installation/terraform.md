---
title: Run Airy Core on AWS with Terraform
sidebar_label: Terraform
---

## Requirements

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) v1.0.0+
- [Airy CLI](https://airy.co/docs/core/cli/introduction) v0.34.0+
- [SSH key](https://www.ssh.com/academy/ssh/keygen) in `~/.ssh/id_rsa.pub`
- [Kubectl](https://kubernetes.io/docs/tasks/tools/) (optional)

## Create the Kubernetes cluster

In case you already have a cluster running you can skip to the next section.

### Amazon Web Services

You need to provide Terraform with the AWS credentials for your IAM Role. If
you don't know how to create one, [follow these
instructions](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/).
They have to be put into a `terraform.tfvars` file in `terraform/kubernetes` that looks contains:

```
aws_access_key = "<YOUR_AWS_ACCESS_KEY>"
aws_secret_key = "<YOUR_AWS_SECRET_KEY>"
```

If you want to deploy the EKS cluster in your existing VPC you have to override the
`vpc_id`, `subnets` and `fargate_subnets` variables with the outputs from your
vpc and set `create_vpc=false` in the Airy Core module.

```
terraform init
terraform apply
```

## Install Airy Helm chart

After the Kubernetes cluster has been created we can deploy the Airy Helm chart
to it. Change to the `terraform/main` directory and make sure the `.kubeconfig`
file is there.

You can [configure](https://airy.co/docs/core/getting-started/installation/configuration) your instance by making changes to `infrastructure/terraform/main/files/values.yaml`

If you want to deploy the stateless apps with AWS Fargate you can add
`workerType: fargate` to the `values.yaml`

Finally, you need to initialize the Terraform workspace and run apply.

```
terraform init
terraform apply
```
