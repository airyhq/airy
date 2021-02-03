---
title: Configuration
sidebar_label: Configuration
---

## Airy Core Configuration File

The file `infrastructure/airy.tpl.yaml` is an example of all possible configuration options. This file should be copied and renamed to `infrastructure/airy.yaml` and modified
according to your environment:

```bash
cd infrastructure
cp airy.tpl.yaml airy.yaml
```

We will guide you through the different sections so you can make the changes you are looking for. You can also omit keys for services which do not wish to configure.

You can for example remove the Twilio section if you do not wish to use that source.

```yaml
twilio:
  authToken: "changeme"
  accountSid: "changeme"
```

### Global

- appImageTag

If you want to deploy a specific version of Airy Core, you must set this to the desired version.

- containerRegistry
- namespace

### Prerequisites

Connecting the `Airy Components` to the
Kafka cluster, PostgreSQL and Redis.

- kafka
- redis
- postgres

We recommend that you create a new database if you are reusing a PostgreSQL server to avoid name collisions.

### Components

- api
- sources
- webhooks
- media-resolver

## Applying the configuration

If you made changes in the `airy.yaml` file and want to apply it to your instance you can use our [CLI](getting-started/cli.md)

```sh
airy config apply --config ./airy.yaml --kube-config /path/to/your/kube.conf
```

Make sure you point the `--kube-config` flag to your Kubernetes configuration
file.
