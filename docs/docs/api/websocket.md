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

To execute the handshake with `/ws.communication` you must set an
`Authorization` header where the value is the authorization token obtained [from
the API](/api/introduction#authentication).

## Event Payloads

All event updates are sent to the `/events` queue as JSON encoded payloads. The `type`
field informs the client of the kind of update that is encoded in the payload.

### Message

```json5
{
  "type": "message",
  "payload": {
    "conversation_id": "{UUID}",
    "channel_id": "{UUID}",
    "message": {
      "id": "{UUID}",
      "content": {"text": "Hello World"},
      // source message payload
      "delivery_state": "pending|failed|delivered",
      // delivery state of message, one of pending, failed, delivered
      "from_contact": true,
      "sent_at": "{string}",
      //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
      "source": "{String}"
      // one of the possible sources
    }
  }
}
```

### Metadata

**Sample payload**

```json5
{
  "type": "metadata",

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

### Channel

```json5
{
  "type": "channel",

  "payload": {
    "id": "{UUID}",
    "source": "facebook",
    "source_channel_id": "fb-page-id-1",
    "connected": true // or false
  }
}
```
