---
title: Connect Airy to a remote Kafka cluster
sidebar_label: Use a remote Kafka cluster
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Airy by default ships with a Kafka cluster that is installed via Helm. If you already have an existing cluster or want
more direct control over its setup you can also connect your Airy installation to a remote Kafka cluster. In the following
sections we will show you how to do this.

## Configuration

First up you need to gather the addresses of your Kafka clusters bootstrap servers and add them to your airy.yaml file
like so: 

```yaml
kafka:
  bootstrapServers: kafka-broker-1.example.com:9092,kafka-broker-2.example.com:9092
```

Since the external Kafka cluster needs to be accessible over the internet it is a good idea to enable authentication.
Currently, the only authentication mechanism supported is SASL/SSL. SSL is required in order to protect your users' data in transit.
You can have a look at [this page](https://docs.confluent.io/platform/current/kafka/authentication_sasl/index.html#recommended-broker-jaas-configuration) to learn how to configure your broker to use this method. 



