# Airy Core Platform API

This documents aims to offer an high-level overview of the different parts that
compose our API.

- [Airy Core Platform API](#airy-core-platform-api)
  - [Introduction](#introduction)
  - [Authorization](#authorization)
    - [Login](#login)
  - [Endpoints](#endpoints)
    - [Users](#users)
      - [Signup](#signup)
      - [Signup via invitation](#signup-via-invitation)
      - [Request password reset](#request-password-reset)
      - [Reset password](#reset-password)
    - [Conversations](#conversations)
      - [List conversations](#list-conversations)
      - [Conversation by id](#conversation-by-id)
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

## Authorization

In order to communicate with our API endpoints, you need a valid
[JWT](https://jwt.io/) token. To get a valid token you need to use the login endpoint
[login](#login).

The login endpoints returns the following

- a short lived JWT token you can use for API requests
- a refresh token you can use to generate a new JWT token if it is no longer
  valid. Only store the refresh token and use it to generate the short lived
  token.

### Login

As the purpose of this endpoint is to obtain valid JWT tokens, this endpoint
does not require a valid token to be present in the headers.

`POST /login

Example payload:

```json
{ "email": "grace@example.com", "password": "avalidpassword" }
```

**Required**:

- `email` String
- `password` String

Example response:

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "avatar_url": "http://example.com/avatar.png",
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

## Endpoints

The way we group endpoints reflects the high level entities of the [Airy Core Data
Model](/docs/data-model.md).

### Users

Please refer to our [user](/docs/data-model.md#users) definition for more
information.

#### Signup

`POST /signup`

Example payload:

```json
{
  "first_name": "Grace",
  "last_name": "Hopper",
  "password": "the_answer_is_42",
  "email": "grace@example.com"
}
```

**Required**:

- `first_name` String
- `last_name` String
- `password` String
- `email` String

The password _MUST_ be at least 6 (six) characters long

Example response:

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "organizations": [],
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

#### Signup via invitation

`POST /signup-via-invitation`

```json5
{
  "id": "invitation-code",
  "first_name": "GOOD",
  "last_name": "DOGGO",
  "password": "MUCH-PASSWORD"
}
```

**Required**

- `id`: String
- `first_name`: String
- `last_name`: String
- `password`: String (6 chars minimum)

Example response:

```json5
{
  "id": "62ba6901-22bd-483f-8b34-f3954206028e",
  "email": "wow@airy.co",
  "first_name": "GOOD",
  "last_name": "DOGGO",
  "token": "TOKEN",
  "refresh_token": "REFRESH-TOKEN"
}
```

This endpoint returns the same response as the login

#### Request password reset

`POST /request-password-reset`

This endpoint requests a password reset email link to be sent to the given email. If the email does not exist, the response does not change.

Example payload:

```json5
{
  email: "grace@example.com"
}
```

Example response:

```json5
{}
```

#### Reset password

`POST /reset-password`

This endpoint sets a new password given a valid reset token. Used or expired tokens produce errors.

Example payload:

```json5
{
  token: "a-valid-reset-token",
  new_password: "i-hope-i-will-remember-this-one"
}
```

Example response:

```json5
{}
```

The new password _MUST_ be at least 6 (six) characters long

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

**Required**:

- `conversation_id` UUID

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
  "unread_message_count": 1
}
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

Returns the id that the message will be persisted with in the backend. Combined
with the websocket [queue for message
upserts](websocket.md#userqueueairymessageupsert)
(/user/queue/airy/message/upsert) you can use this id to verify that a message
has been delivered.

**Required**:

- `conversation_id` UUID
- `message` Object

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

```json
{
    "message_id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a"
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
			"image_url": "fb-page-id-1" // optional
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
			"source_channel_id": "fb-page-id-1"
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
