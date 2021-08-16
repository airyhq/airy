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

## Configure AWS

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

Apart from an EKS cluster, `airy create` will take care of all the necessary AWS
resources, such as:

- VPC resources (VPC, subnets, route tables, public gateways)
- IAM roles and policy attachments
- EKS cluster and EKS node groups
- EC2 instances, as part of the created node group

## Create a cluster

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

Now you can run this command, which will create `Airy Core` in your AWS account:

```bash
airy create --provider=aws
```

You can also use an existing VPC, without creating additional VPC resources:

```bash
airy create --provider aws --provider-config vpcId=myExistingVpcId
```

By default the command creates an AWS NodeGroup with two `c5.xlarge` instances.
For customizing the instance type run:

```bash
airy create --provider aws --provider-config instanceType=c5.large
```

This will execute the following actions:

1. Create the `my-airy` directory and populate it with the configuration that
   the CLI will need. All subsequent commands need to either be run from this
   directory or use the `--workspace` flag.
2. Start an Airy Core cluster in your AWS account.
3. Print URLs for accessing the UIs and APIs (see recording).

By default, the installation will create a single EC2 Kubernetes node, as part
of a single node group. You can scale your EKS cluster by adding more nodes or
node groups through the AWS web console or the AWS CLI.

import Script from "@site/src/components/Script";

<Script data-cols="120" data-rows="32" id="asciicast-HwezTgcr35UnwLpSviktLICEZ" src="https://asciinema.org/a/HwezTgcr35UnwLpSviktLICEZ.js"></Script>

If you want to customize your `Airy Core` instance please see our [Configuration
Section](configuration.md).

