# Airy Core Platform API

This documents aims to offer an high-level overview of the different parts that
compose our API.

- [Airy Core Platform API](#airy-core-platform-api)
  - [Introduction](#introduction)
  - [Endpoints](#endpoints)
    - [Conversations](#conversations)
      - [List conversations](#list-conversations)
      - [Conversation by id](#conversation-by-id)
      - [Mark conversation as read](#mark-conversation-as-read)
    - [Messages](#messages)
      - [Messages of a conversation](#messages-of-a-conversation)
      - [Send a message](#send-a-message)
    - [Channels](#channels)
      - [Connecting Channels](#connecting-channels)
      - [Disconnecting Channels](#disconnecting-channels)
      - [List Available Channels](#list-available-channels)
      - [List Connected Channels](#list-connected-channels)
    - [Webhooks](#webhooks)
      - [Subscribing to a webhook](#subscribing-to-a-webhook)
      - [Unsubscribing to a webhook](#unsubscribing-to-a-webhook)
      - [Fetch webhook](#fetch-webhook)
  - [Pagination](#pagination)

## Introduction

Our HTTP endpoints adhere to the following conventions:

- Endpoints only accept `POST` JSON requests.
- Except for the `/login` and `/signup` endpoints, communication
  always requires a valid [JWT token](#authorization).
- We use dots for namespacing URLS (eg there are no `/things.add`).

## Endpoints

The way we group endpoints reflects the high level entities of the [Airy Core Data
Model](/docs/data-model.md).

### Conversations

Please refer to our [conversation](/docs/data-model.md#conversation) definition for more
information.

#### List conversations

`POST /conversations.list`

This is a [paginated](#pagination) endpoint.

**Sample Request**

```json
{
  "filter": {
    "conversation_ids": ["uuid"],
    "channel_ids": ["channel-42"],
    "display_names": ["Grace Hopper"]
  },
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

Example Response:

```json5
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "channel": {
        "name": "facebook", // name of the source
        "id": "318efa04-7cc1-4200-988e-50699d0dd6e3"
      },
      "created_at": "2019-01-07T09:01:44.000Z",
      "contact": { // Additional data on the contact
        "avatar_url": "https://assets.airy.co/AirySupportIcon.jpg",
        "first_name": "Airy Support",
        "last_name": null,
        "id": "36d07b7b-e242-4612-a82c-76832cfd1026",
      },
      "tags": null,
      "last_message": {
        "display_text": "Welcome to Airy Messenger - I’m Mathias and I’m here to help.",
        "media_type": "text/fb-template",
        "id": "1e7674d7-b575-4683-8a77-d2651b9e3149-relayed",
        "sent_at": "2019-01-07T09:01:44.000Z"
      },
      "unread_message_count": 1,
    }
  ],
  "response_metadata": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1,
    "badge_unread_count": 1
  }
}
```

#### Conversation by id

`POST /conversations.by_id`

**Sample Request**

```json
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622"
}
```

**Sample Response**

```json5
{
  "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "channel": {
    "name": "facebook",
    "id": "318efa04-7cc1-4200-988e-50699d0dd6e3"
  },
  "created_at": "2019-01-07T09:01:44.000Z",
  "contact": {
    "avatar_url": "https://assets.airy.co/AirySupportIcon.jpg", // optional
    "first_name": "Airy Support", // optional
    "last_name": null, // optional
    "id": "36d07b7b-e242-4612-a82c-76832cfd1026",
  },
  "tags": null,
  "last_message": {
    id: "{UUID}",
    content: "{String}",
    // source content string
    state: "{String}",
    // delivery state of message, one of PENDING, FAILED, DELIVERED
    alignment: "{string/enum}",
    // LEFT, RIGHT, CENTER - horizontal placement of message
    sent_at: "{string}",
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  },
  "unread_message_count": 1
}
```


#### Mark conversation as read

`POST /conversations.mark-read`

Resets the unread count of a conversation and returns `202 (Accepted)`.

**Sample Request**

```json
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622"
}
```

**Sample Response**

```json5
{}
```

### Messages

Please refer to our [messages](/docs/data-model.md#message) definition for more
information.

#### Messages of a conversation

`POST /conversations.messages-list`

This is a [paginated](#pagination) endpoint and messages are sorted from oldest to latest.

**Sample Request**

```json5
{
  "conversation_id": "4242-4242-4242-424242", 
  "cursor": "next-page-uuid", // optional
  "page_size": 2  // optional
}
```

**Sample Response**

```json5
{
  "data": [
    {
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
  ],
  "response_metadata": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1
  }
}
```

#### Send a message

`POST /conversations.send`

Sends a message to a conversation and returns a payload.

**Sample Request**

```json5
{
  conversation_id: "a688d36c-a85e-44af-bc02-4248c2c97622",
  message: {
    text: "{String}"
  }
}
```

**Sample Response**

```json5
{
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
```

### Channels

#### Connecting Channels

`POST /channels.connect`

A synchronous endpoint that makes a request to the source on behalf of the user
to connect the channel.

This action is idempotent, so if the channel is already connected the status will be `202`.

**Sample Request**

```json5
{
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "token": "FB_TOKEN",
  "name": "My custom name for this page", // optional
  "image_url": "https://example.org/custom-image.jpg" // optional
}
```

**Sample Response**

```json5
{
	"id": "channel-uuid-1",
    "name": "My custom name for this page",
    "image_url": "https://example.org/custom-image.jpg", // optional
    "source": "facebook",
    "source_channel_id": "fb-page-id-1"
}
```

#### Disconnecting Channels

`POST /channels.disconnect`

A synchronous endpoint that makes a request to the source on behalf of the user
to disconnect the channel. It marks the channel as disconnected and deletes the
auth token.

This action is idempotent, so if the channel is disconnected the status will be `202`.
If the channel is unknown, the response status will be `400`.

**Sample Request**

```json5
{
  "channel_id": "uuid"
}
```

#### List Available Channels

`POST /channels.available`

A synchronous endpoint that makes a request to the source on behalf of the user
to list all the channels that are available. Some of those channels may already
be connected, which is accounted for in the boolean field `connected`. Due to
the nature of the request, response time may vary.

**Sample Request**

```json5
{
  "source": "facebook",
  "token": "some-token"
}
```

**Sample Response**

```json5
{
	"data": [
		{
			"name": "my page 1",
			"source": "facebook",
			"source_channel_id": "fb-page-id-1",
			"connected": false,
			"image_url": "http://example.org/avatar.jpeg" // optional
		},
		{
			"name": "my page 2",
			"source": "facebook",
			"source_channel_id": "fb-page-id-2",
            "connected": true
		}
	]
}
```

#### List Connected Channels

`POST /channels.connected`

**Sample Response**

```json5
{
	"data": [
		{
			"id": "channel-uuid-1",
			"name": "my page 1",
			"source": "facebook",
			"source_channel_id": "fb-page-id-1",
            "image_url": "http://example.org/avatar.jpeg" // optional
		},
		{
			"id": "channel-uuid-2",
			"name": "my page 2",
			"source": "facebook",
			"source_channel_id": "fb-page-id-2"
		}
	]
}
```

### Webhooks

#### Subscribing to a webhook

`POST /webhook-subscribe`

**Sample Request**

```json5
{
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

**Sample Response**

This endpoints returns 200 and an empty body.

#### Unsubscribing to a webhook

`POST /webhook-unsubscribe`

**Sample Response**

This endpoints returns 200 and an empty body.

#### Fetch webhook

`POST /webhook`

**Sample Response**

```json5
{
  "status": "Subscribed",
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

## Pagination

By default, paginated endpoints return at max 20 elements of the first page.

The size of the returned page can be controller via the `page_size` field of the
body. You can move back and forth between pages using the `cursor` field of the
body.

Paginated endpoints _always_ respond with the following JSON format:

```json
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "field1": "answer is 42",
      "field2": "this is fine"
    }
  ],
  "response_metadata": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1
  }
}
```

The response comes in two parts:

- `data`

  An array of objects. Object specification depends on the endpoint.

- `response_metadata`
  An object with the following fields:

  - `previous_cursor`

    The id of first elements in the previous page of data. Empty if the returned
    page is the first one.

  - `next_cursor`

    The id of first elements in the next page of data. Empty if the returned
    page is the last one.

  - `filtered_total`

    The total number of elements across pages in the context of the current
    filter selection. Only applicable to paginated endpoints that accept filter
    input.

  - `total`

    The total number of elements across all pages.
