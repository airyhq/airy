---
title: WebSocket
sidebar_label: WebSocket
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy Core offers a WebSocket server that allows clients to **connect and receive
near real-time updates**.

</TLDR>

The WebSocket server uses the
[STOMP](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol)
protocol endpoint at `/ws.communication`.

## Event Payloads

All event updates are sent to the `/events` queue as JSON encoded payloads. The
`type` field informs the client of the kind of update that is encoded in the
payload.

### `message.updated`

```json5
{
  "type": "message.updated",
  "payload": {
    "conversation_id": "{UUID}",
    "channel_id": "{UUID}",
    "message": {
      "id": "{UUID}",
      // source message payload
      "content": {"text": "Hello World"},
      // delivery state of message, one of pending, failed, delivered
      "delivery_state": "pending|failed|delivered",
      "from_contact": true,
      //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
      "sent_at": "{string}",
      // one of the possible sources
      "source": "{String}",
      // details about the sender
      "sender": {
        "id": "github:12345" // For unauthenticated instances this defaults to "airy-core-anonymous"
      }
    }
  }
}
```

### `metadata.updated`

Includes the full and current state of a metadata object given a namespace-identifier pair

**Sample payload**

```json5
{
  "type": "metadata.updated",

  "payload": {
    "subject": "conversation|channel|message",
    "identifier": "conversation/channel/message id",
    "metadata": {
      // nested metadata object. I.e. for a conversation:
      "contact": {
        "displayName": "Grace"
      },
      "isUserTyping": true
    }
  }
}
```

### `channel.updated`

```json5
{
  "type": "channel.updated",

  "payload": {
    "id": "{UUID}",
    "source": "facebook",
    "source_channel_id": "fb-page-id-1",
    "connected": true // or false
  }
}
```

### `tag.updated`

```json5
{
  "type": "tag.updated",

  "payload": {
    "id": "{UUID}",
    "name": "flag",
    "color": "tag-red"
  }
}
```
