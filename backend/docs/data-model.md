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

Header data contains information that is important for downstream processing tells us who sent a message of what type and when. It also includes preview data and tags that are useful for certain apps like automations.

- `headers` string map

    Optional headers:

    - `postback.payload` string postback payloads used for source automations
    - `postback.referral` string facebook specific referral identifier 


- `id` uuid

Unique message id for deduplication

- `senderType` string

What type of actor inserted the message. One of:

    - `SOURCE_CONTACT` messagesent by a contact to the user source
    - `SOURCE_USER` sent to the source by the user but not via app
    - `APP_USER` sent to source via app

- `senderId` string

Identifies the participant that sent the message. Interpretation is based on the value of `senderType` like so:

| senderType     | senderId                                            |
|----------------|-----------------------------------------------------|
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

## Team
