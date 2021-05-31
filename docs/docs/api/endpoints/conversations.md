---
title: Conversations
sidebar_label: Conversations
---

Refer to our [conversation](getting-started/glossary.md#conversation)
definition for more information.

## List

`POST /conversations.list`

This is a [paginated](/api/endpoints/introduction.md#pagination) endpoint.

**Filtering**

This endpoint allows you to query conversations using the human readable [Lucene
Query Syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html). You
can query on all fields defined in [this
class](https://github.com/airyhq/airy/blob/main/backend/api/communication/src/main/java/co/airy/core/api/communication/dto/ConversationIndex.java).

**Sample request**

Find users whose name ends with "Lovelace":

```json5
{
  "filters": "display_name:*Lovelace", // optional
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Sample request**

```json5
{
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Sample response**

```json5
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "channel": {
        "source": "facebook",
        "id": "318efa04-7cc1-4200-988e-50699d0dd6e3",
        "metadata": {
          "name": "Facebook page name"
        }
      },
      "created_at": "2019-01-07T09:01:44.000Z",
      "metadata": {
        "contact": {
          "avatar_url": "https://assets.airy.co/AirySupportIcon.jpg",
          "display_name": "Airy Support"
        },
        "tags": {
          "f339c325-8614-43cb-a70a-e83d81bf56fc": ""
        },
        "unread_count": 1
      },
      "last_message": {
        id: "{UUID}",
        "content": {"text": "Hello World"},
        // source message payload
        // typed source message model
        state: "{String}",
        // delivery state of message, one of PENDING, FAILED, DELIVERED
        "from_contact": true,
        sent_at: "{string}",
        //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
        "source": "{String}"
        // one of the possible sources
      }
    }
  ],
  "pagination_data": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1,
    "badge_unread_count": 1
  }
}
```

## info

`POST /conversations.info`

**Sample request**

```json
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622"
}
```

**Sample response**

```json5
{
  "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "channel": {
    "metadata": {
      "name": "Facebook page name"
    },
    "id": "318efa04-7cc1-4200-988e-50699d0dd6e3",
    "source": "facebook"
  },
  "created_at": "2019-01-07T09:01:44.000Z",
  "metadata": {
    "contact": {
      "avatar_url": "https://assets.airy.co/AirySupportIcon.jpg",
      "display_name": "Airy Support"
    },
    "tags": {
      "f339c325-8614-43cb-a70a-e83d81bf56fc": ""
    },
    "unread_count": 1
  },
  "last_message": {
    "id": "{UUID}",
    "content": {"text": "Hello World"},
    // source message payload
    // typed source message model
    "delivery_state": "{String}",
    // delivery state of message, one of PENDING, FAILED, DELIVERED
    "from_contact": true,
    "sent_at": "{string}"
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  }
}
```

#### Mark conversation as read

`POST /conversations.read`

Resets the unread count of a conversation.

**Sample request**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622"
}
```

**Empty response (204)**

## Tag a conversation

Tags an existing conversation with [an existing
tag](/api/endpoints/tags.md#create). Returns status code `200` if successful.

`POST /conversations.tag`

**Sample request**

```json5
{
  "conversation_id": "CONVERSATION_ID",
  "tag_id": "TAG_ID"
}
```

**Empty response (204)**

## Untag a conversation

`POST /conversations.untag`

**Sample request**

```json5
{
  "conversation_id": "CONVERSATION_ID",
  "tag_id": "TAG_ID"
}
```

**Empty response (204)**

## Set the state of a conversation

`POST /conversations.setState`

**Sample request**

```json5
{
  "conversation_id": "CONVERSATION_ID",
  "state": "OPEN"
}
```

**Empty response (204)**

Supported states of a conversation are `OPEN` and `CLOSED`.

## Remove the state of a conversation

`POST /conversations.removeState`

**Sample request**

```json5
{
  "conversation_id": "CONVERSATION_ID"
}
```

**Empty response (204)**

## Update contact information

`POST /conversations.updateContact`

**Sample request**

```json5
{
  "conversation_id": "CONVERSATION_ID",
  "display_name": "Grace"
}
```

**Empty response (204)**
