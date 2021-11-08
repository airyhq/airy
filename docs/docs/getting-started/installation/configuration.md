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

:::note
If you installed Airy with Helm, then you need to [setup your workspace directory](/getting-started/installation/helm#workspace-setup), before you can use the CLI.
:::

Now let's have a look at the different sections so you can make the changes you
are looking for.

### Config

These settings are used to connect the **Airy Components** to your Kafka
cluster and Redis.

- `kafka`

  - `brokers` comma separated list of the broker endpoints
  - `zookeepers` comma separated list of the zookeeper endpoints
  - `schemaRegistryUrl` url to the Schema Registry
  - `commitInterval` the [Kafka Commit Interval](https://kafka.apache.org/documentation/#consumerconfigs_auto.commit.interval.ms) if you are using the included Helm chart

### Ingress

- `ingress`

  - `host` the hostname which will be used to access your `Airy Core` instance, outside of the Kubernetes cluster (default: airy.core)
  - `https` set to `true` to enable HTTPS
  - `loadbalancerAnnotations` list of annotations used to configure the LoadBalancer pointing to the ingress controller, in cloud environment (for AWS the following annotation is added by default: `service.beta.kubernetes.io/aws-load-balancer-type: nlb` )
  - `letsencryptEmail` the e-mail address used for Let's Encrypt registration, when using HTTPS.

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
    - `partnerKey` set this to your Google partner key
  - `twilio`
    - `authToken` set this to your Twilio authentication token
    - `accountSid` set this to your Twilio account SID
  - `viber`
    - `authToken` set this to your Viber authentication token

  The **Airy Controller** only starts configured sources. To keep system load to
  a minimum, only add the sources you are using.

- `integration`
  - `webhook`
    - `name` set this to the name of your webhook integration
- `media`
  - `storage`
    - `s3Key` set this to your AWS S3 access key id
    - `s3Secret` set this to your AWS S3 secret access key (The bucket needs to have PublicRead privileges)
    - `s3Bucket` set this to your AWS S3 bucket
    - `s3Region` set this to your AWS region
    - `s3Path` set this to your AWS S3 path

### Tools

These settings are used to enable or disable some external tools used to
monitor or debug the **Airy Core**.

- `akhq` Kafka GUI for Apache Kafka (For more information visit [akhq.io](https://akhq.io/))
  - `enabled` set to either `true` to start AKHQ or `false` (default) to disable it
- `segment` Tracking tool that tracks anonymous usage of the platform
  - `enabled` set to `false` if you want to disable tracking

### Example airy.yaml file

For example, if you want to enable Facebook and Google sources, as well as the webhook integration, and the AKHQ tool, your `airy.yaml` file should look like this:

```yaml
ingress-controller:
  ngrokEnabled: true
  https: false
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
    source-api:
      enabled: true
```

## Applying the configuration

If you made changes in `airy.yaml` and want to apply it to your instance you can
use the [airy config apply](/cli/usage.md#config-apply) by running the
following [Airy CLI](/cli/introduction.md) command.

```bash
airy config apply --workspace /path/to/config/directory/
```
