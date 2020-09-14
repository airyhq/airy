# Airy Core Plafrom Data Model

This document aims to provide an high-level overview of the Airy Core Platform Data Model.

**Please note this document is constantly being worked on.**

## Introduction

Our [avro schemas](/backend/avro) provide a machine readable up-to-date version
of our data model. If you are looking for details like null constraints and
such, the avro schemas folder is the right place.

## Channel

## Conversation

## Message

Messages consist of two sets of data; header and body. Header data is primarily used by our streaming apps and is described by [message-container.avsc](../avro/communication/message-container.avsc), body data for now is only used for representation and defined by [message.avsc](../avro/communication/message-content.avsc)

### Message Container

Header data contains information that is important for downstream processing tells us who sent a message of what type and when. It also includes preview data and tags that are useful for certain apps like automations.

- `headers` string map

    The following key/values need to be implemented by sources

    - `SOURCE_MESSAGE_TYPE` string

        One of:

        - `MESSAGE` default
        - `POSTBACK` message triggered in response to an automation template
        - `QUICK_REPLY` special Facebook type of postback that carries contact information
        - `ECHO` e.g. Facebook sends an echo back for every message we send
        - `REQUEST_LIVE_AGENT` message is an event indicating that user wants to talk to a human agent

    - `SENT_VIA` string

        One of:

        - `AppUser` message sent by user but not via Airy (e.g. via Facebook page messaging)
        - `Bot` message sent by a bot we operate
        - `Postback` analogous to `SOURCE_MESSAGE_TYPE == POSTBACK`
        - `SourceContact` message sent by contact
        - `SourceContact` message sent by user of one of our clients

    - `SOURCE_TYPE` string source that ingested the message `FACEBOOK`, `GOOGLE`, `SMS_TWILIO` etc.

    Optional headers that are in use right now

    - `CONTAINS_ATTACHMENT` boolean used to indicate the presence of a Facebook `attachment_id`
    - `TRIGGER_TYPE` string generic postback payload for the airy automation platform


- `id` uuid

message id for deduplication and joining body data

- `senderOrigin` string

What type of actor inserted the message. Possible values: `CONTACT`, `USER` or `AIRY` for test generated messages.

- `senderId` string

Identifier of the sending actor. Set to `channelId` for `senderOrigin == "USER"` and `conversationId` for `senderOrigin == "CONTACT"`.

- `conversationId` string

- `preview` record

    - `displayText` string

        Full text for text messages. Otherwise, source specific description of the attachment type.

    - `contentType` string

        One of `text`, `postback`, `template`, `image`, `video`, `audio` or `file`

## Contact

## Team
