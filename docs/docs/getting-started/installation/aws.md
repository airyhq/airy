---
title: AWS
sidebar_label: AWS
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<TLDR>

Install Airy Core on AWS with one command.

</TLDR>

The goal of this document is to provide an overview of how to run Airy Core on
AWS cloud platform, using the [AWS Elastic Kubernetes Service](https://aws.amazon.com/eks/).

Apart from the EKS cluster, the installation will create all the necessary AWS resources, such as:

- VPC resources (VPC, subnets, route tables, public gateways)
- IAM roles and policy attachments
- EKS cluster and EKS node groups
- EC2 instances, as part of the created node group

## Creating a cluster

For creating the cluster you would need to setup your local AWS environment, by [configuring your local AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) for the AWS account where all the resources will be created.

Download and install the [Airy CLI](cli/installation.md).

Export your AWS_PROFILE as described in the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html).

Now you can run this command, which will create Airy core in your AWS account:

```bash
airy create --provider=aws
```

By default, the installation will create a single EC2 Kubernetes node, as part of a single node group. You can scale your EKS cluster by adding more nodes or node groups through the AWS web console or the AWS CLI.

The `create` command will print URLs for accessing the UIs and APIs as seen in this recording:

import Script from "@site/src/components/Script";

<Script data-cols="90" id="asciicast-KHz6yTASgqwnKT5FB7Gt7jF1k" src="https://asciinema.org/a/KHz6yTASgqwnKT5FB7Gt7jF1k.js"></Script>

If you want to customize your `Airy Core` instance please see our [Configuration Section](configuration.md).

## Public webhooks

The public webhooks will be accessible on the public LoadBalancer which is created by the Ingress loadBalancer Kubernetes service.

To get the public URL of your AWS Airy Core installation you can run:

```sh
kubectl --kubeconfig ~/.airy/kube.conf get --namespace kube-system service traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Where to go from here

Now that you have a running local installation of Airy core on AWS you can connect it to messaging sources. Check out the
[source documentation](/sources/introduction.md) to learn more.

## Third party tools

Third party tools can be activated in the `airy.yaml` configuration file, under the `tools` section.
For more details please see our [Configuration Section](configuration.md).

## Uninstall Airy Core

You can remove the Airy Core AWS installation by deleting the Airy Core AWS resources with the [AWS CLI CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

Retrieve the ID of the installation:

```sh
id=$(cat ~/.airy/cli.yaml | grep contextname | awk '{ print $2; }')
echo ${id}
```

Make sure that the ID was printed back to you, before proceeding with the deletion of the resources.

Delete the EKS nodegroup.

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

Get the ID of the VPC:

```sh
vpc_id=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=${id} --query 'Vpcs[0].VpcId' --output text)
```

Delete all the load-balancers

```sh
for loadbalancer in $(aws elb describe-load-balancers --query "LoadBalancerDescriptions[?VPCId=='${vpc_id}'].LoadBalancerName" --output text)
do
  aws elb delete-load-balancer --load-balancer-name ${loadbalancer}
done
```

Delete all used network interfaces

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

Delete all the subnets in the VPC

```sh
for subnet in $(aws ec2 describe-subnets --filters Name=vpc-id,Values=${vpc_id} --query 'Subnets[].SubnetId' --output text)
do
    aws ec2 delete-subnet --subnet-id ${subnet}
done
```

Delete the gateways and the routes in the VPC

```sh
for gateway in $(aws ec2 describe-internet-gateways --filters Name=attachment.vpc-id,Values=${vpc_id} --query 'InternetGateways[].InternetGatewayId' --output text)
do
    aws ec2 detach-internet-gateway --internet-gateway-id ${gateway} --vpc-id ${vpc_id}
    aws ec2 delete-internet-gateway --internet-gateway-id ${gateway}
done
for route_table in $(aws ec2 describe-route-tables --filters Name=vpc-id,Values=${vpc_id} --query 'RouteTables[].RouteTableId' --output text)
do
    aws ec2 delete-route-table --route-table-id ${route_table}
done
```

At the end, delete the VPC:

```sh
aws ec2 delete-vpc --vpc-id ${vpc_id}
```
