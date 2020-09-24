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

    The following key/values need to be implemented by sources

    - `source` string source that ingested the message `FACEBOOK`, `GOOGLE`, `SMS_TWILIO` etc.

    Optional headers:

    - `postback.payload` string postback payloads used for source automations
    - `postback.referral` string facebook specific referral identifier 


- `id` uuid

Message id for deduplication and joining body data

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

- `content` string

## Team
