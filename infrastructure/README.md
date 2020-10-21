# Infrastructure of the Airy Core Platform

- [Infrastructure of the Airy Core Platform](#infrastructure-of-the-airy-core-platform)
  - [Components](#components)
  - [Networking](#networking)
  - [Prepared images](#prepared-images)


## Components

The Airy Core Platform runs on [Kubernetes](https://kubernetes.io/). In order to
bootstrap it, we built a
[Vagrantfile](https://www.vagrantup.com/docs/vagrantfile) that allows you to
create a virtual machine. The box contains a
[Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)
cluster preconfigured to deploy and run all the Airy Core Platform components.

The Airy Core Platform components require the following systems to run:

- A [Kafka](https://kafka.apache.org) cluster (which in turn requires [zookeeper](https://zookeeper.apache.org))
- The [Confluent Schema registry](https://github.com/confluentinc/schema-registry)
- A [PostgreSQL](https://www.postgresql.org/) database

The Kubernetes manifests for those apps are located in [this
folder](/infrastructure/deployments). If you need to customize any aspect of the
deployment process, the `../scripts/bootstrap.sh` and `provisioning.sh` scripts
are good entry-points.


## Networking

As the Airy Core Platform runs in Kubernetes, we have created a service that
exposes an [Istio](https://istio.io/) ingress controller, located inside
Minikube. Through that ingress controller, the internal services are exposed and
can be accessed from outside of Minikube.

Since Minikube clusters are usually not exposed to the public internet, we
included an ngrok client to facilitate the integration of sources (via
webhooks).


## Prepared images

We packaged the whole Airy Core Platform in a
[Vagrant](https://www.vagrantup.com/) image (box), which is hosted in an s3
bucket in AWS. The `../scripts/bootstrap.sh` script pulls the box and runs it on
the local machine.
You will need Vagrant in order to be able to run the Airy Core Platform locally on your computer. 
If not, the `../scripts/bootstrap.sh` will try to install it for you.

The prepared images are created with [Packer](https://www.packer.io/). The Packer code, for creating the images, is in the `images` directory.
