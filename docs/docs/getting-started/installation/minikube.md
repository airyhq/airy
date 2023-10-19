---
title: Run Airy on minikube
sidebar_label: Minikube
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";

<TLDR>
Run Airy on minikube with one command.
</TLDR>

The goal of this document is to provide an overview of how to run Airy Core on
your local machine using [minikube](https://minikube.sigs.k8s.io/).

## Requirements

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) v1.2.0+
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)

## Install

:::note

By default the UI and the API will be available at `http://localhost`.
Make sure you don't have any other process using port 80 on your localhost interface

:::

First install minikube using [their documentation](https://kubernetes.io/de/docs/tasks/tools/install-minikube/). Minikube version v1.19.0 or higher is required.

Next you also need to install the [Airy CLI](cli/introduction.md). Now you can run this command, which will create a new
minikube cluster on your system and install Airy core on it:

```bash
airy create --provider=minikube my-airy
```

This will execute the following actions:

1. Create the `my-airy` directory and populate it with the configuration that the CLI will need. All subsequent commands need to either be run from this directory or use the `--workspace` flag.
2. Fetch the required Terraform modules in the `terraform` subdirectory, including the `install.sh` and `uninstall.sh` scripts.
3. Run the `install.sh` script
4. Start a minikube cluster on your system using Terraform, under the profile `airy-core`.
5. Install the `Airy Core` helm chart on the minikube instance using Terraform (in a separate Terraform state then the minikube instance).
6. Print the resulting URLs on which you can access the `Airy Core` installation and some additional information.

:::note

The base URL for the [API](../../api/introduction.md) is the same to access the UI through your browser.
You can use the printed `ngrok` URL to connect to different [sources](../../connectors/sources/introduction.md) to the instance running on your local machine.

:::

To customize your Minikube instance, you can adjust the `driver`, `cpus` and `memory` attributes in the following manner:

```
airy create --provider=minikube --provider-config driver=virtualbox,cpus=4,memory=8192 my-airy
```

If you want to customize your `Airy Core` instance please see our [Configuration
Section](configuration.md).

After the installation, you can also interact with the components of `Airy Core` with the [kubectl](https://kubernetes.io/docs/tasks/tools/) command line utility. `airy create` creates the kubeconfig file `kube.conf` under the `terraform` directory in your workspace.

:::note

If the `airy create` command fails and you have installed a hypervisor for the first time, double-check that you have given it all the necessary permissions on your local machine. More information will be printed in the output from the Terraform installation.

:::

## Configure

For more details on configuring your `Airy Core` instance please see our [Configuration Section](configuration.md). Under the `tools` section you can also find information on installing and activating third party tools for more detailed Kafka and data debugging.

## Integrate public webhooks

In order to integrate with the webhook of most sources on your local machine, we
include a [ngrok](https://ngrok.com/) as a deployment to tunnel the traffic to
the ingress controller. ngrok is an open source reverse proxy which creates a
secure tunnel from a public endpoint to a local service. The ngrok client
connects to a ngrok server which has public access to the internet and then
provides a reversed proxy connectivity back to the webhook services, running
inside the Kubernetes cluster.

To get the ngrok URL of your local Airy Core installation you can run:

```sh
export KUBECONFIG=./terraform/kube.conf
echo "https://$(minikube -p airy-core kubectl -- get cm core-config -o jsonpath='{.data.CORE_ID}').tunnel.airy.co"
```

By default, the ngrok client is configured to use the ngrok server created by
Airy and runs on https://tunnel.airy.co. This configuration is specified in
the `ngrok-client-config` ConfigMap.

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: ngrok-client-config
  namespace: default
data:
  config.yml: |
    server_addr: proxy.tunnel.airy.co:4443
    trust_host_root_certs: true
```

If you prefer to use your own ngrok implementation or point the ngrok client to
connect to the service provided by the ngrok company at `https://ngrok.io`,
change the setting for `server_addr` in the ConfigMap.

## Next steps

Now that you have a running local installation of minikube you can connect it to
messaging sources. Check out our Quickstart guide to learn more:

<ButtonBox
icon={<DiamondSVG />}
iconInvertible={true}
title='To the Quick Start'
description='Learn the Airy Basics with our Quick Start'
link='getting-started/quickstart'
/>

## Uninstall

To uninstall `Airy Core` from AWS, run the `uninstall.sh` script located in the `WORKSPACE/terraform` directory. This script will run `terraform destroy` on both the `kubernetes` (minikube) and the `airy-core` state.

```
cd terraform
./uninstall.sh
```

Deleting the minikube instance also removes Airy completely from your system:

```sh
minikube -p airy-core delete
```
