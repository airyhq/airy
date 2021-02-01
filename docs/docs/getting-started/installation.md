---
title: Installation
sidebar_label: Installation
---

import useBaseUrl from '@docusaurus/useBaseUrl';

You can run the entire Airy Core on your machine inside an isolated Vagrant box. The Airy CLI enables you to interact with any Airy Core instance whether it is running locally or in the cloud.

## Install the Airy CLI

### Install the airy binary with curl on MacOS

You can download the latest release with the following command or replace the version portion of the url with the specific version.

1. Download the latest release:

```sh
curl https://airy-core-binaries.s3.amazonaws.com/$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)/darwin/amd64/airy -o "airy"
```

:::note
To download a specific version, replace the $(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt) portion of the command with the specific version.

For example, to download version 0.6.0 on macOS, type:

curl https://airy-core-binaries.s3.amazonaws.com/0.6.0/darwin/amd64/airy -o "airy"
:::

2. Validate the binary (optional)
3. Make the **airy** binary executable.

```
chmod +x ./airy
```

4. Move the **airy** binary to a file location on your system PATH.

```
sudo mv ./airy /usr/local/bin/airy && \
sudo chown root: /usr/local/bin/airy
```

### Install with Homebrew on macOS

### Install on Linux

1. Download the latest release:

```sh
curl -LO https://airy-core-binaries.s3.amazonaws.com/$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)/darwin/amd64/airy -o "airy"
```
2. Validate the binary (optional)
3. Install **airy**

```
sudo install -o root -g root -m 0755 airy /usr/local/bin/airy
```

### Build the Airy CLI from source

1. Build the cli target with Bazel

```bash
bazel build //infrastructure/cli:airy
```

4. Move the **airy** binary to a file location on your system PATH.
```bash
sudo cp bazel-out/darwin-fastbuild/bin/infrastructure/cli/airy ~/bin
```



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
