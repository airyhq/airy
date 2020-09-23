# Airy Core Platform API

This documents aims to offer an high-level overview of the different parts that
compose our API.

- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [Conversations](#conversations)
    - [List conversations](#list-conversations)
    - [Conversation by id](#conversation-by-id)
    - [Mark all conversations as read](#mark-all-conversations-as-read)
  - [Messages](#messages)
    - [Messages of a conversation](#messages-of-a-conversation)
    - [Send a message](#send-a-message)
  - [Channels](#channels)
    - [Connecting Channels](#connecting-channels)
    - [Disconnecting Channels](#disconnecting-channels)
    - [List Available Channels](#list-available-channels)
    - [List Connected Channels](#list-connected-channels)
- [Error codes](#error-codes)
- [Pagination](#pagination)

## Introduction

Our HTTP endpoints adhere to the following conventions:

- Endpoints only accept `POST` JSON requests.
- Except for the `/login` and `/signup` endpoints, communication
  always requires a valid [JWT token](#authorization).
- There are no nested URLs (eg there are no `/thing/:id/:otherthing`)
- `4xx` responses always use a machine [error code](/#error-codes).

These constraints aim to simplify the eventual migration of our API to a GraphQL
schema, as a bonus we avoid complicated URL builders in the frontends.

## Endpoints

As there is no nesting, we group endpoints only logically. The idea is to focus
on the feature set endpoints enable. The grouping reflects the high level
entities of the [Airy Data Model](/docs/data-model.md).

### Conversations

Please refer to our [conversation](/docs/data-model.md#conversation) definition for more
information.

#### List conversations

`POST /conversations`

This is a [paginated](#pagination) endpoint.

Example body:

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
        "name": "FACEBOOK", // name of the source
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
        "offset": 27, // Sequence number of the last available message
        "id": "1e7674d7-b575-4683-8a77-d2651b9e3149-relayed",
        "sent_at": "2019-01-07T09:01:44.000Z"
      },
      "min_unread_message_count": 1
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

`POST /conversation`

Example body:

```json
{
  "conversation_id": "4242-4242-4242-424242"
}
```

**Required**:

- `conversation_id` UUID

Example Response:

```
{
  "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "channel": {
    "name": "FACEBOOK",
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
    "offset": 27, // Sequence number of the last available message
    "id": "1e7674d7-b575-4683-8a77-d2651b9e3149-relayed",
    "sent_at": "2019-01-07T09:01:44.000Z"
  },
  "min_unread_message_count": 1
}
```

#### Mark all conversations as read

`POST /mark-all-conversations-as-read`

### Messages

Please refer to our [messages](/docs/data-model.md#message) definition for more
information.

#### Messages of a conversation

`POST /messages`

This is a [paginated](#pagination) endpoint.

Example body:

```json
{
  "conversation_id": "4242-4242-4242-424242",
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Required**:

- `conversation_id` UUID - the conversation for which messages are to be fetched

**Optional**:

- `cursor` UUID
- `page_size` Integer

Example Response:

```json5
{
  "data": [
    {
      id: "{UUID}",
      content: "{String}",
      // source content string
      offset: "{number}",
      // represents the chronological ordering of messages in a conversation,
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

`POST /send-message`

Returns the id that the message will be persisted with in the backend. Combined with the websocket [queue for message upserts](websocket.md#userqueueairymessageupsert) (/user/queue/airy/message/upsert) you can use this id to verify that a message has been delivered.

**Required**:

- `conversation_id` UUID
- `message` Object

Example payload:

```json5
{
  conversation_id: "4242424242",
  message: {
    text: "{String}"
  }
}
```

Example response:

```json
{
    "message_id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a"
}
```


### Tags

The following endpoints enable adding and removing tags on a contact level.
Adding and removing tags is an async action, so the response is always empty.

#### Creating a tag

`POST /create-tag`

Example body:

```json5
{
  "name": "Urgent",
  "color": "tag-red" // one of tag-red | tag-blue | tag-green | tag-purple
}
```

If the tag is successfully created the endpoint will return `201` (created) with the tag id in the response body.

Example response:

```json5
{
  id: "TAG-UUID"
}
```

#### Deleting a tag

`POST /delete-tag`

```json
{
  "id": "ID-OF-THE-TAG"
}
```

Since this is an async action, the endpoint returns `202` (accepted).
The response is always an empty JSON.

Example response:

```json5
{}
```

#### Updating a tag

`POST /update-tag`

```json
{
  "id": "TAG-ID",
  "name": "Urgent",
  "color": "tag-blue"
}
```

Since this is an async action, the endpoint returns `202` (accepted). The
response is always an empty JSON.

Example response:

```json5
{}
```

#### Getting tags

`POST /tags`

Example response:

```json5
{
  tags: [
    {
      id: "TAG-ID",
      name: "name of the tag",
      color: "RED"
    }
  ]
}
```

#### Adding tag

This endpoint adds an existing tag to a conversation

`POST /add-tag`

Example body:

```json5
{
  conversation_id: "424242424242",
  tag_id: "uuid-of-the-tag"
}
```

Since this is an async action, the endpoint returns `202` (accepted).
The response is always an empty JSON.

Example response:

```json5
{}
```

#### Removing tag

`POST /remove-tag`

```json5
{
  converation_id: "424242424242",
  tag_id: "tag-uuid"
}
```

Since this is an async action, the endpoint returns `202` HTTP status code (accepted).
The response is always an empty JSON.

Example response:

```json5
{}
```

### Channels

#### Connecting Channels

`POST /connect-channels`

Async endpoint for connecting channels. It submits one or
more `ChannelConnectRequest` records to be handled by a source specific
`ChannelConnector`.  The endpoint responds with a map of external channel ids
(supplied in the endpoint's payload), and their generated Airy channel ids.
The Airy channel ids are used to await connection confirmation over websocket
(see websocket.md)

**Sample Request**

```json5
{
  "source": "FACEBOOK",
  "external_channel_ids": ["fb-page-id-1", "fb-page-id-2"],
  "token": "FB_TOKEN",
  "name": "My custom name for this page", // optional
  "image_url": "http://aws.com/jeff.jpg" // optional
}
```

**Sample Response**

```json5
{
	"pending_channel_ids": [
		"fb-page-id-1": "airy-channel-uuid-1",
		"fb-page-id-2": "airy-channel-uuid-2"
	]
}
```

#### Disconnecting Channels

`POST /disconnect-channels`

Async endpoint for disconnecting channels. It submits
one or more `ChannelDisConnectRequest` records to be handled by a source
specific `ChannelConnector`.  The endpoint has  no response, but the Airy
channel ids can be used to await disconnection confirmation over websocket
(see websocket.md)

**Sample Request**

```json5
{
  "source": "FACEBOOK",
  "external_channel_ids": ["external-channel-id-1", "external-channel-id-2"]
}
```

#### List Available Channels

`POST /channels`

Async endpoint for listing available channels of a given source., .  It submits
an `AvailableChannelsRequest` records to be handled by a source specific
`ChannelConnector`.  The endoint responds with an
`available_channels_request_id`, which should be used to clients to await the
response for the given request over websocket (see websocket.md).  The
response delivered over web socket includes the list of channels over the
given source, that have been connected to the Airy app (i.e. Airy has been
granted permission to consume events on behalf of those channels).  The
response also specifies, per channel whether it is connected.

**Sample Request**

```json5
{
  "source": "FACEBOOK",
  "token": "some-token"
}
```

**Sample Response**

```json5
{
	"available_channels_request_id": "some-uuid"
}
```


#### List Connected Channels

`POST /connected-channels`

**Sample Response**

```json5
{
	"channels": [
		{
			"id": "channel-uuid-1",
			"name": "my page 1",
			"source": "FACEBOOK",
			"external_channel_id": "fb-page-id-1"
		},
		{
			"id": "channel-uuid-2",
			"name": "my page 2",
			"source": "FACEBOOK",
			"external_channel_id": "fb-page-id-2"
		}
	]
}
```

### Teams

A team is a collection of filters.

#### Getting teams

`POST /teams`

**Sample Response**

```json5
{
  "teams": [
    {
      "id": "5112eb0d-8dcf-4546-85e3-8d40c25ae5d9",
      "name": "GEEZ",
      "members": [
        {
          "first_name": "Rick",
          "last_name": "Sanchez",
          "id": "a2c700f3-f537-4b3d-bd4b-dd9cfb1e3442"
        }
      ]
    }
  ]
}
```

#### Creating a team

**Sample Request**

`POST /create-team`

```json5
{
    "name": "TEAM NAME",
    "query": {
        "contact_ids": ["cid1", "cid2"], //for a team that only receive conversations of cid1 and cid2,
        "channel_ids": ["channel1", "channel2"], //for a team that only receives conversations written to channel1 and channel 2
        "display_names": ["Kobi", "Thomas"], //for a team that only receives conversations with Kobi or Thomas
        "min_unread_message_count": 1, //for a team that only receives conversations with at least 1 unread message
        "max_unread_message_count": 5, //for a team that only receives conversations with at most 5 unread messages
        "contact_tag_ids": ["tag1", "tag2"], //for a team that only receives conversation with contacts tagged with tag1 and tag2
    },
    "member_ids": ["user id 1", "user id 2"]
}
```

**Required**

- `name`: String
- `query`:
  - `channel_ids`: List of UUIDs. Needs to have AT LEAST one channel id.
- `member_ids`: List of String

**Optional**
- `query`:
  - `contact_ids`: List of UUIDs
  - `display_names`: List of String
  - `min_unread_message_count`: Integer
  - `max_unread_message_count`: Integer
  - `contact_tag_ids`: List of String

**Sample Response**

```json5
{
  id: "TEAM UUID"
}
```

#### Updating a team

`POST /update-team`

**Sample Request**


```json5
{
    "team_id": "TEAM ID",
    "name": "TEAM NAME",
    "query": {
        "contact_ids": ["cid1", "cid2"], //for a team that only receive conversations of cid1 and cid2,
        "channel_ids": ["channel1", "channel2"], //for a team that only receives conversations written to channel1 and channel 2
        "display_names": ["Kobi", "Thomas"], //for a team that only receives conversations with Kobi or Thomas
        "min_unread_message_count": 1, //for a team that only receives conversations with at least 1 unread message
        "max_unread_message_count": 5, //for a team that only receives conversations with at most 5 unread messages
        "contact_tag_ids": ["tag1", "tag2"], //for a team that only receives conversation with contacts tagged with tag1 and tag2
    }
}
```

**Required**

- `team_id`: UUID of the team
- `name`: String
- `query`:
  - `channel_ids`: List of UUIDs. Needs to have AT LEAST one channel id.

**Optional**
- `query`:
  - `contact_ids`: List of UUIDs
  - `display_names`: List of String
  - `min_unread_message_count`: Integer
  - `max_unread_message_count`: Integer
  - `contact_tag_ids`: List of String

#### Adding users to a team

`POST /add-users-to-team`

**Sample Request**

```json5
{
    "team_id": "team_id",
    "user_ids": ["user1", "user2"]
}
```

**Required**

- `team_id`: UUID
- `user_ids`: List of UUIDs

**Sample Response**

This endpoint return `200` with an empty JSON body

```json5
{}
```

#### Remove users from a team

`POST /remove-users-from-team`

**Sample Request**

```json5
{
    "team_id": "team_id",
    "user_ids": ["user1", "user2"]
}
```

**Required**

- `team_id`: UUID
- `user_ids`: List of UUIDs

**Sample Response**

This endpoint return `200` with an empty JSON body

```json5
{}
```

#### Fetching a team

`POST /team`

**Sample Request**

```json5
{
  "team_id": "TEAM ID"
}
```

**Sample Response**

```json5
{
  "id": "TEAM ID",
  "name": "wubba lubba dub dub",
  "members": [
    {
      "id": "USER ID",
      "first_name": "First Name",
      "last_name": "Last Name"
    }
  ],
  "query": {
    "contact_ids": ["cid1", "cid2"],
    "channel_ids": ["channel1", "channel2"],
    "display_names": ["Kobi", "Thomas"],
    "min_unread_message_count": 1,
    "max_unread_message_count": 5,
    "contact_tag_ids": ["tag1", "tag2"],
  }
}
```
#### Deleting a team

`POST /delete-team`

**Sample Request**
```json5
{
  "team_id": "TEAM ID"
}
```

**Sample Response**

```json5
{}
```

The endpoint returns `202` (Accepted)

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

**Response**

This endpoints returns 200 and an empty body.

#### Unsubscribing to a webhook

`POST /webhook-unsubscribe`

**Response**

This endpoints returns 200 and an empty body.

#### Get webhook

`POST /webhook`

**Response**

```json5
{
  "status": "Subscribed",
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

## Error codes

Error codes are 3-digit unique codes that represent logical errors the platform
means to communicate to the frontends.

## Pagination

By default, paginated endpoints return at max 10 elements of the first page.

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
