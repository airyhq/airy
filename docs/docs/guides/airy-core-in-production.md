---
title: Running the Airy Core Platform in production
sidebar_label: Production
---

This document provides our recommendations on how to run the Airy Core Platform
in production environments. If you are not familiar with the architecture of the
system, we suggest you read the [Architecture](architecture.md) document before
proceeding.

## Requirements

The `Airy apps` are the services which comprise the `Airy Core Platform`. They
run as docker containers and require access to several other services to be in
place before they can be started:

- `Kafka cluster`: Kafka, Zookeeper and the Confluent Schema registry. These
  three services comprise the Kafka store. They are the default storage system
  of the Airy Core Platform. Kafka requires Zookeeper to work. The Confluent
  Schema registry facilitates Avro typed data pipelines. All our Kafka based
  applications require the registry to work.
- `PostgreSQL`: Where we store authentication data.
- `Redis`: The queuing system used by our webhook system relies on Redis.

### Kafka cluster

The Kafka store requires multiple Kafka brokers, Zookeepers, and Confluent
Schema registry servers. We recommend using at least five Kafka brokers and set
the replication factor of _all_ topics to `3`. So that even if two brokers
would become unavailable at the same time, the system would still function.

We also recommend running at least three Zookeepers and two instances of the Confluent Schema registry.

If you decide to run the Kafka cluster on Kubernetes, we recommend running Kafka
and Zookeeper as StatefulSet workloads, for persistent storage. The Confluent
Schema registry can be run as a Deployment, as it is stateless.

Apart from running your own Kafka cluster, a managed version can also be used.

The Kafka cluster is usually started in the following order:

- Start the `ZooKeeper` nodes. The ZooKeeper nodes need to have the ports `2888`
  and `3888` open between them and the port `2181` open to the Kafka servers.
  Note down the hostnames of the ZooKeeper servers because they are required for
  the configuration of the Kafka brokers.
- Start and connect the `Kafka` nodes. The Kafka nodes need the configuration
  how to connect to the zookeeper nodes, through the configuration variable
  `zookeeper.connect`, specified in the `/etc/kafka/server.properties` file.
- Once Kafka and ZooKeeper are up and running, the confluent Schema registry can
  be started. It requires Kafka brokers hostnames, usually through the
  parameter `kafkastore.bootstrap.server` of the configuration file
  `/etc/schema-registry/schema-registry.properties`.

The location of the configuration files can vary depending on the particular installation.

Once the Kafka cluster is up and running, the required topics must be created.
You can find them in the Bash script
`infrastructure/scripts/provision/create-topics.sh`. The script requires the
following environment variables to run:

- `ZOOKEEPER` (default: airy-cp-zookeeper:2181)
- `PARTITIONS` (default: 10)
- `REPLICAS` (default: 1)

We do not recommend running Kafka on docker for production environments.
However, we provide a way to deploy the whole Kafka cluster on top of Kubernetes
with Helm as we use this approach for test installations.

To deploy Kafka on Kubernetes with Helm, you can run:

```sh
helm install airy infrastructure/helm-chart/charts/kafka/
```

By default, the `Confluent Schema registry` deployment is created with
`replicas=0`. We want to ensure ZooKeeper and Kafka are running properly before
we start the service so we can avoid errors.

To customize the deployment, you can edit the configuration files in
`infrastructure/helm-chart/charts/kafka/charts`.

### PostgreSQL

A cluster of PostgreSQL servers can be used or a managed one such as AWS RDS. If
deployed on Kubernetes, consider running the app on a StatefulSet workload, for
persistent storage.

After the server has been provisioned, a database must be created, along with
username and password which have full privileges on the database. Note down
these parameters as they are required to start the `Airy apps`.

We provide a Helm chart to deploy a PostgreSQL server Kubernetes. Set the
`pgPassword` variable in `infrastructure/helm-chart/charts/postgres/values.yaml`
file and run:

```sh
helm install postgres infrastructure/helm-chart/charts/postgres/
```

### Redis

A cluster of redis servers can be used or a managed one such as AWS ElastiCache
for Redis. If deployed on Kubernetes, consider running the app on a StatefulSet
workload, for persistent storage.

We provided a Helm chart for a Redis cluster as well. You can run:

```sh
helm install redis infrastructure/helm-chart/charts/redis/
```

### Kubernetes

The `Airy apps` run on top of Kubernetes which is our preferred runtime. We
recommend Kubernetes for more robust and reliable deployment in production
environments. However, the `Airy apps` do not depend on Kubernetes in any way.

If you prefer to deploy the `Airy apps` on a Docker runtime, you can refer to
our the Kubernetes manifests, where all the Docker images and configuration
parameters are specified. In order to generate the Kubernetes manifests, run:

```sh
helm template ./infrastructure/helm-chart
```

## Running the Airy apps

