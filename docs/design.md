# Design principles

## One source of truth, no shared state

The design of the Airy Core Platform heavily relies on two core ideas. Here's the first one:

> There's one source of truth for data and that place is a [Apache
> Kafka](https://kafka.apache.org).

We mean that _all_ of the data the Airy Core Platform lives in Kafka. One way of
thinking about the Airy Core Platform as a strongly typed (via
[avro](https://avro.apache.org)) data pipeline.

Here's the second idea:

> Every service in the system builds their version of reality

## Data > Code

We believe data is the most important asset in any system.

## Test the real thing

Our _default_ choice for testing is high level integration tests.
