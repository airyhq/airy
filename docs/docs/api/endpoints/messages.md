---
title: Messages
sidebar_label: Messages
---

Refer to our [message](getting-started/glossary.md#message) definition for more
information.

## List

`POST /messages.list`

This is a [paginated](api/endpoints/introduction.md#pagination) endpoint. Messages
are sorted from oldest to latest.

**Sample request**

```json5
{
  "conversation_id": "4242-4242-4242-424242",
  "cursor": "next-page-uuid", // optional
  "page_size": 2 // optional
}
```

**Sample response**

```json5
{
  "data": [
    {
      "id": "{UUID}",
      // source message payload
      "content": {"text": "Hello World"},
      // delivery state of message, one of PENDING, FAILED, DELIVERED
      "state": "{String}",
      "from_contact": true,
      // ISO 8601 date string
      "sent_at": "{string}",
      // one of the possible sources
      "source": "{String}",
      // metadata object of the message
      "metadata": {
        "sentFrom": "iPhone"
      },
      // details about the sender
      "sender": {
        "id": "github:12345", // For unauthenticated instances this defaults to "airy-core-anonymous"
        "name": "John Doe", // optional
        "avatar_url": "http://example.org/avatar.png" // optional
      }
    }
  ],
  "pagination_data": {
    "previous_cursor": "",
    "next_cursor": "",
    "total": 1
  }
}
```

## Send

`POST /messages.send`

Sends a message to a conversation and returns a payload. Whatever is put on the
`message` field will be forwarded "as-is" to the source's message endpoint. Therefore,
the payload will look differently for each source. Refer to each [source's documentation](/sources/introduction)
to see learn how to send text, media, and many more message types.

**Sample request**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    // Source specific body
  }
}
```

**Sample response (202)**
Because of the nature of being an asynchronous system, sometimes the conversation is not ready at the time of
sending the message. The status code `202` indicates that this is the case and also does not include a response body.
In case the conversation was eventually not found error metadata will be delivered asynchronously using the
[webhook](api/webhook.md) and [websocket](api/websocket.md).

**Sample response (200)**
The conversation was found and the message is pending to be delivered.

```json5
{
  "id": "{UUID}",
  "content": "{\"text\":\"Hello\"}",
  "state": "pending|failed|delivered",
  // See glossary
  "from_contact": true,
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  "sent_at": "{string}",
  // one of the possible sources
  "source": "{String}",
  // metadata object of the message
  "metadata": {
    "sentFrom": "iPhone"
  },
  // details about the sender
  "sender": {
    "id": "github:12345", // For unauthenticated instances this defaults to "airy-core-anonymous"
    "name": "John Doe", // optional
    "avatar_url": "http://example.org/avatar.png" // optional
  }
}
```

### Starting a conversation

The previous flow covers the use cases of most messaging sources. However, some sources such as SMS or Whatsapp also
allow you to send messages to contacts that did not previously message you first. This means that you can create new conversations with them if you know their `source recipient id`.

**Sample request**

```json5
{
  "source_recipient_id": "+491234567",
  "channel_id": "<airy uuid>",
  "message": {
    // Source specific body
  }
}
```

**Sample response**

```json5
{
  "id": "{UUID}",
  "content": "{\"text\":\"Hello world\"}", // Source specific body
  "state": "pending",
  "from_contact": true,
  "sent_at": "{string}",
  "source": "{String}",
  "metadata": {},
  // details about the sender
  "sender": {
    "id": "github:12345", // For unauthenticated instances this defaults to "airy-core-anonymous"
    "name": "John Doe", // optional
    "avatar_url": "http://example.org/avatar.png" // optional
  }
}
```

### Error handling

Since outbound messages are delegated to the source apps we don't implement synchronous error replies. Instead, errors are sent
asynchronously as updates to the message's metadata. Those updates can be consumed with either the [webhook](/api/webhook) or the [websocket](/api/websocket).

The message's state will also change to `failed`. Both changes will be visible in the conversation and messages query endpoints.

**Sample metadata websocket update**

```json5
{
  "type": "metadata.updated",
  "payload": {
    "subject": "message",
    "identifier": "failed message id",
    "metadata": {
      "error": "Some error message"
    }
  }
}
```

**Sample message webhook update**

```json5
{
  "type": "message.updated",
  "payload": {
    "conversation_id": "conversation id",
    "channel_id": "channel id",
    "message": {
      "id": "failed message id",
      "content": {"text": "Hello World"}, // source message payload
      "delivery_state": "failed",
      "from_contact": false,
      "sent_at": "2020-10-25T21:24:54.560Z", // ISO 8601 date string
      "source": "facebook", // messaging source
      "metadata": {
        "error": "Some error message"
      }
    }
  }
}
```

## Suggest replies

import SuggestReplies from './suggest-replies.mdx'

<SuggestReplies />
