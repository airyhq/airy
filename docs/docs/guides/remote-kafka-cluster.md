---
title: Connect Airy to a remote Kafka cluster
sidebar_label: Use a remote Kafka cluster
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Airy by default ships with a Kafka cluster that is installed via Helm. If you already have an existing cluster or want
more direct control over its setup you can also connect your Airy installation to a remote Kafka cluster. In the following
sections we will show you how to either point a running Airy instance. If you want to start a new Airy instance and want
to immediately connect it to Kafka have a look [here](/getting-started/installation/helm#kafka).

## Switching to a remote Kafka cluster

:::note
This guide does not cover how to migrate your existing data to another Kafka cluster. Instead, all running apps will
resume their operation using the data found in the new Kafka cluster. It is therefore also required that all topics
in the target cluster are already created.
:::

First up you need to gather the addresses of your Kafka clusters bootstrap servers and add them to your `airy.yaml` file
like so:

```yaml
kafka:
  brokers: kafka-broker-1.example.com:9092,kafka-broker-2.example.com:9092
```

Since the external Kafka cluster needs to be accessible over the internet it is a good idea to enable authentication.
Currently, the only authentication mechanism supported is SASL/PLAIN. You can have a look at [this page](https://docs.confluent.io/platform/current/kafka/authentication_sasl/index.html#recommended-broker-jaas-configuration) to learn how to configure your broker to use this method.

This should leave you with a single line JAAS configuration string that you also have to add to your `airy.yaml` file:

```yaml
kafka:
  brokers: kafka-broker-1.example.com:9092,kafka-broker-2.example.com:9092
  authJaas: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="Grace" password="trustno1";'
```

If you want to also use your own schema registry you can also add it to this config under the `schemaRegistryUrl` key:

```yaml
kafka:
  brokers: kafka-broker-1.example.com:9092,kafka-broker-2.example.com:9092
  authJaas: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="Grace" password="trustno1";'
  schemaRegistryUrl: http://schema-registry.example.com:8081
```

**If you do not do this** you have to explicitly add the existing schema registry url to this configuration as it will override
whatever is currently set. You can look up the current schema registry url by running:

```bash
kubectl get cm kafka-config -o=jsonpath="{.data.KAFKA_SCHEMA_REGISTRY_URL}"
```

Finally, you can apply this configuration by running the `airy config apply` command. Once you have verified that everything is
working you can scale down the default Kafka cluster by running the `kubectl scale sts kafka --replicas 0` command.
