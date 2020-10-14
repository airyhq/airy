# Infrastructure of the Airy Core Platform

- [Infrastructure](#infrastructure-of-the-airy-core-platform)
  - [Components](#components)
  - [Networking](#networking)
  - [Prepared images](#prepared-images)


## Components

The Airy core platform currently runs on kubernetes. In order to bootstrap the whole platform, we have prepared a Vagrantfile which holds the necessary commands to create a new minikube cluster and deploy the necessary components inside.

The Airy core platform is comprised of the following components:
- Kafka cluster (kafka and zookeeper instances)
- Kafka Schema registry
- PostgreSQL server
- All the backend and frontend apps required for Airy to operate on top.

The kubernetes manifests for those apps are located in this folder. If you want to customize some parts, please have a look at the `bootstrap.sh` and `provisioning.sh` scripts.


## Networking

As the Airy core platform runs in kubernetes, we have created one service which exposes the Istio ingress controller, located inside minikube. Through that ingress controller, all the internal services are exposed and can be accessed from outside of minikube.

Since minikube usually runs on your local computer, where it is not exposed to the public network, we have included an ngrok client, which exposes the webhooks to which Facebook or other external parties can send events.


## Prepared images

We have packaged the whole core platform in a vagrant image (box), which is hosted in an s3 bucket in AWS. The `bootstrap.sh` script pulls this box and runs it on the local machine.

The image is created with `Packer` and the code for it is in the `image.vagrant.airy.json` file.
