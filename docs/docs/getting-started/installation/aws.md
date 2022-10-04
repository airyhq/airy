---
title: Run Airy on AWS
sidebar_label: AWS
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";

<TLDR>
Run Airy Core on AWS with one command.
</TLDR>

The goal of this document is to provide an overview of how to run Airy Core on
AWS cloud platform, using the [AWS Elastic Kubernetes
Service](https://aws.amazon.com/eks/).

## Configure

:::note

Prior to starting this guide, you must create an [AWS
account](https://aws.amazon.com/free). We also recommend installing the [AWS
CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

:::

Once you have installed the AWS CLI, you now need to configure the application
to be able to connect to your AWS account:

```
aws configure
```

Through `aws configure`, the AWS CLI will prompt you for four pieces of
information. The first two are required. These are your [AWS access key ID and
AWS secret access
key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html),
which serve as your account credentials. You can generate new credentials within
AWS Identity and Access Management (IAM), if you do not already have them. The
other information you will need is region and output format, which you can leave
as default for the time being.

```
aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

## Services used

Apart from an EKS cluster, `airy create` will create of all the necessary AWS
resources for Airy Core to run:

|                        Service & pricing                        | Resources created by default                                                                        | Description                                                                                                                            | Overwrite [^1] |
| :-------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
|         [**VPC**](https://aws.amazon.com/vpc/pricing/)          | 1 VPC, 2 subnets with allowed Public IPs, 1 additional route table, 1 Internet gateway, DNS enabled | VPC which will contain all the created compute and network resources                                                                   |      Yes       |
|                          **IAM** [^2]                           | 1 IAM role with attached policies [^3]                                                              | IAM role used for managing the EKS cluster and the node groups                                                                         |       No       |
|    [**EKS**](https://calculator.aws/#/createCalculator/EKS)     | 1 EKS cluster                                                                                       | Kubernetes cluster to store all the Airy Core resources                                                                                |       No       |
|    [**EC2**](https://calculator.aws/#/createCalculator/EC2)     | 2 EC2 instances, 4 EBS Volumes (10GB gp2 each)                                                      | The instances are a part of the `Node group` attached to the EKS cluster. The default instance type is: `c5.xlarge`, os type: `Linux`. |      Yes       |
|     [**S3**](https://calculator.aws/#/createCalculator/S3)      | /                                                                                                   | Optional for the "Media resolver" component. Should be created independently. [^4]                                                     |      Yes       |
| [**ELB**](https://aws.amazon.com/elasticloadbalancing/pricing/) | 1 Elastic Load Balancer                                                                             | Network Load Balancer created by the ingress controller Kubernetes service                                                             |       No       |

[^1]: Options which can be overwritten with flags to the `airy create` command.
[^2]: IAM roles are free of charge.
[^3]: Attached policies: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy", "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy", "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly", "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy".
[^4]: The s3 bucket will should have PublicRead privileges. For writing to the S3 bucket, AWS credentials must be [configured](/getting-started/installation/configuration.md#components) in the `airy.yaml` file.

Airy Core doesn't require extensive resources to run. However, you should consider the `AWS Service Limits` or `AWS Service Quotas` when deploying on AWS. If some of the resources cannot be created due to existing quotas in your AWS account, refer to the [following dashboard](https://eu-central-1.console.aws.amazon.com/servicequotas/home/) to modify them.

Refer to the following links for more information on AWS Service Limits:

- [AWS Service Quotas](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html)
- [AWS Well-Architected Framework Concepts](https://wa.aws.amazon.com/wellarchitected/2020-07-02T19-33-23/wat.concept.service-limits.en.html)

## Install

To create the cluster you must setup your local AWS environment, by [configuring
your local AWS
profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
for the AWS account where all the resources will be created.

Download and install the [Airy CLI](cli/introduction.md).

Export your AWS_PROFILE and AWS_REGION as described in the [AWS
documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html).

:::warning

If you want to use Airy Core with auto-generated HTTPS certificates, refer to the [Let's Encrypt section](/getting-started/installation/aws#https-using-lets-encrypt) for customizing your `airy.yaml` file before proceeding.

:::

Now you can run the following command in your Airy workspace, which will create a Kubernetes cluster with `Airy Core` in your AWS account:

```bash
airy create --provider=aws
```

This will execute the following actions:

1. Download two Terraform modules inside the `terraform` directory in the workspace. First module is for creating the EKS cluster, the second is for deploying `Airy Core` on that cluster.
2. Run the `install.sh` bash script inside the `terraform` directory.
3. Create an EKS cluster in your AWS account (applying the `aws-eks` state).
4. Deploy `Airy Core` in that cluster (applying the `airy-core` state).
5. Print URLs for accessing the UI and API.

If you want to customize your `Airy Core` instance please see our [Configuration
Section](configuration.md).

After the installation, you can also interact with the components of `Airy Core`
with the [kubectl](https://kubernetes.io/docs/tasks/tools/) command line
utility. You can find the kubeconfig of your Airy Core instance in
`WORKSPACE/terraform/kube.conf`.

### Verification

After the installation process, you can verify that all the pods are running with

```
kubectl get pods --kubeconfig .terraform/kube.conf
```

### Common issues

AWS has a limit on the number of objects you can create depending on your account.

```
Error creating vpc:  operation error EC2: CreateVpc, https response error StatusCode: 400, RequestID: 64210ff5-9aca-4ab7-b993-3727637a59d6, api error VpcLimitExceeded: The maximum number of VPCs has been reached.
```

When encountering this, you can delete some of the resources just as described
on [here](/getting-started/installation/aws#uninstall-airy-core)

## Secure your Airy core

:::warning
Authentication and HTTPS are disabled by default in Airy Core.

As this is intended **only for testing purposes**, `it is mandatory that you to secure your Airy Core installation` as explained in this section.

:::

### Authentication

To enable authenticaiton to the API and in the UI, refer to our [Authentication configuration section](/getting-started/installation/security)

### HTTPS with existing certificates

This section guides you through the necessary steps to configure HTTPS on your `Airy Core` instance.

#### Upload certificates to AWS ACM

You should use a valid HTTPS certificate to secure your `Airy Core` instance. This certificate is created for and can only be used with a specific hostname. This hostname will be the FQDN on which `Airy Core` will be reachable.

Usually these HTTPS certificates come as a bundle of:

- private key (private.key)
- public certificate (public.crt)
- public certificate authority bundle file (ca-bundle.crt)

Use the following command to upload your HTTPS certificate files to AWS ACM, so that they can be used by the AWS LoadBalancer.

```sh
aws acm import-certificate --certificate fileb://public.crt --certificate-chain fileb://ca-bundle.crt --private-key fileb://private.key --region us-east-1
```

After the certificate has been uploaded to AWS ACM, you will need the unique ARN of the certificate,for the next step.

:::note

If you don't have your own HTTPS certificate you can request one from AWS ACM.

:::

#### Upgrade your Airy Core instance

Edit your `airy.yaml` file and add the following configuration:

```
ingress-controller:
  host: "The-fqdn-used-in-your-certificate"
  https: true
  httpsTermination: "LoadBalancer"
  httpsCertificate: "Your-unique-ACM-ARN"
```

Upgrade your Airy Core instance

```sh
airy upgrade
```

#### Setup your DNS

You should create a CNAME DNS record for the specified public FQDN to point to the hostname of the LoadBalancer, created by AWS for the ingress service:

```sh
kubectl get --namespace kube-system service ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

#### Print HTTPS endpoint

At this point, the frontend and the API services of `Airy Core` should be accessible through HTTPS on the specific hostname:

```sh
airy api endpoint
```

### HTTPS using Let's Encrypt

You can customize your installation of `Airy Core` to install an ingress controller which has an enabled `Let's Encrypt` capability. The ingress controller will register and renew the certificates for you automatically.

#### Customize your Airy Core installation

To customize your Airy Core installation, you need to create an initial config file using the following command

```sh
airy create --provider aws --init-only
```

Then edit your `airy.yaml` file and add the following configuration

```sh
global:
  host: myairy.myhostname.com
  ingress:
    letsencrypt: true
ingress-controller:
  https: true
  letsencryptEmail: "mymail@myhostname.com"
```

The `ingress.host` value should be set to your desired hostname. Configure the e-mail address you want to use for your Let's Encrypt registration under `ingress.letsencryptEmail`.

After setting these parameters, create your `Airy Core` instance with the following option:

```sh
airy create --provider aws
```

:::note
In case you have created your Airy Core instance without Let's Encrypt and want to add it later, modify your `airy.yaml` file accordingly and continue with the process from the next section.
:::

#### Setup your DNS

You should create a CNAME DNS record for the hostname that you set under `ingress.host` in the previous step to point to the hostname of the LoadBalancer, created by AWS for the ingress service:

```sh
export KUBECONFIG="PATH/TO/DIR/kube.conf"
kubectl get --namespace kube-system service ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

#### Run airy upgrade

If the ingress controller is started before the DNS record is added, the initial Let's Encrypt requests will fail and then all the following registration attempts will be blocked and throttled. That is why the generation of the Let's Encrypt certificates is disabled by default. In order to complete the setup, you must run the upgrade command.

```sh
airy upgrade
```

After this, your `Airy Core` will be reachable under HTTPS and on your desired hostname (for example https://myairy.myhostname.com).

## Integrate public webhooks

The public webhooks will be accessible on the public hostname, at a path specific for each source individually.
Refer to the [sources documentation](/sources/introduction) for more information.

To get the public URL of your AWS Airy Core installation run:

```sh
airy api endpoint
```

## Next steps

Now that you have a running installation of `Airy Core` on AWS you can connect it
to messaging sources. Check out our Quickstart guide to learn more:

<ButtonBox
icon={<DiamondSVG />}
iconInvertible={true}
title='To the Quick Start'
description='Learn the Airy Basics with our Quick Start'
link='getting-started/quickstart'
/>

## Third party tools

Third party tools can be activated in the `airy.yaml` configuration file, under the `tools` section.
For more details please see our [Configuration Section](configuration.md).

## Uninstall Airy Core

To uninstall `Airy Core` from AWS, run the `uninstall.sh` script located in the `WORKSPACE/terraform` directory. This script will run `terraform destroy` on both the `kubernetes` (EKS) and the `airy-core` state.
