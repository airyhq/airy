---
title: Run Airy Core on AWS with Terraform
sidebar_label: Terraform
---

<TLDR>
Create a cluster and run Airy Core using Terraform.
</TLDR>

The goal of this document is to provide a step-by-step guide to setting up `Airy Core` on a Kubernetes Cluster using the infrastructure-as-code tool [Terraform](https://www.terraform.io/). Terraform takes care of provisioning, updating, and cleaning up virtual resources.

:::note

Currently, we only support the AWS Elastic Kubernetes Service (AWS-EKS) as a provider. Terraform modules for other providers (and on different architectures) such as Google Cloud and Digital Ocean will soon be added.

:::

## Requirements

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) v1.2.0+
- [Kubectl](https://kubernetes.io/docs/tasks/tools/) (optional)

## Architecture

The local file structure for the installation is as follows:

```
[Airy Workspace Directory]
    airy.yaml
    cli.yaml
    /[INSTALLATION DIRECTORY]
        /airy-core
            main.tf
            variables.tf
            outputs.tf
        /[PROVIDER]
            main.tf
            variables.tf
            outputs.tf
```

The installation takes place in two steps, each in a separate Terraform environment organized by directories:

- 1. `/[PROVIDER]` (default = `aws-eks`) - where you create the cluster.
- 2. `/airy-core`- where `Airy Core` is installed on the cluster.

In each directory, the `main.tf` is the root module of a remote parent [module](https://www.terraform.io/language/modules/syntax) of the same name in our GitHub [repository](https://github.com/airyhq/airy/tree/develop/infrastructure/terraform/modules) (airy/infrastructure/terraform/modules).

## Install step by step

:::note

When you run a cloud installation with the Airy CLI with `airy create --provider cloud-provider`, the CLI will run all the following steps in a sequence. Currently, only the AWS EKS (aws-eks) provider is supported.

If you already have a cluster installed without Terraform, i.e. via [Helm](../installation/helm.md), skip Step 4 and place the Kubernetes config file in the installation directory. Remember to specify the location of this file in the `main.tf` of `airy-core`.

:::

### 1. Create Airy Workspace

Create a directory with an `airy.yaml` and `cli.yaml` file. If you skip this step, the CLI will create it for you.

### 2. Create the installation directory inside Airy Workspace

```sh
mkdir terraform
```

### 3. Set up files inside Installation Directory

Copy/Download `airy-core` and the relevant provider directory from [airy/infrastructure/terraform/install](https://github.com/airyhq/airy/tree/develop/infrastructure/terraform/install).

This can be done by `git clone git@github.com:airyhq/airy.git` and then moving the relevant files.
Or grab the files inside your installation directory directly (and select the provider directory).

```
$ cd terraform
$ svn export https://github.com/airyhq/airy/trunk/infrastructure/terraform/install/airy-core
$ svn export https://github.com/airyhq/airy/trunk/infrastructure/terraform/install/[PROVIDER]
```

### 4. Create Kubernetes Cluster

:::note

Every provider has its own requirements for creating and accessing the Kubernetes cluster. For AWS check the following [requirements](../installation/aws#configure-aws).

:::

Change into your `/[PROVIDER]` directory.

```
cd [PROVIDER]
$ terraform init
$ terraform apply
```

This will ask for the provider environmental variables, in the case of AWS: `aws_profile` and `aws_region`. You can provide these values when prompted on the Command Line or do one of the following alternatives:

- export them as AWS_REGION and AWS_PROFILE,
- export them as TF_VAR_aws_region and TF_VAR_aws_profile,
- store them, in a `terraform.tfvars` file in the same provider directory.

This step will take time, depending on the provider and architecture. Provisioning a full Kubernetes Cluster takes between 5 - 10 mins. On completion, it will output a `kube.conf` in the installation directory.

### 5. Install Airy on Cluster

```
$ cd ../airy-core
$ terraform init
$ terraform apply
```

Terraform will look for a Kube Config to connect to the cluster provisioned in Step 4. (or which you already have provisioned), and `helm` install `airy-core` onto it.

This will output a link to your UI, API, and source URLs.

### 6. Verify the installation

Connect to your new instance using `kube.conf` file inside your installation directory.

`kubectl get pods --kubeconfig ./kube.conf`

To uninstall, simply run `terraform destroy` in the `airy-core` directory first, and then once again in the `PROVIDER` directory.

## Uninstall step by step

For uninstalling Airy you need to destroy both of the environments that you have created. First destroy the `airy-core` environment:

```
$ cd ../airy-core
$ terraform destroy
```

Then destroy the PROVIDER environment:

```
cd [PROVIDER]
$ terraform destroy
```

## Install and uninstall using a script

In the [airy/infrastructure/terraform/install](https://github.com/airyhq/airy/tree/develop/infrastructure/terraform/install), there are scripts:

- `install.sh`
- `uninstall.sh`
- `install.flags`

These scripts provide a simple interface for the installation/uninstallation process. They are also used by the Airy CLI and are useful to check the file structure as well as ensure correct install/uninstall order.
