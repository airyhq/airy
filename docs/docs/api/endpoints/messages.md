---
title: Messages
sidebar_label: Messages
---

Refer to our [messages](getting-started/glossary.md#message) definition
for more information.

## List

`POST /messages.list`

This is a [paginated](#pagination) endpoint. Messages are sorted from oldest to
latest.

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
      "sender_type": "{string/enum}",
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
  ],
  "pagination_data": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1
  }
}
```

## Send

import MessagesSend from './messages-send.mdx'

<MessagesSend />

## Send from Google's Business Messages source

import GoogleMessagesSend from './google-messages-send.mdx'

<GoogleMessagesSend />

## Suggest replies

`POST /messages.suggestReplies`

Suggest a set of replies for a given message id. UI clients can show these to agents to make responding to user inquiries
faster and more efficiently.

**Sample request**

```json5
{
  "message_id": "uuid",
  "suggestions": {
    "suggestion-id-1": {
      "content": {"text": "Great that it worked. Is there anything else you need?"}
    },
    "suggestion-id-2": {
      "content": {"text": "Have a nice day!"}
    }
  }
}
```

**Sample response**

The updated message including the suggested replies.

```json5
{
  "id": "{UUID}",
  "content": {"text": "Hello World"},
  "state": "{String}",
  "sender_type": "{string/enum}",
  "sent_at": "{string}",
  "source": "{String}",
  "metadata": {
    "suggestions": {
      "suggestion-id-1": {
        "content": {"text": "Great that it worked. Is there anything else you need?"}
        // source specific content field (same as message content)
      },
      "suggestion-id-2": {
        "content": {"text": "Have a nice day!"}
      }
    }
  }
  // metadata object of the message including the reply suggestions
}
```
