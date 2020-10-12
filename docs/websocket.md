# Airy Core WebSocket API

- [Airy Core WebSocket API](#airy-core-websocket-api)
  - [Introduction](#introduction)
  - [Outbound Queues](#outbound-queues)
    - [Message upsert](#message-upsert)
    - [Unread count](#unread-count)
        - [Channel connected](#channel-connected)
        - [Channel disconnected](#channel-disconnected)


## Introduction

The Airy Core Platform offers a websocket server that allows clients to connect
and receive near real-time updates on communication data. The websocket server
uses the
[STOMP](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol)
protocol endpoint at `/ws`.

## Outbound Queues

Outbound queues follow the pattern `/queue/{entity type}/{event type}` and
deliver JSON encoded payloads.

### Message upsert

`/queue/message/upsert`

Payloads coming into this queue notify the subscribed user that a message was
created or updated. This can be one of the following:

- First message of a conversation - conversation should be appended to the list

- A subsequent message of a conversation - message should be appended to
  existing conversation

- An existing message in an existing conversation - message should be replaced
  in the existing conversation


**Payload**

```json5
{
  conversation_id: "{UUID}",
  channelId: "{UUID}",
  message: {
      id: "{UUID}",
      content: "{String}",
      // source content string
      state: "{String}",
      // delivery state of message, one of PENDING, FAILED, DELIVERED
      alignment: "{string/enum}",
      // LEFT, RIGHT, CENTER - horizontal placement of message
      sent_at: "{string}",
      //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  }
}
```

### Unread count

`/queue/unread-count/update`

Payloads coming into this queue notify the subscribed user of the unread message
count for the given conversation, at a given point in time. Clients should
update the conversation's unread count only if the timestamp in the payload is
_after_ the timestamp of the last recorded count.


**Payload**

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


##### Channel connected

`/queue/channel/connected`

Notifies whenever a channel was connected or updated.

```json5
{
    "id": "{UUID}",
    "name": "my page 1",
    "source": "facebook",
    "source_channel_id": "fb-page-id-1",
    "image_url": "http://example.org/avatar.jpeg" // optional
}
```

------

##### Channel disconnected

`/user/queue/airy/channel/disconnected`

```json5
{
  "id": "{UUID}"
}
```