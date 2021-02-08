---
title: Configuration
sidebar_label: Configuration
---

## Airy Core Configuration File

The `infrastructure/airy.tpl.yaml` file contains examples of all possible configuration options. Create your own `airy.yaml` like so:

```bash
cd infrastructure
cp airy.tpl.yaml airy.yaml
```

We will guide you through the different sections so you can make the changes you are looking for. Keys can also be omitted for services which you do not wish to configure.

### Global

- `appImageTag` the image tag of the container images for the **Airy Components**

  If you want to launch an older version refer to our [Releases](https://github.com/airyhq/airy/releases) for the correct version number or if you are feeling adventurous try `develop` at your own risk.

- `containerRegistry` the URL of the container registry

- `namespace` the Kubernetes namespace the **Airy Core** will use

- `ingress` the subdomains for the **Airy Components** that need to be accessed from outside the Kubernetes cluster

### Prerequisites

These settings are used to connect the **Airy Components** to your Kafka cluster, PostgreSQL and Redis.

- `kafka`

  - `brokers` comma separated list of the broker endpoints
  - `schema-registry` url to the Schema Registry
  - `commitInterval` the [Kafka Commit Interval](https://kafka.apache.org/documentation/#consumerconfigs_auto.commit.interval.ms) if you are using the included Helm chart

- `redis`

  - `hostname`
  - `port`

  Redis is needed as a queue for the [Webhooks](/api/webhook.md)

- `postgres`
  - `endpoint` in `<HOSTNAME>:<PORT>` format
  - `dbName` name of the database in the PostgreSQL server
  - `username` these credentials will be passed to the **API Auth Component**
  - `password` and they will be used to create the Postgres if you are deploying with **Vagrant**

### Components

- `api`

  - `jwtSecret` should be set to a long secure secret in production environments
  - `allowedOrigins` your sites origin to prevent CORS-based attacks

- `sources`

  - `facebook`
  - `google`
  - `twilio`

  The **Airy Controller** only starts configured sources. To keep system load to a minimum, only add the sources you are using.

- `webhooks`
  - `name`
- `media-resolver`
  - `storage`
    - `s3` set these to your AWS S3 config to store source specific user data

## Applying the configuration

If you made changes in `airy.yaml` and want to apply it to your instance you can use the [airy config apply](/cli/airy_config_apply.md) by running the following [Airy CLI](/cli/introduction.md) command.

```bash
airy config apply --config ./airy.yaml --kube-config /path/to/your/kube.conf
```
