---
id: userguide
title: User Guide
sidebar_label: User Guide
slug: /user-guide
---

The goal of this document is to provide an overview of how to run the Airy Core
Platform.

- [User guide](#user-guide)
  - [Running the platform on your machine](#running-the-platform-on-your-machine)
    - [Debug your installation](#debug-your-installation)
    - [Connect the Facebook source](#connect-the-facebook-source)
    - [Airy Core API and Public webhooks](#airy-core-api-and-public-webhooks)
    - [Uninstall the Airy Core Platform Box](#uninstall-the-airy-core-platform-box)

## Running the platform on your machine

We built a virtual machine with [Vagrant](https://www.vagrantup.com) that allows
you to create a virtual machine (box). The box contains a
[Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)
cluster preconfigured to deploy and run all the Airy Core Platform
components.

To get started, run the following commands:

```sh
$ git clone https://github.com/airyhq/airy
$ cd core
$ ./scripts/bootstrap.sh
```

### Debug your installation

You can ssh inside the Airy Core Platform box for testing and debugging purposes like so:

```sh
$ cd infrastructure
$ vagrant status
$ vagrant ssh
$ kubectl get pods # to see what's running inside the minikube
```

You can stop, start or restart the Airy Core Platform box with the following commands:

```sh
$ cd infrastructure
$ vagrant halt
$ vagrant start
$ vagrant reload
```

You can delete and re-create the whole environment with the following commands:
```sh
$ cd infrastructure
$ vagrant destroy
$ vagrant up
```

### Connect the Facebook source

To integrate the Facebook source, you must provide your Facebook credentials. If
you want to put in your facebook credentials, you must create a configuration file
`airy.conf` located in the `infrastructure` directory:
```sh
cd infrastructure
cp airy.conf.tpl airy.conf
```
You need to put your credentials in the `infrastructure/airy.conf` config file and
then run the following command:

```sh
$ vagrant provision --provision-with user-data
```

### Airy Core API and Public webhooks

You can find your current webhook URLs and your API local address running the following commands:

```sh
$ cd infrastructure
$ vagrant ssh
$ /vagrant/scripts/status.sh
```
or
```sh
$ cd infrastructure
$ vagrant ssh -c /vagrant/scripts/status.sh
```

### Uninstall the Airy Core Platform Box

You can remove the Airy Core Platform Box from your machine completely running
the following commands:

```sh
$ cd infrastructure
$ vagrant destroy
```
