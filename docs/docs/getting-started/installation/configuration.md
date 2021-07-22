---
title: Configure your Airy Core instance
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

Your Airy Core instance will start and stop components according to your
configuration. For example, if you do not wish to start Facebook components, it
is enough not to provide any Facebook specific configuration.

Now let's have a look at the different sections so you can make the changes you
are looking for.

### Kubernetes

- `appImageTag` the image tag of the container images for the **Airy Components**

  If you want to launch an older version refer to our
  [Releases](https://github.com/airyhq/airy/releases) for the correct version
  number, or if you are feeling adventurous, try `develop` at your own risk.

- `containerRegistry` the URL of the container registry

- `namespace` the Kubernetes namespace that the **Airy Core** will use

- `ingress` the subdomains for the **Airy Components** that need to be accessed from outside the Kubernetes cluster

### Prerequisites

These settings are used to connect the **Airy Components** to your Kafka
cluster and Redis.

- `kafka`

  - `brokers` comma separated list of the broker endpoints
  - `schema-registry` url to the Schema Registry
  - `commitInterval` the [Kafka Commit Interval](https://kafka.apache.org/documentation/#consumerconfigs_auto.commit.interval.ms) if you are using the included Helm chart

### Security

- `systemToken` set to a long secure secret to use for machine [API authentication](security#api-security)
- `allowedOrigins` your site's origin to prevent CORS-based attacks (default: `"*"`)
- `oidc` a map of values that when set enable and define [OIDC authentication](security#configuring-oidc)
- `jwtSecret` used to create jwt http sessions derived from oidc authentication (default: randomized on installation)

### Components

- `sources`

  - `facebook`
    - `appId` set this to your Facebook App ID
    - `appSecret` set this to your Facebook App Secret
    - `webhookSecret` set this to a webhook secret of your choice (optional)
  - `google`
    - `saFile` copy here the content of your Google service account key file (one line json string)
    - `partnerKey` set this to your Google parttner key
  - `twilio`
    - `authToken` set this to your Twilio authentication token
    - `accountSid` set this to your Twilio account SID

  The **Airy Controller** only starts configured sources. To keep system load to
  a minimum, only add the sources you are using.

- `integration`
  - `webhook`
    - `name` set this to the name of your webhook integration
    - `maxBackoff` set this to the maximum number of seconds the webhook should
      wait between retries with exponential backoff
- `media`
  - `storage`
    - `s3Key` set this to your AWS S3 access key id
    - `s3Secret` set this to your AWS S3 secret access key
    - `s3Bucket` set this to your AWS S3 bucket
    - `s3Region` set this to your AWS region
    - `s3Path` set this to your AWS S3 path

### Tools

These settings are used to enable or disable some external tools used to
monitor or debug the **Airy Core**.

- `akhq` Kafka GUI for Apache Kafka (For more information visit [akhq.io](https://akhq.io/))
  - `enabled` set to either `true` to start AKHQ or `false` (default) to disable it

### Example airy.yaml file

For example, if you want to enable Facebook, Google and Twilio sources, as well as the webhook integration and the AKHQ tool, your `airy.yaml` file should look like this:

```yaml
kubernetes:
  containerRegistry: ghcr.io/airyhq
  namespace: default
  ngrokEnabled: false
security:
  allowedOrigins: "*"
  systemToken: "my-token-for-the-api"
  jwtSecret: "generated-secret-during-installation"
components:
  sources:
    facebook:
      appId: "fb-app-id"
      appSecret: "fb-app-secret"
      webhookSecret: "my-webhook-secret"
    google:
      saFile: '{"type": "service_account","project_id": "my-project","private_key_id": "my-private-key-id","private_key": "-----BEGIN PRIVATE KEY-----\nKEY-DATA-\n-----END PRIVATE KEY-----\n","client_email": "some-e-mail","client_id": "client-id",....}'
      partnerKey: "gl-private-key"
  integration:
    webhook:
      name: webhook
      maxBackoff: 10
```

## Applying the configuration

If you made changes in `airy.yaml` and want to apply it to your instance you can
use the [airy config apply](/cli/usage.md#config-apply) by running the
following [Airy CLI](/cli/introduction.md) command.

```bash
airy config apply --workspace /path/to/config/directory/
```
