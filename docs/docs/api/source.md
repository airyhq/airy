---
title: Source API
sidebar_label: Source
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

With the Source HTTP API you can build your own Airy messaging source in no time.

</TLDR>

:::note

This feature is disabled by default. To enable it you need to provide values for the `security.jwtSecret`, `security.systemToken` and `integration.source-api.enabled` fields in your [airy.yaml config](getting-started/installation/configuration.md).

:::

The source API allows you to leverage Airy's message ingestion and real time delivery for any messaging platform
that is not yet officially supported. This is a typical usage pattern:

1. Get a source access token
2. Create a channel
3. Forward incoming events to Airy
4. Handle outgoing messages or changes in metadata by [registering an action endpoint](#action-endpoint)

**Note** For Airy there exists a 1 to 1 mapping between a source's channel/conversation/message id to the one stored in Airy. Therefore, the ids referenced in this payload must be identifiers used by the source.

Take for instance the Facebook Messenger source. You should map these fields like so:

- `source_id` → This is the identifier that will be written to all your messaging data (i.e. the `source` field on every [message](api/endpoints/messages.md#list)) and should thus not be changed later unless you want to partition your data.

- `source_message_id` → the `mid` sent in every [webhook message event](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages/). If your messaging source does not provide message ids, you can either create them yourself or use something like the hash of the message content and the timestamp as a proxy.

- `source_channel_id` → For Messenger this is the Facebook page id. If your source only supports one channel per account, you can also use a constant value for this field.

- `source_conversation_id` → Contacts for each Facebook page in Messenger are identified by a [Page-scoped ID](https://developers.facebook.com/docs/messenger-platform/identity/user-profile). Since in Messenger page conversations cannot have multiple participants, this uniquely identifies a conversation.

## Managing sources

Using your user [authentication](getting-started/installation/security.md) you [create](#create-a-source), [read](#list-sources), [update](#update-a-source), and [delete](#delete-a-source) sources.

### Create a source

`POST /sources.create`

To ensure that apps using the source API can write their data in isolation of each other, every app receives a
JWT which encodes the source id. This JWT has to be set on the `Authorization` header of each request to authenticate
the source and write the correct identifier to the messaging data.

**Sample request**

```json5
{
  "source_id": "my-crm-connector",
  "action_endpoint": "http://my-app.com/action", // Optional
  "name": "Human readable name for this source", // Optional
  "image_url": "http://example.org/sourcIcon.jpg" // Optional
}
```

- `source_id` An unique identifier of your source that will be stored alongside all messaging data.
- `action_endpoint` (optional) If your source app should handle events such as outbound messages, you need to specify the [action http endpoint](#action-endpoint) here.
- `name` (optional) Human readable name for this source.
- `image_url` (optional) Icon presenting this source for display.

**Sample response**

```json5
{
  "source_id": "my-crm-connector",
  "token": "<jwt token>",
  "action_endpoint": "http://my-app.com/action", // Optional
  "name": "Human readable name for this source", // Optional
  "image_url": "http://example.org/sourcIcon.jpg" // Optional
}
```

### List sources

`POST /sources.list`

**Sample response**

```json5
{
  "data": [
    {
      "source_id": "my-crm-connector",
      "action_endpoint": "http://my-app.com/action", // Optional
      "name": "Human readable name for this source", // Optional
      "image_url": "http://example.org/sourcIcon.jpg" // Optional
    }
  ]
}
```

### Delete a source

`POST /sources.delete`

Responds with `202 (Accepted)`.

**Sample request**

```json5
{
  "source_id": "my-crm-connector"
}
```

### Update a source

`POST /sources.update`

**Sample request**

```json5
{
  "source_id": "my-crm-connector",
  "action_endpoint": "http://my-app.com/action", // Optional
  "name": "Human readable name for this source", // Optional
  "image_url": "http://example.org/sourcIcon.jpg" // Optional
}
```

**Sample response**

```json5
{
  "source_id": "my-crm-connector",
  "action_endpoint": "http://my-app.com/action", // Optional
  "name": "Human readable name for this source", // Optional
  "image_url": "http://example.org/sourcIcon.jpg" // Optional
}
```

## Manage source channels

Using the token obtained during [creation](#create-a-source) a source can manage its own channels using the following endpoints.

### Create a channel

Creates a channel for the authenticated source.

`POST /sources.channels.create`

**Sample request**

```json5
{
  "source_channel_id": "Source identifier of the channel in use",
  "name": "My source channel", // required
  "metadata": {
    "image_url": "https://example.com/custom-image.jpg", // optional
    "token": "authentication string to use in your source app" // optional
  }
}
```

- `source_channel_id` source identifier of the channel. Messages sent to [`/sources.webhook`](#messaging-data-webhook) must have a connected channel.
- `token` (optional) You can include a token and other keys in the metadata to make it easier to build stateless source apps. 

**Sample response**

```json5
{
  "id": "1f679227-76c2-4302-bb12-703b2adb0f66", // Airy channel id
  "source_id": "my-source",
  "source_channel_id": "Source identifier of the channel in use",
  "metadata": {
    "name": "My source channel",
    "image_url": "https://example.com/custom-image.jpg",
    "token": "authentication string to use in your source app"  // optional
  },
  "connected": true
}
```

### List channels

List all connected channels of the authenticated source.

`POST /sources.channels.list`

**Sample response**

```json5
{
  data: [
    {
      "id": "1f679227-76c2-4302-bb12-703b2adb0f66", // Airy channel id
      "source_id": "my-source",
      "source_channel_id": "Source identifier of the channel in use",
      "metadata": {
        "name": "My source channel",
        "image_url": "https://example.com/custom-image.jpg" // optional
      },
      "connected": true
    }
  ]
}
```

### Disconnect a channel

Returns a `403` if the source does not have access to the given `channel_id`

`POST /sources.channels.disconnect`

**Sample request**

```json5
{
  "channel_id": "a688d36c-a85e-44af-bc02-4248c2c97622"
}
```

**Empty response (204)**

## Inbound Webhook

You can use this endpoint to ingest messages and metadata into Airy.

`POST /sources.webhook`

**Sample request**

```json5
{
  "messages": [
    {
      "source_message_id": "source message identifier",
      "source_conversation_id": "source conversation identifier",
      "source_channel_id": "source channel identifier",
      "source_sender_id": "Unique identifier of the sender of the message",
      "content": {"text": "Hello world"}, // Source specific content node (can be a plain string)
      "from_contact": true,
      "sent_at": 1603661094560 // Unix timestamp of event or ISO8601 date string
    }
  ],
  "metadata": [
    {
      "namespace": "conversation", // One of: conversation, message
      "source_id": "conversation id", // Source message or conversation id
      "metadata": {
        "contact": {
          "display_name": "Margaret Hamilton"
        }
      }
    }
  ]
}
```

## Action endpoint

When you [create](#create-a-source) a source you can register an action endpoint. This way Airy will be able to map common messaging features to your source. The endpoint will be called with a `POST` request containing a JSON payload that will indicate, which action to perform. Each action requires a different response. See below for possible action payloads, and their expected responses.

Each request includes an `X-Airy-Content-Signature` header that should be used to validate the authenticity of the request. To do so, compare the signature against the SHA256 HMAC of the source token you obtained during creation with the request content. Pseudocode:

```
isSignatureValid = hmac_sha256(key = source_token, message = request.body).to_lower_case() == request.headers['X-Airy-Content-Signature']
```

<!-- TODO add more signature validation code examples -->

[Our Java implementation](https://github.com/airyhq/airy/blob/develop/lib/java/crypto/src/main/java/co/airy/crypto/Signature.java#L21)

### Send message

When Airy users call the [`/messages.send`](api/endpoints/messages.md#send) endpoint to send a message to a conversation linked to your source, Airy will call your action endpoint with the following payload. Depending on the outcome you must respond with either a success or a failure payload.

```json5
{
  "type": "message.send",
  "payload": {
    "message": {
      "id": "uuid", // Airy message id
      "source_recipient_id": "source recipient identifier", // Depending on the source this can be the same as the source conversation id
      "content": {"text": "Hello world"},
      "sent_at": "1603661094560" // Unix timestamp of event
    },
    "conversation": {
      // Optional
      "id": "uuid", // Airy conversation id
      "channel_id": "uuid", // Airy channel id
      "source_conversation_id": "source conversation identifier",
      "created_at": "2021-08-31T09:27:46.528Z" //
    }
  }
}
```

The conversation object is absent if there is no existing conversation. If your source does not support sending messages to new conversations, you should respond with a failure message.

:::warning

It's possible for users to send messages to your source before it was connected and before this API was installed in the cluster. In that case messages with older `send_at` timestamps can be sent. It is up to your source to decide when a message is too old to send and return an error.

:::

**Success response payload**

Status code must be `200`.

```json5
{
  "source_message_id": "Source identifier of the sent message",
  "metadata": {} // Additional message metadata
}
```

**Failure response payload**

Status code must be in the range of `4xx`. For status codes above `500` the response Airy considers the network request failed, and the source unreachable.

```json5
{
  "error": "The content you attempted to send is malformed" // example message that will be included in the message metadata
}
```
