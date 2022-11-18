---
title: Kafka
sidebar_label: Kafka
---

The goal of this document is to provide information about how we use Kafka in
Airy Core.

## Topic naming conventions

Inspired by [this
article](https://cnr.sh/essays/how-paint-bike-shed-kafka-topic-naming-conventions),
our naming conventions follow these rules:

- A topic has a three-part name: `<kind>.<domain>.<dataset>`
- Each part uses lisp-case (down-case words separated by `-`. Example:
  `answer-is-42`)

Each part defines a more granular scope:

- `kind` is the type of data the topic contains at the highest level possible.
  Valid examples are: `etl`, `logging`, `tracking`
- `domain` is what you would call a database name in a traditional
  RDMS
- `dataset` is what you would call a database table in a traditional RDMS

Given these rules, here are a few examples:

```
application.communication.messages
application.communication.metadata

ops.application.health-checks
```
