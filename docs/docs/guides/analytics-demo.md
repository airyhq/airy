---
title: Analytics Demo
sidebar_label: Analytics Demo
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>

After finishing this guide you will have your own Airy Core instance running on
AWS. It will be preloaded with some example conversations and a Metabase
dashboard, giving you an overview of the demo data. To drill down
even further, a Jupyter Notebook is deployed for you to run your first
conversational analytics.

</TLDR>

## Demo Dashboard

The following
[Metabase Demo Dashboard](https://dashboard.airy.co/dashboard/14?date_range=2021-08-24~2021-08-24)
shows you some basic KPIs you can get from the data that the Airy Platform
stores for you of your conversational traffic.

Credentials:

```
analytics-demo@airy.co
vcGNvboSnhE5Vb
```

## Requirements

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) v1.0.0+
- [Airy CLI](https://airy.co/docs/core/cli/introduction) v0.31.0+
- AWS IAM Role with permissions to create a VPC and an EC2 instance
- [Kubectl](https://kubernetes.io/docs/tasks/tools/) (optional)

## Setup

The included Terraform code will launch a small EC2 instance running a
minikube cluster that hosts the full Airy Core platform as well as a JupyterHub
deployment.

### Customize your infrastructure

First, clone the Airy repository and go to the directory of the analytics demo.

```
git clone https://github.com/airyhq/airy.git
cd infrastructure/terraform/demos/analytics
```

Now you need to provide Terraform with the AWS credentials for our IAM Role. If
you don't know how to create one, [follow these
instructions](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/).
They have to be put into a `terraform.tfvars` file that looks like:

```
aws_access_key = "<YOUR_AWS_ACCESS_KEY>"
aws_secret_key = "<YOUR_AWS_SECRET_KEY>"
```

In the `terraform.tfvars` file, you can change the following variables
according to your preferences, or keep the defaults that we have set.

- aws_region
- aws_zones
- vpc_name
- tags
- core_version
- host
- hosted_zone

Especially the last two should be set if you wish to use the user interface.

### Customize your Airy Core instance

We have provided you with a configuration file for the Airy Core instance in
`infrastructure/terraform/demos/analytics/files/values.yaml` with sensible
default values. But, you can change it according to our
[documentation](https://airy.co/docs/core/getting-started/installation/configuration).

### Apply Terraform

To setup the Terraform modules, you first have to run:

```
terraform init
```

When you are happy with your configuration, run:

```
terraform apply
```

Have a look at the plan that is printed out. Then type `yes` and hit enter. It
will take some time for AWS to provision the infrastructure.

## Airy Core UI

To access the user interface you have to allow inbound connections to your EC2
instance from the AWS console. When you have opened the EC2 console, click on the
security group of the analytics demo instance as highlighted below.

<img alt="ec2_security_group"
src={useBaseUrl('img/guides/analytics-demo/ec2_security_group.png')} />

On the following page click on `Edit inbound rules` and then `Add rule`. Enter
30000 as the port range. You can either allow just your IP, or you can enter
this CIDR block `0.0.0.0/0` to allow all IP addresses.

Enter the following updated with your details into your browser.

`http://<your-host>.<your-hosted-zone>:30000`

<img alt="airy_core_ui"
src={useBaseUrl('img/guides/analytics-demo/airy_core_ui.png')} />

## Jupyter Notebook

The JupyterHub deployment comes with an elastic load balancer for which you can get the URL
by running the following, and copying the EXTERNAL-IP in the address bar of your
browser:

`kubectl get svc proxy-public`

A login window should appear. Enter your name and simply click login.

<img alt="jupyterhub"
src={useBaseUrl('img/guides/analytics-demo/jupyterhub.png')} />

### Creating a Pandas dataframe from the data stored on S3

Open the `create_df_from_parquet.ipynb` and run the entire notebook. You now
have a `df` object containing all the messages in the Airy
`application_communication_messages` format.

<img alt="fake_data_df"
src={useBaseUrl('img/guides/analytics-demo/fake_data_df.png')} />

### Loading the demo data into your platform

Open the `fake_data.ipynb` notebook and make sure the `system_token` and `host`
are the same values you put into your `airy.yaml`.

When running the notebook you should start getting data flowing in
about movie preference conversations.

<img alt="fake_data_inbox"
src={useBaseUrl('img/guides/analytics-demo/fake_data_inbox.png')} />

## Cleanup

To get rid of everything that we have previously created, all you have to do is:

`terraform destroy`
