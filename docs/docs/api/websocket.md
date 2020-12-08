---
title: WebSocket
sidebar_label: Websocket
---

## Introduction

The Airy Core Platform offers a WebSocket server that allows clients to connect
and receive near real-time updates on communication data. The WebSocket server
uses the
[STOMP](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol)
protocol endpoint at `/ws.communication`.

## Outbound Queues

Outbound queues follow the pattern `/queue/:event_type[/:action}]` and
deliver JSON encoded payloads.

### Message

`/queue/message`

Incoming payloads notify connected clients that a message was created or updated.

**Sample Payload**

```json5
{
  "conversation_id": "{UUID}",
  "channel_id": "{UUID}",
  "message": {
    "id": "{UUID}",
    "content": {
      "text": "{String}",
      "type": "text"
      // Determines the schema of the content
    },
    // typed source message model
    "state": "{String}",
    // delivery state of message, one of PENDING, FAILED, DELIVERED
    "sender_type": "{string/enum}",
    // See glossary
    "sent_at": "{string}"
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  }
}
```

### Unread count

`/queue/unread-count`

Incoming payloads notify connected clients of the unread message count for a
specific conversation at the time of delivery. Clients should keep track of the
latest time the unread count for a specific conversation was updated and update
the value only for a more recent count.

**Sample Payload**

```json5
{
  conversation_id: "{UUID}",
  //unique conversation id
  unread_message_count: 42,
  //the number of unreaded messages in this conversation
  timestamp: "{string}"
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
}
```

### Channel connected

`/queue/channel/connected`

Incoming payloads notify connected clients whenever a channel was connected or updated.

**Sample Payload**

```json5
{
  "id": "{UUID}",
  "name": "my page 1",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "image_url": "http://example.org/avatar.jpeg" // optional
}
```

---

### Channel disconnected

Incoming payloads notify connected clients whenever a channel was disconnected.

`/queue/channel/disconnected`

**Sample Payload**

```json5
{
  "id": "{UUID}",
  "name": "my page 1",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "image_url": "http://example.org/avatar.jpeg" // optional
}
```
