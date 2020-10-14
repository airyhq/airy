# Glossary

This document aims to provide an high-level overview of the Airy Core Platform
technical vocabulary. It provides definition of the most important terms used
both in the code and in the rest of the documentation.

**Please note this document is constantly being worked on.**

- [Glossary](#glossary)
  - [Introduction](#introduction)
  - [Source](#source)
  - [Channel](#channel)
  - [Contact](#contact)
  - [Conversation](#conversation)
  - [Message](#message)
    - [headers](#headers)

## Introduction

Our [Avro schemas](/backend/avro) provide a machine readable up-to-date version
of our backend data model. If you are looking for details like null constraints
and such, the Avro schemas folder is the right place. Furthermore, it is worth
underlining that the Avro data model and glossary do not correspond exactly. The
former is the exact machine representation of the data we store and the latter
is a conceptual artifact we created to discuss and solve problems of a typical
messaging system.

The Airy Core Platform allows its [users](#user) to process messaging data from
a variety of [sources](#source). Users connect to sources via
[channels](#channel). Once the channel is connected, the Airy Core Platform
ingests source data and transforms them into [conversations](#conversation),
[contacts](#contact), and [messages](#message).

## Source

A source represents a system that generates messaging data that a user wants
process with the Airy Core Platform. In most cases, a source provides data via a
webhook integration.

## Channel

A channel represents a connection between a [source](#source) and the Airy Core Platform.

## Contact

## Conversation

## Message

### headers 

Header data contains information that is important for downstream processing. It
also includes the message preview and tags that are useful for certain apps like
automations.

- `headers` string map

    Optional headers:

    - `postback.payload` string postback payloads used for source automations
    - `postback.referral` string facebook specific referral identifier


- `id` uuid

Unique message id for deduplication.

- `senderType` string

What type of actor inserted the message. One of:

    - `SOURCE_CONTACT` message sent by a contact to the user source
    - `SOURCE_USER` sent to the source by the user but not via app
    - `APP_USER` sent to source via app

- `senderId` string

Identifies the participant that sent the message. Interpretation is based on the value of `senderType` like so:

| senderType     | senderId                                            |
| -------------- | --------------------------------------------------- |
| SOURCE_CONTACT | source contact id (e.g. Facebook page scoped id)    |
| APP_USER       | app channel id                                      |
| SOURCE_USER    | source dependent (e.g. Facebook third party app id) |


- `conversationId` uuid

- `channelId` uuid

- `content` string

- `offset` long sequence number of message within a conversation

- `source` string source that ingested the message `facebook`, `google`, `sms_twilio` etc.

- `deliveryState` string

    One of:

    - `PENDING` message to be sent out
    - `DELIVERED` message has been sent to source
    - `FAILED` message sending has terminally failed

- `sentAt` timestamp

- `updatedAt` timestamp null for messages that are inserted first time