---
title: Minikube
sidebar_label: Minikube
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The goal of this document is to provide an overview of how to run Airy Core on
your local machine using [Minikube](https://minikube.sigs.k8s.io/).

## Creating a cluster using the CLI

First download and install Minikube from their [release page](https://github.com/kubernetes/minikube/releases) and the [Airy CLI](cli/installation.md).
Now you can run this command, which will create a new Minikube cluster on your system and install Airy core on it:

```bash
airy create --provider=minikube
```

This will print URLs for accessing the UIs and APIs (TODO screenshot) 

If you want to customize your `Airy Core` instance please see our [Configuration Section](configuration.md).

## Public webhooks

The public webhook URL is generated during the bootstrap process and are
displayed after the process finishes.

In order to integrate with the webhook of most sources on your local machine,
we include a [ngrok](https://ngrok.com/) client as a sidecar to the ingress controller. 
ngrok is an open source reverse proxy which
creates a secure tunnel from a public endpoint to a local service. The ngrok
client connects to a ngrok server which has public access to the internet and
then provides a reversed proxy connectivity back to the webhook services,
running inside the Kubernetes cluster.

By default, the ngrok client is configured to use the ngrok server created by
Airy and run on https://tunnel.airy.co. This configuration is specified in
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

## Connect sources

Integrating sources into the `Airy Core` often requires specific configuration
settings, refer to the [source specific docs](/sources/introduction.md) for details.

## External tools

The optional external tools can be activated in the `airy.yaml` configuration file, under the `tools` section.
For more details please see our [Configuration Section](configuration.md).

## Uninstall Airy Core

You can remove the Airy Core Minikube node from your machine completely running
the following command:

```sh
minikube -p airy-core destroy
```
