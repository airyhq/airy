---
title: Installation
sidebar_label: Installation
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Bootstrap Airy Core

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
192.168.50.5  demo.airy
192.168.50.5  api.airy
192.168.50.5  chatplugin.airy
```

After the bootstrap process finishes, it will download the Kubernetes
configuration file to the local host machine under `~/.airy/kube.conf`. That
file is required for the Airy Command Line tool (Airy CLI), in order to access
the Kubernetes cluster where your Airy Core instance is running. You can also
use that configuration file with the `kubectl` utility, for example:

```sh
kubectl --kubeconfig ~/.airy/kube.conf get pods
```

Check out our [guide for running Airy Core in a test
environment](getting-started/deployment/vagrant.md) for detailed information.
