---
title: Run Airy on GCP
sidebar_label: GCP
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";

<TLDR>
Run Airy Core on GCP with one command.
</TLDR>

The goal of this document is to provide an overview of how to run Airy Core on Google Cloud Platform, using the [GCP Kubernetes Engine](https://cloud.google.com/kubernetes-engine).

## Services used

Apart from an Google Kubernetes Engine cluster, `airy create` will create of all the necessary GCP
resources for Airy Core to run:

| Service                                                                                | Resources                                                                                            | Pricing                                                                                                          | Description                                                                                                                                                | Overwrite [^1] |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| [**VPC**](https://cloud.google.com/vpc/docs/vpc)                                       | 1 VPC, 36 subnets with allowed Public IPs, 1 additional route table, 1 Internet gateway, DNS enabled | [ VPC pricing calculation](https://cloud.google.com/vpc/network-pricing#lb)                                      | VPC which will contain all the created compute and network resources                                                                                       | Yes            |
| [**GKE**](https://cloud.google.com/kubernetes-engine/docs)                             | 1 GKE cluster                                                                                        | [ GKE pricing calculation](https://cloud.google.com/products/calculator#id=e178295f-5232-4319-8a16-708052357202) | Kubernetes cluster to store all the Airy Core resources                                                                                                    | No             |
| [**GCE**](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images#cos)    | 6 Google Compute Engine Instances                                                                    | [GCE pricing calculation](https://cloud.google.com/products/calculator#id=0394acda-ce3a-4769-a453-9e2ea6ca4291)  | The instances are a part of the `Node Pool` attached to the GKE cluster. The default instance type is: `n1-standard-2`, OS type: `Container-Optimized OS`. | Yes            |
| [**CLB**](https://cloud.google.com/load-balancing/docs/network/networklb-target-pools) | 1 Cloud Load Balancer                                                                                | [CLB pricing calculation](https://cloud.google.com/products/calculator#id=da086850-b923-475e-a4bc-9edf3d73c9ed)  | Network (target pool-based)Load Balancer created by the ingress controller Kubernetes service                                                              | No             |

[^1]: Options which can be overwritten with flags to the `airy create` command.

## Configure

:::note

Prior to starting this guide, you must create an [GCP account](https://cloud.google.com/free). To create the cluster you must setup your local GCP environment, by [configuring your local GCP profile](https://cloud.google.com/sdk/docs/install-sdk)
for your GCP account where all the resources will be created.

:::

Once you have installed the GCloud CLI, you now need to configure the application
to be able to connect to your GCP account:

```
gcloud init
```

Through `gcloud init`, the GCloud CLI will prompt you for four pieces of
information.

```
gcloud init
Default region name [None]: us-central1
Default output format [None]: json
```

## Install

Download and install the [Airy CLI](cli/introduction.md).

:::warning

If you want to use Airy Core with auto-generated HTTPS certificates, refer to the [Let's Encrypt section](/getting-started/installation/gcp#https-using-lets-encrypt) for customizing your `airy.yaml` file before proceeding.

:::

Now you can run the following command in your Airy workspace, which will create a Kubernetes cluster with `Airy Core` in your Google account:

```bash
airy create --provider=gcp
```

This will execute the following actions:

1. Download two Terraform modules inside the `terraform` directory in the workspace. First module is for creating the GKE cluster, the second is for deploying `Airy Core` on that cluster.
2. Run the `install.sh` bash script inside the `terraform` directory.
3. Create an GKE cluster in your Google account (applying the `gcp-gke` state).
4. Deploy `Airy Core` in that cluster (applying the `airy-core` state).
5. Print URLs for accessing the UI and API.

If you want to customize your `Airy Core` instance please see our [Configuration
Section](configuration.md).

After the installation, you can also interact with the components of `Airy Core`
with the [kubectl](https://kubernetes.io/docs/tasks/tools/) command line
utility. You can find the kubeconfig of your Airy Core instance in
`WORKSPACE/terraform/kube.conf`.

## Verify

After the installation process, you can verify that all the pods are running with:

```
export KUBECONFIG=./terraform/kube.conf
kubectl get pods
```

## HTTPS using Let's Encrypt

You can customize your installation of `Airy Core` to install an ingress controller which has an enabled `Let's Encrypt` capability. The ingress controller will register and renew the certificates for you automatically.

### Setup your DNS

You should create an A DNS record for the specified public FQDN to point to the hostname of the LoadBalancer, created by GCP for the ingress service:

```sh
kubectl get --namespace kube-system service ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].ip}{"\n"}'
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

### Upgrade the instance

If the ingress controller is started before the DNS record is added, the initial Let's Encrypt requests will fail and then all the following registration attempts will be blocked and throttled. That is why the generation of the Let's Encrypt certificates is disabled by default. In order to complete the setup, you must run the upgrade command.

```sh
airy upgrade
```

After this, your `Airy Core` will be reachable under HTTPS and on your desired hostname (for example https://myairy.myhostname.com).

## Integrate public webhooks

The public webhooks will be accessible on the public hostname, at a path specific for each source individually.
Refer to the [sources documentation](/connectors/sources/introduction) for more information.

To get the public URL of your GCP Airy Core installation run:

```sh
airy api endpoint
```

## Customize your Airy Core installation

To customize your Airy Core installation, you can create an initial config file using the following command:

```sh
airy create --provider gcp --init-only
```

Then edit the `airy.yaml` file to your prefferences before deploying Airy with:

```sh
airy create --provider gcp
```

## Next steps

Now that you have a running installation of `Airy Core` on GCP you can connect it
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

To uninstall `Airy Core` from GCP, run the `uninstall.sh` script located in the `WORKSPACE/terraform` directory. This script will run `terraform destroy` on both the `kubernetes` (GKE) and the `airy-core` state.
