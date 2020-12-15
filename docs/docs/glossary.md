---
id: glossary
title: Glossary
sidebar_label: Glossary
---

This document aims to provide an high-level overview of the Airy Core Platform
technical vocabulary. It provides definition of the most important terms used
both in the code and in the rest of the documentation.

Our [Avro schemas](https://github.com/airyhq/airy/tree/main/backend/avro)
provide a machine readable up-to-date version of our backend data model. If you
are looking for details like null constraints and such, the Avro schemas folder
is the right place. Furthermore, it is worth underlining that the Avro data
model and glossary do not correspond exactly. The former is the exact machine
representation of the data we store and the latter is a conceptual artifact we
created to discuss and solve problems.

The Airy Core Platform allows its [users](#user) to process messaging data from
a variety of [sources](#source), which are integrated via [source
providers](#provider). Users] connect sources via [channels](#channel).
Once the channel is connected, the Airy Core Platform ingests source data and
transforms them into [conversations](#conversation), [contacts](#contact), and
[messages](#message).

## Channel

A channel represents a connection between a [source](#source) and the Airy Core
Platform.

## Contact

A contact represents the [source](#source) participant. A
[conversation](#conversation) exists _only_ if it has _at least one_ message
from a contact.

## Conversation

A conversation is the logical aggregation of [messages](#message) (at least one)
from exactly one [contact](#contact).

## Message

A message wraps the data that is being transferred from and to the
[source](#source) with metadata. By definition, the data is [source](#source)
dependent and it can be plain text, rich media like videos or sound, images, or
templates.

- `id` uuid

Unique message id for deduplication.

- `headers` string map

  Optional headers:

  - `postback.payload` string postback payloads used for source automations
  - `postback.referral` string facebook specific referral identifier

- `senderType` string

What type of actor inserted the message. One of:

    - `source_contact` sent to the source by a contact
    - `source_user` sent to the source by the user but not via app
    - `app_user` sent to source via app

- `senderId` string

Identifies the participant that sent the message. Interpretation is based on the value of `senderType`:

| senderType     | senderId                                            |
| -------------- | --------------------------------------------------- |
| SOURCE_CONTACT | source contact id (e.g. Facebook page scoped id)    |
| SOURCE_USER    | source dependent (e.g. Facebook third party app id) |
| APP_USER       | app channel id                                      |

- `conversationId` uuid

- `channelId` uuid

- `content` string Immutable string version of the ingested content. APIs dynamically parse and map it to a schema using the mapping library.

- `offset` long sequence number of message within a conversation

- `source` string source that ingested the message `facebook`, `google`, `sms_twilio` etc.

- `deliveryState` string

  One of:

  - `pending` message to be sent out
  - `delivered` message has been sent to source
  - `failed` message sending has terminally failed

- `sentAt` timestamp

- `updatedAt` timestamp null for messages that are inserted first time

### Headers

Header data contains information that is important for downstream processing. It
also includes the message preview and tags that are useful for certain apps like
automations.

## Metadata

Metadata is data attached to a conversation consisting of a set of Key/Value
pairs. A key can use the dot notation to represent namespaces.

e.g.

| Key                        | Value   |
| -------------------------- | ------- |
| "sender.id"                | "123A"  |
| "sender.contact.first_name | "Grace" |

## Source

A source represents a system that generates messaging data that a user wants to
process with the Airy Core Platform.

### Provider

Source providers are API platforms that allow the Airy Core Platform to connect to
one or more of their sources typically via a webhook. E.g. Twilio is a source provider
for the Twilio SMS and Whatsapp sources.

## User

A user represents one authorized agent in the Airy Core Platform.
