---
title: Vagrant
sidebar_label: Vagrant
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The goal of this document is to provide an overview of how to run Airy Core on
your local machine using [Vagrant](https://www.vagrantup.com).

To facilitate bootstrapping Airy Core on a single machine, we included a Vagrant
configuration inside the `infrastructure` directory.

The Vagrant box is based on Alpine Linux and contains a pre-configured
Kubernetes cluster [K3OS](https://k3os.io/) to deploy and run Airy Core
components.

## Run the Bootstrap script

Create an Airy Core instance locally by entering the following commands:

```bash
git clone -b main https://github.com/airyhq/airy
cd airy
./scripts/bootstrap.sh
```

The bootstrap installation requires
[Vagrant](https://www.vagrantup.com/downloads) and
[VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not found,
the script will attempt to install them for you.

If Vagrant or VirtualBox cannot be installed with the `bootstrap.sh` script, you
need to install them manually.

The script will also ask for your administrative credentials as we are using the
[Vagrant Host Manager
Plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) to add entries to
your hosts file. You can skip this step and add the following lines to your
hosts file yourself.

```
192.168.50.5  ui.airy
192.168.50.5  api.airy
192.168.50.5  chatplugin.airy
```

After the bootstrap process finishes, it will download the Kubernetes
configuration file to the local host machine under `~/.airy/kube.conf`. That
file is required for the Airy Command Line tool [Airy CLI](/getting-started/cli.md), in order to access
the Kubernetes cluster where your Airy Core instance is running. You can also
use that configuration file with the `kubectl` utility, for example:

```sh
kubectl --kubeconfig ~/.airy/kube.conf get pods
```

If you want to customize your `Airy Core` instance please see our [Configuration Section](configuration.md).

## Access the API

The API services are available under the domain `http://api.airy` from your
local machine. You can see an example request to the API by running the
`status` command.

## Access the UI

The UI can be accessed through http://ui.airy.

The frontend UI for the Airy chat plugin can be accessed through
http://chatplugin.airy/example. Refer to [the Airy Live Chat
plugin](/sources/chat-plugin.md) documentation for detailed information.

## Public webhooks

The public webhook URLs are generated during the bootstrap process and are
displayed after the process finishes. Find your current webhook URLs and your
API local address by running the `/vagrant/scripts/status.sh` command from
inside the Airy Core Vagrant box.

In order to integrate with the webhook of most sources on your local machine,
we included a [ngrok](https://ngrok.com/) client as a sidecar container in each
`sources-SOURCE_NAME-webhook` pods. ngrok is an open source reverse proxy which
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
change the setting for `server_addr` in the ConfigMap or in this helm chart
document
`infrastructure/helm-chart/templates/ngrok.yaml`.

Ngrok can be disabled during the bootstrap process:

```bash
NGROK_ENABLED=false ./scripts/bootstrap.sh
```

The bootstrap process creates a random URL which is then provisioned inside the
Helm chart. To configure these URLs, you can specify them in the
`infrastructure/helm-chart/values.yaml` document. Alternatively you can edit the
`airy.yaml` file by setting the following parameter (see `airy.tpl.yaml` for
more examples):

```
sources:
  SOURCE_NAME:
    webhookPublicUrl: https://public-url-for-SOURCE_NAME-webhook
```

## Connect sources

Integrating sources into the `Airy Core` often requires specific configuration
settings, refer to the [source specific docs](/sources/introduction.md) for details.

## Uninstall Airy Core

You can remove the Airy Core Vagrant box from your machine completely running
the following commands:

```sh
cd infrastructure
vagrant destroy
```

## Manage your Vagrant box

You can ssh inside the Airy Core box for testing and debugging purposes with
`vagrant ssh` or run commands directly with `vagrant ssh -c COMMAND`

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

"You can access the API of Airy Core at:"
"http://api.airy/"

"Example:"
"curl -X POST -H 'Content-Type: application/json' -d '{\"first_name\": \"Grace\",\"last_name\": \"Hopper\",\"password\": \"the_answer_is_42\",\"email\": \"grace@example.com\"}'
```

### Overwrite default CPUs and memory

You can specify number of CPU and memory (in MB) you want to use for your Airy Core box with the following ENV variables:

```sh
AIRY_CORE_CPUS=2 AIRY_CORE_MEMORY=4096 ./scripts/bootstrap.sh
```

### Inspect Kubernetes

```sh
cd infrastructure
vagrant ssh
kubectl get pods
```

### Start, stop, restart

You can stop, start or restart the Airy Core box with the following
commands:

```sh
cd infrastructure
vagrant halt
vagrant up
vagrant reload
```

:::note

If you bootstrapped your Airy Core with custom CPU/RAM values, you must specify them again when you restart your box.

```sh
cd infrastructure
vagrant halt
AIRY_CORE_CPUS=2 AIRY_CORE_MEMORY=4096 vagrant up
```

:::

### Re-create the environment

You can delete and re-create the whole environment with the following commands:

```sh
cd infrastructure
vagrant destroy
vagrant up
```

## Known Issues

If you have just installed VirtualBox and see this error during the bootstrap
you should [give VirtualBox
permissions](https://www.howtogeek.com/658047/how-to-fix-virtualboxs-%E2%80%9Ckernel-driver-not-installed-rc-1908-error/).

```
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.
Command: ["hostonlyif", "create"]
Stderr: 0%...
Progress state: NS_ERROR_FAILURE
VBoxManage: error: Failed to create the host-only adapter
```