So far the Airy Core Platform has been tested on K3s, Minikube and AWS EKS. The
following configuration and deployment instructions are applicable to any
Kubernetes implementation as they depend on widely supported Kubernetes
features. In order to proceed with deploying the apps, we assume that you have a
running Kubernetes cluster, properly configured KUBECONF file and properly set
context.

### Configuration

After the [required services](#requirements) are deployed, you're ready to start
the `Airy apps` inside a Kubernetes cluster. Connecting the `Airy apps` to the
Kafka cluster, PostgreSQL and Redis can be done by creating a configuration
file, prior to deploying the apps. Make sure that the `Airy apps` also have
network connectivity to the required services.

The file `infrastructure/airy.conf.all` contains an example of all possible
configuration parameters. This file should be copied to `airy.conf` and edited
according to your environment:

```sh
cd infrastructure
cp airy.conf.all airy.conf
```

Edit the file to configure connections to the base services. Make sure that the
following sections are configured correctly, so that the `Airy apps` to start
properly:

```
apps:
  kafka:
    ...
  redis:
    ...
  postgresql:
    ...
```

### Deployment

We provided a Helm chart to deploy the `Airy apps`. Before you can run helm, you
must configure the system via the `airy.conf` file, then you can proceed:

```sh
cp airy.conf ./helm-chart/charts/apps/values.yaml
helm install airy-apps ./helm-chart/charts/apps/ --timeout 1000s
```

By default, the `Airy apps` deployments start with `replicas=0` so to scale them up, run:

```sh
kubectl scale deployment -l type=api --replicas=1
kubectl scale deployment -l type=frontend --replicas=1
kubectl scale deployment -l type=webhook --replicas=1
kubectl scale deployment -l type=sources-chatplugin --replicas=1
kubectl scale deployment -l type=sources-facebook --replicas=1
kubectl scale deployment -l type=sources-google --replicas=1
kubectl scale deployment -l type=sources-twilio --replicas=1
```

At this point you should have a running `Airy Core Platform` in your environment 🎉.

To deploy with a different `image tag` (for example `beta` from the `develop`
branch), you can run:

```sh
export AIRY_VERSION=beta
helm install airy-apps ./helm-chart/charts/apps/ --set global.appImageTag=${AIRY_VERSION} --timeout 1000s
```

If afterwards you need to modify or add other config parameters in the
`airy.conf` file, after editing the file run:

```sh
cp airy.conf ./helm-chart/charts/apps/values.yaml
helm upgrade airy-apps ./helm-chart/charts/apps/ --timeout 1000s
```

If you deploy the Airy Core Platform with a specific version tag, you must
export the `AIRY_VERSION` variable before running `helm upgrade`:

```sh
cp airy.conf ./helm-chart/charts/apps/values.yaml
export AIRY_VERSION=beta
helm upgrade airy-apps ./helm-chart/charts/apps/ --set global.appImageTag=${AIRY_VERSION} --timeout 1000s
```

## Network

### Connect Sources

The helm chart creates separate NodePort service for every source with the
naming convention `sources-SOURCE_NAME-webhook`. These services must be exposed
publicly on the Internet, so that the sources can send messages and events to
the webhook services, inside the Kubernetes cluster.

To get the ports on which the webhook services are running, you can run:

```sh
kubectl get service -l airy=sources.webhook --output jsonpath={.items[*].spec.ports[*].nodePort}
```

As these ports are randomly assigned by Kubernetes, they need to be exposed
publicly through a `Load balancer`. If you are running in a cloud environment,
you can convert the services from type `NodePort` to `Loadbalancer`, for which
cloud providers usually create a dedicated Load balancer.

To see the hostname for the load balancer, you can run

```sh
kubectl get service -l airy=sources.webhook
```

The public endpoint will be in the `EXTERNAL-IP` column.

### Services

Inside the Kubernetes cluster, the helm chart installs the API services (with
prefix `api-`) and the frontend services (with prefix `frontend-`). To access
these services outside the Kubernetes cluster they need to be exposed with
Ingress resources. You can choose an [Kubernetes ingress
controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
in accordance to your needs or preferences. If you are using the
[Traefik](https://traefik.io/) ingress controller, you can edit the
`infrastructure/network/ingress.yaml` file to modify the `host` records and
directly apply it to your Kubernetes cluster.

```sh
kubectl apply -f infrastructure/network/ingress.yaml
```

You must set different `host` attributes for the following:

- API endpoints (defaults to `api.airy`)
- Demo (defaults to `demo.airy`)
- Chat plugin (defaults to `chatplugin.airy`)

If you are not using Traefik, you can use the
`infrastructure/network/ingress.yaml` file as a guide to create your own
Kubernetes manifest for your preferred ingress controller.

If your Kubernetes cluster is not directly reachable on the Internet, you will
need a public LoadBalancer or a `reverse proxy` to tunnel the traffic to the
ports exposed by the ingress controller (usually ports `80` and `443`).

## AWS Cloud Services

TODO

## Google Cloud Platform

TODO

## Microsoft Azure

TODO

## Digital ocean

TODO
