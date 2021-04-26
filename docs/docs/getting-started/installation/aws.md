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
AWS Identity and Access Management (IAM) if you do not already have them. The
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

Now you can run this command, which will create `Airy Core` in your AWS account:

```bash
airy create --provider=aws
```

You can also use an existing VPC, without creating additional VPC resources:

```bash
airy create --provider aws --provider-config vpcId=myExistingVpcId
```

This will execute the following actions:

1. Create the `my-airy` directory and populate it with the configuration that
   the CLI will need. All subsequent commands need to either be run from this
   directory or use the `--config-dir` flag.
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

## Enable HTTPS

This section explains all the steps needed to configure HTTPS on your `Airy Core` instance.

Create a self-signing certificate (skip step if you already have your existing https certificate).
The certificates will be created in your `~/.airy/certs` directory, using the OpenSSL utility.

```sh
mkdir -p ~/.airy/certs/
cd ~/.airy/certs/
openssl genrsa 2048 > private.key
openssl req -new -x509 -nodes -sha1 -days 3650 -extensions v3_ca -key private.key > public.crt
-----
Country Name (2 letter code) [DE]:DE
State or Province Name (full name) [Berlin]:Berlin
Locality Name (eg, city) []:Berlin
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Airy GmbH
Organizational Unit Name (eg, section) []:Development
Common Name (e.g. server FQDN or YOUR name) []:*.elb.amazonaws.com
Email Address []:sre@airy.co
```

Note that when generating the public certificate `public.crt` you must specify a common namd of fqdn, otherwise the certificate will not be used by the AWS LoadBalancer.

Next you should upload your certificates to the AWS certificates manager (ACM).

```sh
aws acm import-certificate --certificate fileb://public.crt --private-key fileb://private.key --region us-east-1
```

In case you have your own certificates and have one more file with the certificate chain, you can also specify that file as anadditional `--certificate` value.

Get the address of your LoadBalancer, assuming that you have your `kube.conf` file in the current working directory:

```sh
lb=$(kubectl --kubeconfig ./kube.conf  get service traefik -n kube-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
```

Modify the existing ingress service to reconfigure the AWS LoadBalancer.

```sh
kubectl --kubeconfig ./kube.conf -n kube-system annotate service traefik "service.beta.kubernetes.io/aws-load-balancer-backend-protocol=http"
kubectl --kubeconfig ./kube.conf -n kube-system annotate service traefik "service.beta.kubernetes.io/aws-load-balancer-ssl-cert=${lb}"
kubectl --kubeconfig ./kube.conf -n kube-system annotate service traefik "service.beta.kubernetes.io/aws-load-balancer-ssl-ports=https"
kubectl --kubeconfig ./kube.conf -n kube-system patch service traefik --patch '{"spec": { "type": "LoadBalancer", "ports": [ { "name": "https", "port": 443, "protocol": "TCP", "targetPort": 80 } ] } }'
```

Then the frontend and the API services of `Airy Core` will be accessible through https on the URL of the loadbalancer:

```sh
kubectl --kubeconfig ./kube.conf -n kube-system get service traefik --output jsonpath='https://{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

## Integrate public webhooks

The public webhooks will be accessible on the public LoadBalancer which is
created by the Ingress loadBalancer Kubernetes service.

To get the public URL of your AWS Airy Core installation, asuming that your `kube.conf` file is in the current working directory, you can run:

```sh
kubectl --kubeconfig ./kube.conf get --namespace kube-system service traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}{"\n"}'
```

## Next steps

Now that you have a running installation of `Airy Core` on AWS you can connect it
to messaging sources. Check out our quickstart guide:

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

Delete all used network interfaces (iIf the command fails, please check if all the `loadbalancers` are deleted and run the previous command one more time):

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

Delete the route tables (expect that the command will fail for the default route table, but still you shouldn't have any problem deleting the VPC in the next step):

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