After the installation, you can also interact with the components of `Airy Core`
with the [kubectl](https://kubernetes.io/docs/tasks/tools/) command line
utility. You can find the kubeconfig of your Airy Core instance in
`~/.airy/kube.conf`.

### Verification

After the installation process, you can verify that all the pods are running with

```
kubectl get pods --kubeconfig ./kube.conf
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

#### Configure the ingress service

Locate and set your KUBECONFIG file and set the other environment variables:

```sh
export KUBECONFIG="PATH/TO/DIR/kube.conf"
export ARN="Your-unique-ACM-ARN"
export HOSTNAME="public-FQDN"
```

Modify the existing ingress service to reconfigure the AWS LoadBalancer:

```sh
kubectl -n kube-system annotate service traefik "service.beta.kubernetes.io/aws-load-balancer-ssl-ports=443" "service.beta.kubernetes.io/aws-load-balancer-ssl-cert=${ARN}"
kubectl -n kube-system patch service traefik --patch '{"spec": { "ports": [ { "name": "https", "port": 443, "protocol": "TCP", "targetPort": 80 } ] } }'
```

Update the `hostnames` configMap with the new https endpoint:

```sh
kubectl patch configmap hostnames --patch "{\"data\": { \"HOST\": \"https://${HOSTNAME}\"} }"
```

Update the existing ingress resources with the new hostname (for this you will additionally require the [jq](https://stedolan.github.io/jq/download/) utility):

```sh
kubectl get ingress airy-core -o json | jq "(.spec.rules[0].host=\"${HOSTNAME}\")" | kubectl apply -f -
kubectl get ingress airy-core-ui -o json | jq "(.spec.rules[0].host=\"${HOSTNAME}\")" | kubectl -f -
kubectl get ingress airy-core-redirect -o json | jq "(.spec.rules[0].host=\"${HOSTNAME}\")" | kubectl -f -
```

#### Setup your DNS

You should create a CNAME DNS record for the specified public FQDN to point to the hostname of the LoadBalancer, created by AWS for the ingress service:

```sh
kubectl get --namespace kube-system service traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

#### Print HTTPS endpoint

At this point, the frontend and the API services of `Airy Core` should be accessible through HTTPS on the specific hostname:

```sh
airy api endpoint
```

### HTTPS using Let's Encrypt

You can customize your installation of `Airy Core` to install a custom Traefik ingress controller which has an enabled `Let's Encrypt` capability. The ingress controller will register and renew the certificates for you automatically.

#### Customize your Airy Core installation

To customize your Airy Core installation, you need to create an initial config file using the following command

```sh
airy create --provider aws --init-only
```

Then edit your `airy.yaml` file and add the following configuration

```sh
kubernetes:
  host: myairy.myhostname.com
ingress:
  https: true
  letsencryptEmail: "mymail@myhostname.com"

```

The `kubernets.host` value should be set to your desired hostname. Configure the e-mail address you want to use for your Let's Encrypt registration under `ingress.letsencryptEmail`.

After setting these parameters, create your `Airy Core` instance with the following option:

```sh
airy create --provider aws --provider-config hostUpdate=false
```

:::note
In case you have created your Airy Core instance without Let's Encrypt and want to add it later, you must use the `airy upgrade` command.

Even if you don't upgrade to a new version, just modify your `airy.yaml` file as explained in this section and run

`airy upgrade`

After the upgrade is done, continue with setting up your DNS and starting the ingress controller.
:::

#### Setup your DNS

You should create a CNAME DNS record for the hostname that you set under `kubernetes.host` in the previous step to point to the hostname of the LoadBalancer, created by AWS for the ingress service:

```sh
export KUBECONFIG="PATH/TO/DIR/kube.conf"
kubectl get --namespace kube-system service traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

#### Start the ingress controller

If the ingress controller is started before the DNS record is added, the Let's Encrypt servers will block and throttle the registration attempts. That is why we recommend starting the ingress controller after the DNS record is added.

```sh
kubectl -n kube-system scale statefulset -l k8s-app=traefik-ingress-lb --replicas=1
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

You can remove the Airy Core AWS installation by deleting the Airy Core AWS resources with the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

Retrieve the ID of the installation, in this case `my-airy` is the name of the installation that was passed on the creation process:

```sh
cd my-airy
id=$(cat cli.yaml | grep contextname | awk '{ print $2; }')
echo ${id}
```

Make sure that the ID was printed back to you, before proceeding with the deletion of the resources.

Delete the EKS nodegroup:

```sh
node_group_name=$(aws eks list-nodegroups --cluster-name ${id} --query 'nodegroups[0]' --output text)
aws eks delete-nodegroup --nodegroup-name $node_group_name --cluster-name ${id}
```

Delete the EKS cluster:

```sh
while ! aws eks delete-cluster --name ${id}
do
  echo "Waiting for EKS nodegroup to be deleted..."
  sleep 15
done
```

Delete the created IAM Role:

```sh
for policy in $(aws iam list-attached-role-policies --role-name ${id} --query 'AttachedPolicies[].PolicyArn' --output text)
do
    aws iam detach-role-policy --policy-arn ${policy} --role-name ${id}
done
aws iam delete-role --role-name ${id}
```

If you used an existing VPC, then you already removed `Airy Core` from your infrastructure and there is no need to run any additional commands.
If not, you can proceed with removing all the VPC resources, created exclusively for `Airy Core`.

Get the ID of the VPC:

```sh
vpc_id=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=${id} --query 'Vpcs[0].VpcId' --output text)
```

Delete all the load-balancers:

```sh
for loadbalancer in $(aws elb describe-load-balancers --query "LoadBalancerDescriptions[?VPCId=='${vpc_id}'].LoadBalancerName" --output text)
do
  aws elb delete-load-balancer --load-balancer-name ${loadbalancer}
done
```

Delete all used network interfaces (iIf the command fails, check if all the `loadbalancers` are deleted and run the previous command one more time):

```sh
for interface in $(aws ec2 describe-network-interfaces --filters Name=vpc-id,Values=${vpc_id} --query 'NetworkInterfaces[].NetworkInterfaceId' --output text)
do
  aws ec2 delete-network-interface --network-interface-id ${interface}
done
```

Delete the security groups created by the load-balancers:

```sh
for group in $(aws ec2 describe-security-groups --filters Name=vpc-id,Values=${vpc_id} --filters Name=tag-key,Values=kubernetes.io/cluster/${id} --query 'SecurityGroups[].GroupId' --output text)
do
  aws ec2 delete-security-group --group-id ${group}
done
```

Delete all the subnets in the VPC:

```sh
for subnet in $(aws ec2 describe-subnets --filters Name=vpc-id,Values=${vpc_id} --query 'Subnets[].SubnetId' --output text)
do
    aws ec2 delete-subnet --subnet-id ${subnet}
done
```

Delete the gateways and the routes in the VPC:

```sh
for gateway in $(aws ec2 describe-internet-gateways --filters Name=attachment.vpc-id,Values=${vpc_id} --query 'InternetGateways[].InternetGatewayId' --output text)
do
    aws ec2 detach-internet-gateway --internet-gateway-id ${gateway} --vpc-id ${vpc_id}
    aws ec2 delete-internet-gateway --internet-gateway-id ${gateway}
done
```

Delete the route tables (the command will always fail for the default route table, but you can still delete the VPC in the next step):

```sh
for route_table in $(aws ec2 describe-route-tables --filters Name=vpc-id,Values=${vpc_id} --query 'RouteTables[].RouteTableId' --output text)
do
    aws ec2 delete-route-table --route-table-id ${route_table}
done
```

At the end, delete the VPC:

```sh
aws ec2 delete-vpc --vpc-id ${vpc_id}
```
