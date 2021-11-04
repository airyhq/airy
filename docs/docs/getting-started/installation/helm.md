---
title: Deploy Airy with Helm
sidebar_label: Helm
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";

<TLDR>
Deploy Airy with Helm, on an existing Kubernetes cluster.
</TLDR>

The goal of this document is to provide an overview of how to run Airy Core in
an already existing Kubernetes cluster [Helm](https://helm.sh/).

## Prerequisites

You would need an existing Kubernetes cluster and administrative access to it. For the purpose of this guide, we will use a Google (GKE) Kubernetes cluster.
The cluster that we will create will have two nodes with 2cpu and 16GB RAM each.

```sh
gcloud container clusters create awesomechat --num-nodes=2 --machine-type=e2-standard-4
```

You will also need the [Helm](https://helm.sh/docs/intro/quickstart/) and [Kubectl](https://kubernetes.io/docs/tasks/tools/) binaries, locally on your machine.

Make sure that you can access the cluster running:

```sh
kubectl get pods
No resources found in default namespace.

helm list
NAME	NAMESPACE	REVISION	UPDATED	STATUS	CHART	APP VERSION
```

## Install

Deploy Airy Core with the latest version. You can also configure a specific version

```sh
VERSION=$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-${VERSION}.tgz --timeout 10m
```

By default `Airy Core` creates only a HTTP listener and when running in cloud environment it is recommended to setup an encrypted connection.

Get the address of your LoadBalancer:

```sh
kubectl -n kube-system get service  ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Configure your DNS so that your desired hostname points to the IP address of LoadBalancer. In this example we will be using the hostname `awesomechat.airy.co`.

Create an `airy.yaml` file with the following configuration:

```sh
ingress-controller:
  host: awesomechat.airy.co
  https: true
  letsencryptEmail: "sre@airy.co"
```

Run the following command to upgrade your Airy Core installation and setup Let's Encrypt:

```sh
helm upgrade airy https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-${VERSION}.tgz --values ./airy.yaml
```

After that you should be able to access your `Airy Core` instance through HTTPS, in this example on https://awesomechat.airy.co.

## Customize

Deploying `Airy Core` with Helm gives flexibility to customize your installation.

### Namespace

If you wish to deploy `Airy Core` to a separate namespace, you need to specify the `--namespace` flag to Helm.

```sh
VERSION=$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/stable/${VERSION}.tgz --timeout 10m --namespace airy
```

### Kafka

The default installation creates its own Kafka cluster. This section explains how to deploy `Airy Core` on an existing Kafka cluster:

The default settings in the `Airy Core platform`, on how to access the Kafka resources, can be overwritten in your `airy.yaml` file:

```sh
# Default settings
config:
  kafka:
    brokers: "kafka-headless:9092"
    zookeepers: "zookeeper:2181"
    schemaRegistryUrl: "http://schema-registry:8081"
    commitInterval: 1000
```

Run the following command to create the `Airy` platform without the bundled installation of Kafka, Zookeeper and the Schema registry.

```sh
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/testing/airy-${VERSION}.tgz  --set prerequisites.kafka.enabled=false --values ./airy.yaml
```

### Beanstalkd

The default installation creates its own [Beanstalkd](https://beanstalkd.github.io/) deployment, as it is a prerequisite for using the `integration/webhook` component.

Run the following command to create the `Airy` platform without the bundled Beanstalkd installation.

```sh
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/testing/airy-${VERSION}.tgz  --set prerequisites.beanstalkd.enabled=false --values ./airy.yaml
```

If you wish to omit both Beanstalkd and Kafka, you can use the following command:

```sh
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/testing/airy-${VERSION}.tgz  --set prerequisites.enabled=false --values ./airy.yaml
```

### Ingress controller

The default installation creates its own NGinx Kubernetes ingress controller, in the `kube-system` namespace. If you prefer to use your own Kubernetes ingress controller, run the following command to create `Airy` without the bundled one:

```sh
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/testing/airy-${VERSION}.tgz  --set ingress-controller.enabled=false --values ./airy.yaml
```

The `Airy` platform comes with defined ingress resources. Feel free to customize them in accordance with your ingress controller.
For example to set a custom host parameter, run the following commands:

```sh
HOST="my-airy-core-fqdn"
for ingress in $(kubectl get ingress -l core.airy.co/managed=true -o jsonpath='{.items[*].metadata.name}'); do
  kubectl get ingress ${ingress} -o json | jq "(.spec.rules[0].host=\"${HOST}\")" | kubectl apply -f -
done
```

### Charts

The resources for the Airy Helm chart are located under `infrastructure/helm-chart`. You can customize the charts and package or deploy the charts directly to your Kubernetes cluster.

As a reference you can use the script that we use to package and publish the Helm charts, which is located under `scripts/upload-helm-charts.sh`.

### Container registry

If you wish to build the docker images yourself and store them in your own `Container registry`, you can overwrite the path of the container registry with the following command:

```sh
VERSION=$(curl -L -s https://airy-core-binaries.s3.amazonaws.com/stable.txt)
helm install airy https://airy-core-helm-charts.s3.amazonaws.com/stable/${VERSION}.tgz --timeout 10m --set global.containerRegistry=my-docker-registry
```

## Upgrade

For upgrading your `Airy Core` instance using helm, refer to our [upgrade document](/getting-started/upgrade#upgrade-using-helm).

## Troubleshooting

To view your existing Helm installation run `helm list`.

You can see the current revision number of your Helm deployment by running:

```sh
helm list --filter 'airy' -o json | jq .[].revision
```

If you wish to rollback to a previous installation, run:

```
helm rollback airy {VERSION_NUMBER}
```

where `VERSION_NUMBER` is a previous revision number of the `airy` helm chart.

:::note

If you need further help, refer to our [Troubleshooting section](/getting-started/troubleshooting).
:::
