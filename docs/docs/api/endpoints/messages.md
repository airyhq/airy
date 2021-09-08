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

import MessagesSend from './messages-send.mdx'

<MessagesSend />

## Send from Google's Business Messages source

import GoogleMessagesSend from './google-messages-send.mdx'

<GoogleMessagesSend />

## Suggest replies

import SuggestReplies from './suggest-replies.mdx'

<SuggestReplies />
