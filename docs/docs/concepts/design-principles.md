---
title: Design Principles
sidebar_label: Design Principles
---

The design of Airy Core heavily relies on a few core ideas. The
goal of this document is to provide context about these ideas and how they
affected the way the platform is built.

## One source of truth, no shared state

The most central idea behind the Airy Core design is composed of
two connected principles. Here's the first one:

> There's one source of truth for data and that place is a [Apache
> Kafka](https://kafka.apache.org).

We mean _all_ of the data of an Airy Core instance lives in Kafka. One way of
thinking about it: as a strongly typed (via [Avro](https://avro.apache.org))
data pipeline. The HTTP endpoints the platform provide also solely rely on Kafka
via a feature called [interactive
queries](https://kafka.apache.org/documentation/streams/developer-guide/interactive-queries.html).

And here's the second principle:

> Every service in the system builds their version of reality.

What we mean is that we do not allow services to talk to each other and share
state via internal HTTP calls. Let's use an example to clarify: imagine we have
a service dealing with `conversations` data that needs `channels` data (see our
[glossary](getting-started/glossary.md) for more information) to build a JSON response. Many
systems would work like this:

- A client asks for `conversations`
- the service in charge makes an HTTP internal call to the `channels` service
- Once it obtains a response, it merges the data with the `conversations`
- It returns the data to the client

In Airy Core, it works like this:

- A client asks for `conversations`
- the service in charge has both `conversations` and `channels` data
- It returns the data to the client

As each service has their own version of reality (aka it maintains their own
state of everything they need), there is no communication between services. The
trade-off is that, at the cost of more disk space (traditionally pretty cheap),
we avoid any dependencies between services.

## Test the real thing

Our _default_ choice for testing is high-level integration tests. As
"integration tests" may mean different things to different people, we explain in
the following what it means for us.

Most components of Airy Core have multiple dependencies. For example, our HTTP
endpoints are Kafka Streams applications that expose data via interactive
queries. These endpoints depend on:

- Apache Kafka
- Apache Zookeeper (indirectly as Kafka depends on it)
- The confluent schema registry (almost all our topics are Avro encoded)

To us, "testing the real thing" in this context means:

- spinning up a test Kafka cluster (and a zookeeper one)
- spinning up a test schema registry server
- Run the tests against these test servers

The idea is that we test code in conditions that resemble as closely as possible
the production environments. In a way, this approach is also made possible by
the principle "Every service in the system builds their version of reality" as
most of our endpoints effectively only depend on the storage system and have no
other dependencies.
