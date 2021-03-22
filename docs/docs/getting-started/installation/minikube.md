---
title: Run Airy on Minikube
sidebar_label: Minikube
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The goal of this document is to provide an overview of how to run Airy Core on
your local machine using [minikube](https://minikube.sigs.k8s.io/).

## Creating a cluster

First download and install minikube from their [release page](https://github.com/kubernetes/minikube/releases) and the [Airy CLI](cli/installation.md).
Now you can run this command, which will create a new minikube cluster on your system and install Airy core on it:

```bash
airy create --provider=minikube
```

This will print URLs for accessing the UIs and APIs as seen in this recording:

import Script from "@site/src/components/Script";

<Script data-cols="90" id="asciicast-KHz6yTASgqwnKT5FB7Gt7jF1k" src="https://asciinema.org/a/KHz6yTASgqwnKT5FB7Gt7jF1k.js"></Script>

If you want to customize your `Airy Core` instance please see our [Configuration Section](configuration.md).

## Public webhooks

In order to integrate with the webhook of most sources on your local machine,
we include a [ngrok](https://ngrok.com/) as a deployment to tunnel the traffic to the ingress controller.
ngrok is an open source reverse proxy which
creates a secure tunnel from a public endpoint to a local service. The ngrok
client connects to a ngrok server which has public access to the internet and
then provides a reversed proxy connectivity back to the webhook services,
running inside the Kubernetes cluster.

To get the ngrok URL of your local Airy Core installation you can run:

```sh
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

## Where to go from here

Now that you have a running local installation of Minikube you can connect it to messaging sources. Check out the
[source documentation](/sources/introduction.md) to learn more.

## Third party tools

Third party tools can be activated in the `airy.yaml` configuration file, under the `tools` section.
For more details please see our [Configuration Section](configuration.md).

## Uninstall Airy Core

You can remove the Airy Core minikube node from your machine completely running
the following command:

```sh
minikube -p airy-core destroy
```
