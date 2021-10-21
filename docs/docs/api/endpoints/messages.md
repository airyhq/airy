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
      "content": {"text": "Hello World"},
      // source message payload
      "state": "{String}",
      // delivery state of message, one of PENDING, FAILED, DELIVERED
      "from_contact": true,
      "sent_at": "{string}",
      // ISO 8601 date string
      "source": "{String}",
      // one of the possible sources
      "metadata": {
        "sentFrom": "iPhone"
      }
      // metadata object of the message
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

**Sample response**

```json5
{
  "id": "{UUID}",
  "content": "{\"text\":\"Hello\"}",
  "state": "pending|failed|delivered",
  "from_contact": true,
  // See glossary
  "sent_at": "{string}",
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  "source": "{String}",
  // one of the possible sources
  "metadata": {
    "sentFrom": "iPhone"
  }
  // metadata object of the message
}
```

**Starting a conversation**

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
  "state": "pending|failed|delivered",
  "from_contact": true,
  "sent_at": "{string}",
  "source": "{String}",
  "metadata": {}
}
```

## Send from Google's Business Messages source

import GoogleMessagesSend from './google-messages-send.mdx'

<GoogleMessagesSend />

## Suggest replies

import SuggestReplies from './suggest-replies.mdx'

<SuggestReplies />
