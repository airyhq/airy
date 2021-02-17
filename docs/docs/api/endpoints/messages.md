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
      // typed source message model
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

`POST /messages.send`

Sends a message to a conversation and returns a payload. Whatever is put on the
`message` field will be forwarded "as-is" to the source's message endpoint.

**Sending a text message**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "text": "Hello World"
  }
}
```

**Sample response**

```json5
{
  "id": "{UUID}",
  "content": {"text": "Hello"},
  "state": "pending|failed|delivered",
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
```
