# Infrastructure of the Airy Core Platform

- [Infrastructure](#infrastructure-of-the-airy-core-platform)
  - [Components](#components)
  - [Networking](#networking)
  - [Prepared images](#prepared-images)


## Components

The Airy Core Platform currently runs on [Kubernetes](https://kubernetes.io/). In order to bootstrap the whole platform, we have prepared a Vagrantfile which holds the necessary commands to create a new [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/) cluster and deploy the necessary components inside.

The Airy Core Platform is comprised of the following components:
- Kafka cluster (kafka and zookeeper instances)
- Kafka Schema registry
- PostgreSQL server
- All the backend and frontend apps required for Airy to operate on top

The kubernetes manifests for those apps are located in this folder. If you want to customize some parts, please have a look at the `../scripts/bootstrap.sh` and `provisioning.sh` scripts.


## Networking

As the Airy Core Platform runs in Kubernetes, we have created one service which exposes the [Istio](https://istio.io/) ingress controller, located inside Minikube. Through that ingress controller, all the internal services are exposed and can be accessed from outside of Minikube.

Since Minikube usually runs on your local computer, where it is not exposed to the public network, we have included an ngrok client, which exposes the webhooks to which Facebook or other external parties can send events.


## Prepared images

We have packaged the whole Airy Core Platform in a [Vagrant](https://www.vagrantup.com/) image (box), which is hosted in an s3 bucket in AWS. The `../scripts/bootstrap.sh` script pulls this box and runs it on the local machine.

You will need Vagrant in order to be able to run the Airy Core Platform locally on your computer. If not, the `../scripts/bootstrap.sh` will try to install it for you.

The image is created with [Packer](https://www.packer.io/) and the code for it is in the `image.vagrant.json` file.
