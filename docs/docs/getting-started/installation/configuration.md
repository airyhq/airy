---
title: Configuration your Airy Core instance
sidebar_label: Configuration
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Use an airy.yaml configuration file to customize your Airy Core instance

</TLDR>

The configuration workflow is as simple as:

```sh
$EDITOR /path/to/config/directory/airy.yaml # edit your airy.yaml file
airy config apply --workspace /path/to/config/directory/ # apply your config
```

Your Airy Core instance will start and stop components accordingly to your
configuration. For example, if you do not wish to start Facebook components, it
is enough not to provide any facebook specific configuration.

Now let's have a look at the different sections so you can make the changes you
are looking for.

### Kubernetes

- `appImageTag` the image tag of the container images for the **Airy Components**

  If you want to launch an older version refer to our
  [Releases](https://github.com/airyhq/airy/releases) for the correct version
  number or if you are feeling adventurous try `develop` at your own risk.

- `containerRegistry` the URL of the container registry

- `namespace` the Kubernetes namespace the **Airy Core** will use

- `ingress` the subdomains for the **Airy Components** that need to be accessed from outside the Kubernetes cluster

### Prerequisites

These settings are used to connect the **Airy Components** to your Kafka
cluster and Redis.

- `kafka`

  - `brokers` comma separated list of the broker endpoints
  - `schema-registry` url to the Schema Registry
  - `commitInterval` the [Kafka Commit Interval](https://kafka.apache.org/documentation/#consumerconfigs_auto.commit.interval.ms) if you are using the included Helm chart

- `redis`

  - `hostname`
  - `port`

### Security

- `systemToken` set to a long secure secret to use for machine [API authentication](api/authentication.md)
- `allowedOrigins` your site's origin to prevent CORS-based attacks (default: `"*"`)
- `oidc` a map of values that when set enable and define [OIDC authentication](api/authentication.md#configuring-oidc)
- `jwtSecret` used to create jwt http sessions derived from oidc authentication (default: randomized on installation)

### Components

- `sources`

  - `facebook`
  - `google`
  - `twilio`

  The **Airy Controller** only starts configured sources. To keep system load to
  a minimum, only add the sources you are using.

- `integration`
  - `webhook`
    - `name` set this to the name of your webhook integration
    - `maxBackoff` set this to the maximum number of seconds the webhook should
      wait between retries with exponential backoff
- `media`
  - `resolver`
    - `s3Key` set this to your AWS S3 access key id
    - `s3Secret` set this to your AWS S3 secret access key
    - `s3Bucket` set this to your AWS S3 bucket
    - `s3Region` set this to your AWS region
    - `s3Path` set this to your AWS S3 path

### Tools

These settings are used to enable or disable some external tools, used to
monitor or debug the **Airy Core**.

- `akhq` Kafka GUI for Apache Kafka (For more information visit [akhq.io](https://akhq.io/))
  - `enabled` set to either `true` to start AKHQ or `false` (default) to disable it.

## Applying the configuration

If you made changes in `airy.yaml` and want to apply it to your instance you can
use the [airy config apply](/cli/usage.md#config-apply) by running the
following [Airy CLI](/cli/introduction.md) command.

```bash
airy config apply --workspace /path/to/config/directory/
```
