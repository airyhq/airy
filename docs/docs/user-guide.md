---
id: user-guide
title: User Guide
sidebar_label: User Guide
slug: /user-guide
---

The goal of this document is to provide an overview of how to run the Airy Core
Platform.


## Running the platform on your machine

We built a virtual machine with [Vagrant](https://www.vagrantup.com) that allows
you to create a virtual machine (box). The box contains [K3OS](https://k3os.io/),
a pre-configured kubernetes cluster, to deploy and run all the Airy Core Platform
components.

To get started, run the following commands:

```sh
$ git clone https://github.com/airyhq/airy
$ cd airy
$ ./scripts/bootstrap.sh
```

The script will ask for your password as we are using the [Vagrant Host Manager Plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) to add entries to your hosts file. You can skip this step and add the following lines to your hosts file yourself.

```
192.168.50.5  demo.airy
192.168.50.5  api.airy
```


### Debug your installation

You can ssh inside the Airy Core Platform box for testing and debugging purposes like so:

```sh
$ cd infrastructure
$ vagrant status
$ vagrant ssh
$ kubectl get pods # to see what's running inside the kubernetes cluster
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

To integrate the Facebook source, you must provide your Facebook credentials.
You must put them in the configuration file `airy.conf` located in the
`infrastructure` directory and then run the following command:

```sh
$ vagrant provision --provision-with airy-conf
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
