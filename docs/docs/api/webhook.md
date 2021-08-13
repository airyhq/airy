---
title: Webhook
sidebar_label: Webhook
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Use Webhooks to receive get notified when events happen.

</TLDR>

:::note

The webhook integration is not enabled by default.

For more details on how to enable it, refer to our [Configuration Section](getting-started/installation/configuration.md#components).

:::

The webhook integration enables you to programmatically participate in
conversations by sending messages or reacting to them. Here's a common
integration pattern:

- Call the [subscribe](#subscribing) endpoint
- Consume on your URL of choice [events](#events)
- React to those events by calling the [send message](/api/endpoints/messages.md#send) endpoint

You must de-duplicate messages on arrival as the webhook _does not_ guarantee
events uniqueness.

## Subscribing

`POST /webhooks.subscribe`

Subscribes the webhook for the first time or update its parameters.

**Sample request**

```json5
{
  "id": "3e639566-29fa-450d-a59f-ae3c25d7260f", // optional
  "name": "Customer relationship tool",
  "url": "https://endpoint.com/webhook",
  "events": [
    // optional
    "message.created",
    "message.updated",
    "conversation.updated",
    "channel.updated",
    "metadata.item"
  ],
  "headers": {
    // optional
    "X-Custom-Header": "e.g. authentication token"
  },
  "signature_key": "secret-key-for-hmac-header"
}
```

- `id` (optional) provide for updates
- `name` (optional) human readable name for the webhook
- `url` endpoint to be called by webhook
- `headers` (optional) HTTP headers to set on each request (useful for authentication)
- `signature_key` (optional) when set, the webhook will also sent a header `X-Airy-Content-Signature` that contains the SHA256 HMAC of the specified key and the content.
- `events` (optional) List of event types to receive. [See below](#events) for a detailed list. Omit to receive all event types

**Sample response**

```json5
{
  "id": "3e639566-29fa-450d-a59f-ae3c25d7260f",
  "name": "Customer relationship tool", // optional
  "url": "https://endpoint.com/webhook",
  "events": [
    // optional
    "message.created",
    "message.updated",
    "conversation.updated",
    "channel.update",
    "metadata.item"
  ],
  "headers": {
    // optional
    "X-Custom-Header": "custom-code-for-header"
  },
  "status": "Subscribed"
}
```

## Unsubscribing

`POST /webhooks.unsubscribe`

**Sample response**

```json5
{
  "url": "https://endpoint.com/webhook",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  },
  "status": "Unsubscribed"
}
```

## List

`POST /webhooks.list`

```json5
{
  "data": [
    {
      "status": "Subscribed",
      "name": "Customer relationship tool",
      "url": "https://endpoint.com/webhook",
      "headers": {
        "X-Custom-Header": "custom-code-for-header"
      }
    },
    {
      "status": "Subscribed",
      "name": "Datalake connector",
      "url": "https://other-endpoint.com/webhook",
      "events": ["conversation.updated"]
    }
  ]
}
```

## Info

`POST /webhooks.info`

**Sample request**

```json5
{
  "id": "3e639566-29fa-450d-a59f-ae3c25d7260f"
}
```

**Sample response**

```json5
{
  "status": "Subscribed",
  "name": "Customer relationship tool",
  "url": "https://endpoint.com/webhook",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

## Events

After [subscribing](#subscribing) to an Airy webhook, you will
start receiving events on your URL of choice. The event will _always_ be a POST
request with one the following payloads:

### `message.created`

```json5
{
  "type": "message:created",
  "payload": {
    "conversation_id": "{UUID}",
    "channel_id": "{UUID}",
    "message": {
      "id": "{UUID}",
      "content": {"text": "Hello World"}, // source message payload
      "delivery_state": "pending|failed|delivered", // delivery state of message, one of pending, failed, delivered
      "from_contact": true,
      "sent_at": "2020-10-25T21:24:54.560Z", // ISO 8601 date string
      "source": "facebook" // messaging source
    }
  }
}
```

### `message.updated`

Sent whenever a message is updated (e.g. delivery state) or its [metadata](concepts/metadata.md) changed.

```json5
{
  "type": "message:created",
  "payload": {
    "conversation_id": "{UUID}",
    "channel_id": "{UUID}",
    "message": {
      "id": "{UUID}",
      "content": {"text": "Hello World"}, // source message payload
      "delivery_state": "pending|failed|delivered", // delivery state of message, one of pending, failed, delivered
      "from_contact": false,
      "sent_at": "2020-10-25T21:24:54.560Z", // ISO 8601 date string
      "source": "facebook", // messaging source
      "metadata": {
        "source": {
          "id": "facebook message id",
          "delivery_state": "seen"
        }
      }
    }
  }
}
```

### `conversation.updated`

**Sample payload**

```json5
{
  "type": "conversation:updated",
  "payload": {
    "id": "2e1da639-7152-4595-b43e-2117a55ac260",
    "created_at": "2020-10-25T21:24:54.560Z", // ISO 8601 date string
    "channel_id": "b9963564-1167-5b5f-9f61-7c1a82573320",
    "metadata": {
      "contact": {
        "displayName": "Grace Hopper"
      },
      "isUserTyping": true
    },
    "last_message": {
      "id": "{UUID}",
      "content": {"text": "Hello World"}, // source message payload
      "delivery_state": "pending|failed|delivered", // delivery state of message, one of pending, failed, delivered
      "from_contact": true,
      "sent_at": "2020-10-25T21:24:54.560Z", // ISO 8601 date string
      "source": "facebook" // messaging source
    }
  }
}
```

### `channel.updated`

Sent whenever a channel is (un-) subscribed or its metadata changes.

```json5
{
  "type": "channel.updated",
  "payload": {
    "id": "771b8bb5-c611-4979-bfd9-f10bbddfcf9b",
    "source": "facebook",
    "source_channel_id": "fb-page-id-1",
    "metadata": {
      "name": "My page 1",
      "image_url": "http://example.org/avatar.jpeg" // optional
    },
    "connected": true
  }
}
```

### `metadata.updated`

Metadata is backed by a stream of Key-Value updates. This event occurs whenever one of those updates occurs and thus doesn't reflect the full metadata associated with a namespace-identifier pair.

```json5
{
  "type": "metadata.updated",
  "payload": {
    "namespace": "conversation|channel|message",
    "id": "conversation/channel/message uuid",
    "metadata": {
      "name": "some value" // contains only one updated value
    }
  }
}
```
