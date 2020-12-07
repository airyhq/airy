---
title: Running the Airy Core Platform in a test environment
sidebar_label: Test
---

The goal of this document is to provide an overview of how to run the Airy Core Platform on your local machine.

To facilitate bootstrapping the Airy Core Platform on a single machine, we
included a [Vagrant](https://www.vagrantup.com) configuration, inside the
`infrastructure` directory.

The Vagrant box is based on Alpine Linux and contains a pre-configured
Kubernetes cluster [K3OS](https://k3os.io/) to deploy and run the Airy Core
Platform. components.

## Getting started

To bootstrap a test installation, refer to the [bootstrapping](/index.md#bootstrapping-the-airy-core-platform) document.

## Debug your installation

You can ssh inside the Airy Core Platform box for testing and debugging purposes
with `vagrant ssh` or run commands directly with `vagrant ssh -c COMMAND`

### Status

To view the status of the Vagrant box run:

```sh
cd infrastructure
vagrant status
```

or

```sh
cd infrastructure
vagrant ssh -c /vagrant/scripts/status.sh
```

The status command will print the following information:

```sh
"Your public url for the Facebook Webhook is:"
${FACEBOOK_WEBHOOK_PUBLIC_URL}/facebook

"Your public url for the Google Webhook is:"
${GOOGLE_WEBHOOK_PUBLIC_URL}/google

"Your public url for the Twilio Webhook is:"
${TWILIO_WEBHOOK_PUBLIC_URL}/twilio

"You can access the API of the Airy Core Platform at:"
"http://api.airy/"

"Example:"
"curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}'
```

### Inspect Kubernetes

```sh
cd infrastructure
vagrant ssh
kubectl get pods
```

### Start, stop, restart

You can stop, start or restart the Airy Core Platform box with the following
commands:

```sh
cd infrastructure
vagrant halt
vagrant up
vagrant reload
```

### Re-create the environment

You can delete and re-create the whole environment with the following commands:

```sh
cd infrastructure
vagrant destroy
vagrant up
```

## Access the API

The API services are available under the domain `http://api.airy` from your
local machine. You can see an example request to the API by running the
`status` command.

## Access the frontend UI

The frontend UI for the demo app can be accessed through http://demo.airy.

The frontend UI for the Airy chat plugin can be accessed through http://chatplugin.airy/example.html.

## Public webhooks

The public webhook URLs are generated during the bootstrap process and are
displayed after the process finishes. Find your current webhook URLs and your
API local address by running the `status` command.

In order to integrate with the webhook of most sources on your local machine,
we included a [Ngrok](https://ngrok.com/) client as a sidecar container in each
`sources-SOURCE_NAME-webhook` pods. Ngrok is an open source reverse proxy which
creates a secure tunnel from a public endpoint to a local service. The Ngrok
client connects to a Ngrok server which has public access to the internet and
then provides a reversed proxy connectivity back to the webhook services,
running inside the Kubernetes cluster.

By default, the Ngrok client is configured to use the Ngrok server created by
Airy and running on https://tunnel.airy.co. This configuration is specified in
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

If you prefer to use your own Ngrok implementation or point the Ngrok client to
connect to the service provided by the Ngrok company at `https://ngrok.io`,
change the setting for `server_addr` in the ConfigMap or in this helm chart
document
`infrastructure/helm-chart/charts/apps/charts/airy-config/templates/sources.yaml`.

The bootstrap process creates a random URL which is then provisioned inside the
Helm chart. To configure these URLs, you can specify them in the
`infrastructure/helm-chart/charts/apps/charts/airy-co)fig/values.yaml` document.
Alternatively you can edit the `airy.conf` file by setting the following
parameter (see `airy.conf.all` for more examples):

```
sources:
  SOURCE_NAME:
    webhookPublicUrl: https://public-url-for-SOURCE_NAME-webhook
```

After preparing the configuration, run the following commands to apply the changes:

```sh
cd infrastructure
vagrant ssh
sudo -i
cp /vagrant/airy.conf ~/airy-core/helm-chart/charts/apps/values.yaml
helm upgrade airy ~/airy-core/helm-chart/charts/apps/ --timeout 1000s
```

## Connect sources

Integrating sources into the `Airy Core Platform` often requires specific configuration settings, refer to the source specific docs for details. You must provide the settings in `infrastructure/airy.conf` configuration file. An example of the configuration can be found in `airy.conf.all`.

After setting the configuration run:

```sh
vagrant provision --provision-with=conf
```

## Uninstall the Airy Core Platform

You can remove the Airy Core Platform Box from your machine completely running
the following commands:

```sh
cd infrastructure
vagrant destroy
```

## Known Issues

If you have just installed Virtualbox and see this error during the bootstrap you should [give Virtualbox permissions](https://www.howtogeek.com/658047/how-to-fix-virtualboxs-%E2%80%9Ckernel-driver-not-installed-rc-1908-error/).

```
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.
Command: ["hostonlyif", "create"]
Stderr: 0%...
Progress state: NS_ERROR_FAILURE
VBoxManage: error: Failed to create the host-only adapter
```
