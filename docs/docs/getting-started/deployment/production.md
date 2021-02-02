---
title: Production
sidebar_label: Production
---

This document provides our recommendations on how to run the Airy Core
in production environments. If you are not familiar with the architecture of the
system, we suggest you read the [Architecture](/concepts/architecture.md) document before
proceeding.

## Requirements

The `Airy apps` are the services which comprise `Airy Core`. They run as docker
containers and require access to several other services to be in place before
they can be started:

- `Kafka cluster`: Kafka, Zookeeper and the Confluent Schema registry. These
  three services comprise the Kafka store. They are the default storage system
  of Airy Core. Kafka requires Zookeeper to work. The Confluent Schema registry
  facilitates Avro typed data pipelines. All our Kafka based applications
  require the registry to work.
- `PostgreSQL`: Where we store authentication data.
- `Redis`: The queuing system used by our webhook system relies on Redis.

### Kafka cluster

The Kafka store requires multiple Kafka brokers, Zookeepers, and Confluent
Schema registry servers. We recommend using at least five Kafka brokers and set
the replication factor of _all_ topics to `3`. So that even if two brokers
would become unavailable at the same time, the system would still function.

We also recommend running at least three Zookeepers and two instances of the
Confluent Schema registry.

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

The location of the configuration files can vary depending on the particular
installation.

Once the Kafka cluster is up and running, the required topics must be created.
You can find them in the Bash script
`infrastructure/scripts/provision/create-topics.sh`. The script requires the
following environment variables to run:

- `ZOOKEEPER` (default: airy-cp-zookeeper:2181)
- `PARTITIONS` (default: 10)
- `REPLICAS` (default: 1)
- `AIRY_CORE_NAMESPACE` (default: ''). Helpful to namespace your topics in case
  you are installing the Airy Core in an existing Kafka cluster

We do not recommend running Kafka on docker for production environments.
However, we provide a way to deploy the whole Kafka cluster on top of Kubernetes
with Helm as we use this approach for test installations.

The default commit interval is set to 1000 ms (1 second). This is _not_ recommended
for production usage.
You change the `commitInterval` to a more suitable production value in the configuration file
`infrastructure/helm-chart/charts/prerequisites/values.yaml`.

To deploy Kafka on Kubernetes with Helm, you can run:

```sh
helm install kafka infrastructure/helm-chart/charts/kafka/
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

So far Airy Core has been tested on K3s, Minikube and AWS EKS. The following
configuration and deployment instructions are applicable to any Kubernetes
implementation as they depend on widely supported Kubernetes features. In order
to proceed with deploying the apps, we assume that you have a running Kubernetes
cluster, properly configured KUBECONF file and properly set context.

Airy Core ships with a Kubernetes controller, which is responsible for starting
and reloading the appropriate Airy apps based on the provided configuration. The
controller as a deployment named `airy-controller`.

### Configuration

After the [required services](#requirements) are deployed, you're ready to start
the `Airy apps` inside a Kubernetes cluster. Connecting the `Airy apps` to the
Kafka cluster, PostgreSQL and Redis can be done by creating a configuration
file, prior to deploying the apps. Make sure that the `Airy apps` also have
network connectivity to the required services.

The file `infrastructure/airy.tpl.yaml` contains an example of all possible
configuration parameters. This file should be copied to `airy.yaml` and edited
according to your environment:

```sh
cd infrastructure
cp airy.tpl.yaml airy.yaml
```

Edit the file to configure connections to the base services. Make sure to configure the
following sections correctly, so that the `Airy apps` start properly:

```yaml
apps:
  kafka: ...
  redis: ...
  postgresql: ...
```

We recommend that you create a new database if you are reusing a PostgreSQL server to avoid name collisions.

## Source media storage

Most message sources allow users to send rich data such as images, videos and audio files. For some sources
the Urls that host this data expire which is why after some time you may find that conversations have inaccessible
content.

Airy Core allows you to persist this data to a storage of your choice. To take
advantage of this you must provide access credentials to your storage. The
platform currently supports [s3](https://aws.amazon.com/s3/):

```yaml
apps:
  storage:
    s3:
      key: <your aws iam access key id>
      secret: <your aws iam access key secret>
      bucket: <the target bucket>
      region: <the bucket's aws region>
      path: <(optional) defaults to the bucket root>
```

### Deployment

We provided a Helm chart to deploy the `Airy apps`. Before you can run helm, you
must configure the system via the `airy.yaml` file, then you can proceed:

```sh
helm install core ./helm-chart/charts/apps/ --values ./airy.yaml --timeout 1000s
```

The API `Airy apps`, the Frontend UI and the Frontend of the Airy Live Chat
plugin start by default, while all the other apps are optional and are started
if there is provided configuration for them in the `airy.yaml` file.

At this point you should have a running `Airy Core` in your environment 🎉.

If afterwards you need to modify or add other config parameters in the
`airy.yaml` file, after editing the file run:

```sh
airy config apply --config ./airy.yaml --kube-config /path/to/your/kube.conf
```

Make sure you point the `--kube-config` flag to your Kubernetes configuration
file.

If you want to deploy a specific version of Airy Core, you must set the version
in your `airy.yaml` file, under the `global.appImageTag` configuration key to
the desired version.

## Network

### Connect Sources

The helm chart creates separate NodePort service for every source with the
naming convention `sources-SOURCE_NAME-webhook`. These services must be exposed
publicly on the Internet, so that Airy Core can integrate with the source via a
webhook.

Find out on which ports the webhook services are running:

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
`infrastructure/helm-chart/templates/ingress.yaml` file to modify the `host`
records and apply the Kubernetes manifest:

```bash script
kubectl apply -f infrastructure/helm-chart/templates/ingress.yaml
```

You must set appropriate `host` attributes in the rules for:

- API endpoints (defaults to `api.airy`)
- Webhooks endpoints (defaults to `webhooks.airy`)
- Demo (defaults to `demo.airy`)
- Chat plugin (defaults to `chatplugin.airy`)

If you are not using Traefik, you can use the
`infrastructure/helm-chart/templates/ingress.yaml` file as a guide to create
your own Kubernetes manifest for your preferred ingress controller.

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
