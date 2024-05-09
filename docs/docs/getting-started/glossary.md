---
id: glossary
title: Glossary
sidebar_label: Glossary
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy allows its [users](#user) to process messaging data from a variety of
[sources](#source), which are integrated via [source providers](#provider).
Users connect sources via [channels](#channel). Once the channel is connected,
Airy Core ingests source data and transforms them into
[conversations](#conversation), [contacts](#contact), and [messages](#message).

</TLDR>

This document aims to provide a high-level overview of the Airy Core
technical vocabulary. It provides definitions of the most important terms used
both in the code and in the rest of the documentation.

Our [Avro schemas](https://github.com/airyhq/airy/tree/main/backend/avro)
provide a machine readable up-to-date version of our backend data model. If you
are looking for details like null constraints and such, the Avro schemas folder
is the right place. Furthermore, it is worth underlining that the Avro data
model and glossary do not correspond exactly. The former is the exact machine
representation of the data we store and the latter is a conceptual artifact we
created to discuss and solve problems.

## Component

import ComponentDefinition from './componentDefinition.mdx'

<ComponentDefinition/>

## Channel

A channel represents a connection between a [source](#source) and the Airy Core
Platform.

## Contact

A contact represents the [source](#source) participant. A
[conversation](#conversation) exists _only_ if it has _at least one_
[message](#message) from a contact.

:::note

Not the same as [users](#user). Contacts are source participants whereas users are the actual users interacting with
the airy platform.

:::

## Conversation

A conversation is the logical aggregation of [messages](#message) (at least one)
from exactly one [contact](#contact).

## Message

A message wraps the data that is being transferred from and to the
[source](#source) with metadata. By definition, the data is [source](#source)
dependent. It can be plain text, or rich media like videos or sound, images, or
templates.

- `id` uuid

Unique message id for deduplication.

- `headers` string map

  Optional headers:

  - `postback.payload` string postback payloads used for source automations
  - `postback.referral` string facebook specific referral identifier

- `fromContact` boolean

Indicates whether the message was sent by a contact or not.

- `conversationId` uuid

- `channelId` uuid

- `content` string Immutable string version of the ingested content.

- `offset` long sequence number of message within a conversation

- `source` string source that ingested the message `facebook`, `google`, `sms_twilio` etc.

- `deliveryState` string

  One of:

  - `pending` message to be sent out
  - `delivered` message has been sent to source or has arrived at Airy
  - `failed` message sending has terminally failed

- `sentAt` timestamp

- `updatedAt` timestamp `null` for messages that are inserted first time

### Headers

Header data contains information that is important for downstream processing and therefore cannot be separated from the message (as opposed to metadat).
It also includes the message preview and tags that are useful for use cases like routing and automations.

## Metadata

Metadata is optional data attached to a subject such as a conversation, channel or a message. Have a look
at [this page](concepts/metadata.md) for an in-depth explanation.

### Tag

A tag is a special use case of metadata, which is used to tag
[conversations](#conversation). As the use case of tagging conversations is so
common, Airy Core provides specialized endpoints and filters for tagging
conversations.

## AI & ML

## Large language model

A type of artificial intelligence model designed to understand and generate human-like text based on vast amounts of data. It's trained on diverse internet text to predict the next word in a sequence, enabling it to answer questions, generate content, and assist with various tasks. Airy allows a plug-able interface into different LLMs.

## Vector database

A high-dimensional database store which is suitable for persistent storage for natural language processing or images. The data is represented as vectors and retrieval is based on similarity, allowing for efficient similarity searches and context creation. Vector databases are very convenient for storing vector representations of streaming data that can be queried and add context to questions that are sent to LLMs, in real time.

## Automation

The ability of a an Airy component to react and simulate human-like conversations and automate specific tasks, in real time. It aims to provide users with immediate, consistent responses, reducing the need for human intervention in customer support, inquiries, and other conversational scenarios.

## Source

A source represents a system that generates messaging data that a user wants to
process with Airy Core.

### Provider

Source providers are API platforms that allow Airy Core to connect to one or
more of their sources typically via a webhook. E.g. Twilio is a source provider
for the Twilio SMS and WhatsApp sources.

## App

Third party open-source packages that can be installed alongside Airy, in the same Kubernetes cluster, to provide a more robust and powerful application development environment. These `Apps` can vary from databases (ex. PostgreSQL or Redis) to LLM implementations and vector databases (ex. Llama2 or FAISS).

## Stream

The whole Airy platform is based on Kafka and real-time streaming of messages. In the context of `streams` feature that Airy supports, a `stream` is the process of joining two or multiple Kafka topics, combining the data and creating an outout topic where the result of the streaming operation will be stored. It is based on KSQL.

## User

A user represents one authorized agent in Airy Core, which is different from a Contact

## Template

Pre-defined messages that can be enhanced with user defined data.
