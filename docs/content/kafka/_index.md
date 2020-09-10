---
title: Kafka
---

# Kafka

- [Topic naming conventions](#topic-naming-conventions)
- [Compression](#compression)
  - [Message compression](#message-compression)
  - [State stores compression](#state-stores-compression)


## Topic naming conventions

Inspired by [this
article](https://medium.com/@criccomini/how-to-paint-a-bike-shed-kafka-topic-naming-conventions-1b7259790073),
our naming conventions follow these rules:

- A topic has a three-part name: `<kind>.<domain>.<dataset>`
- Each part uses lisp-case (down-case words separated by `-`. Example: `answer-is-42`)

Each part defines a more granular scope:

- `kind` is the type of data the topic contains at the highest level possible. Valid
  examples are: `etl`, `logging`, `tracking`.
- `domain` is what you would normally call a database name in a traditional rdms.
- `dataset` is what you would normally call a database table in a traditional rdms.

Given these rules, here are a few examples:

```
tracking.user.clicks
tracking.page.views

etl.billing.invalid-cc-cards
etl.billing.frauds

application.entity.organizations
application.communication.conversations
application.communication.messages
```

## Compression

### Message compression

The compression algorithm used by the producers is LZ4. This puts a bit more
load on the producers and the consumers but saves network because compression
occurs before the data is sent over to the brokers. Furthermore the size of
the topics is reduced by up to 80%. You can find more details in our
KafkaStreamsWrapper.

### State stores compression

The default compression is LZ4 and additionally the bottommost level is set to
the heavier compression algorithm ZSTD.  Since usually the majority of the
data resided in the bottommost level and is rarely moved once it has descended
into this level. This is in line with the Facebook recommendation but it did
not lead to great space improvements because prior to this change all the data
had already been compressed with Snappy. Nevertheless we expect better
performance and greater space improvements as our system scales.
