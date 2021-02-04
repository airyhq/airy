---
title: Configuration
sidebar_label: Configuration
---

## Airy Core Configuration File

The `infrastructure/airy.tpl.yaml` file contains examples of all possible configuration options. Copy and rename it to `infrastructure/airy.yaml` and modify it according to your environment:

```bash
cd infrastructure
cp airy.tpl.yaml airy.yaml
```

We will guide you through the different sections so you can make the changes you are looking for. Keys can also be omited for services which you do not wish to configure.

### Global

`appImageTag`

The image tag of the container images for the `Airy Components`

`containerRegistry`

The images of the `Airy Components` are stored in the [Github Container Registry](https://docs.github.com/en/packages/guides/about-github-container-registry).

`namespace`

The Kubernetes namespace the `Airy Core` will use

### Prerequisites

These settings are used to connect the `Airy Components` to your Kafka cluster, PostgreSQL and Redis.

`kafka`
`redis`
`postgres`

We recommend that you create a new database if you are reusing a PostgreSQL server to avoid name collisions.

### Components

`api`

The `mail*` settings are needed if you want the Airy Core to send emails out.

The `jwtSecret` should be set to a long secure secret in production environments

`sources`

The `Airy Controller` will only start `Airy Components` when they are configured here. So to keep system load to a minimum only add the sources you are using.

`webhooks`
`media-resolver`

## Applying the configuration

If you made changes in `airy.yaml` and want to apply it to your instance you can use the [CLI](getting-started/cli.md) by running the following command.

```bash
airy config apply --config ./airy.yaml --kube-config /path/to/your/kube.conf
```

Make sure you point the `--kube-config` flag to the Kubernetes configuration
file of the cluster you want to configure.
