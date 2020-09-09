# Airy Core Platform API

This documents aims to offer an high-level overview of the different parts that
compose our API.

- [Introduction](#introduction)
- [Authorization](#authorization)
  - [Login via Email](#login-via-email)
  - [Login via Facebook](#login-via-facebook)
  - [Login via Token](#login-via-token)
  - [Refresh the authorization token](#refresh-the-authorization-token)
- [Endpoints](#endpoints)
  - [Conversations](#conversations)
    - [List by organization id](#list-by-organization-id)
    - [Conversation by id](#conversation-by-id)
    - [Change conversation state](#change-conversation-state)
    - [Mark all conversations as done](#mark-all-conversations-as-done)
    - [Is conversation blocked](#is-conversation-blocked)
    - [Mark all conversations as read](#mark-all-conversations-as-read)
    - [Get conversation count by channel](#get-conversation-count-by-channel)
  - [Messages](#messages)
    - [Messages of a conversation](#messages-of-a-conversation)
    - [Send a message](#send-a-message)
    - [Send template message](#send-template-message)
  - [Tags](#tags)
    - [Creating a tag](#creating-a-tag)
    - [Deleting a tag](#deleting-a-tag)
    - [Updating a tag](#updating-a-tag)
    - [Getting tags](#getting-tags)
    - [Adding tag](#adding-tag)
    - [Removing tag](#removing-tag)
  - [Contact Info](#contact-info)
    - [Assigning info to a contact](#assigning-info-to-a-contact)
    - [Updating info of a contact](#updating-info-of-a-contact)
    - [Deleting info of a contact](#deleting-info-of-a-contact)
    - [Getting info of a contact](#getting-info-of-a-contact)
  - [Channels](#channels)
    - [Connecting Channels](#connecting-channels)
    - [Disconnecting Channels](#disconnecting-channels)
    - [List Available Channels](#list-available-channels)
    - [List Connected Channels](#list-connected-channels)
  - [Teams](#teams)
    - [Getting teams](#getting-teams)
    - [Creating a team](#creating-a-team)
    - [Updating a team](#updating-a-team)
    - [Adding users to a team](#adding-users-to-a-team)
    - [Remove users from a team](#remove-users-from-a-team)
    - [Fetching a team](#fetching-a-team)
    - [Deleting a team](#deleting-a-team)
  - [Webhooks](#webhooks)
    - [Subscribing to a webhook](#subscribing-to-a-webhook)
    - [Unsubscribing to a webhook](#unsubscribing-to-a-webhook)
    - [Get webhook](#get-webhook)
- [Error codes](#error-codes)
- [Pagination](#pagination)

## Introduction

Our HTTP endpoints adhere to the following conventions:

- Endpoints only accept `POST` JSON requests.
- With the exception of the `/login` and `/signup` endpoints, communication
  always requires a valid [JWT token](#authorization).
- There are no nested URLs (eg there are no `/thing/:id/:otherthing`)
- `4xx` responses always use a machine [error code](/#error-codes).

These constraints aim to simplify the eventual migration of our API to a GraphQL
schema, as a bonus we avoid complicated URL builders in the frontends.

## Authorization

In order to communicate with our API endpoints, you need a valid
[JWT](https://jwt.io/) token. There are currently two ways of obtaining a valid
token:

- [login via email](#login-via-email)
- [login via facebook](#login-via-facebook)

Both endpoints return the same data and give you access to two tokens:

- a short lived JWT token you can use for API requests
- a refresh token you can use to generate a new JWT token if it is no longer
  valid. Only store the refresh token and use it to generate the short lived
  token.

### Login via Email

As the purpose of this endpoint is to obtain valid JWT tokens, this endpoint
does not require a valid token to be present in the headers.

`POST /login-via-email`

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
  "organizations": [
    {
      "id": "42",
      "name": "Example Organization",
      "role": "AWESOME_DOGGO",
    }
  ],
  "memberships": [
    {
      "organization_id": "42",
      "role": "MEMBER",
    }
  ],
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

### Login via Facebook

As the purpose of this endpoint is to obtain valid JWT tokens, this endpoint
does not require a valid token to be present in the headers.

`POST /login-via-facebook`

Example Body:

```json
{ "user_access_token": "12345", "user_id": "1231231" }
```

**Required**:

- `user_access_token` String
- `user_id` String

Example response:

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "avatar_url": "http://example.com/avatar.png",
  "organizations": [
    {
      "id": "42",
      "name": "Example Organization",
    }
  ],
  "memberships": [
    {
      "organization_id": "42",
      "role": "MEMBER",
    }
  ],
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

### Login via Token

Use this endpoint when you already have a token, but you need to fetch information about the logged user.
A new token will be in the response

`POST /login-via-token`

Example Body:

```json
{ "token": "JWT-TOKEN" }
```

**Required**:

- `token` String

Example response:

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "avatar_url": "http://example.com/avatar.png",
  "organizations": [
    {
      "id": "42",
      "name": "Example Organization",
    }
  ],
  "memberships": [
    {
      "organization_id": "42",
      "role": "MEMBER",
    }
  ],
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

### Refresh the authorization token

`POST /refresh-token`

Example Body:

```json
{ "token": "JWT_REFRESH_TOKEN" }
```

**Required**:

- `token` String

Example response:

```json
{
  "first_name": "Grace",
  "last_name": "Hopper",
  "avatar_url": "http://example.com/avatar.png",
  "organizations": [
    {
      "id": "42",
      "name": "Example Organization"
    }
  ],
  "token": "JWT_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

## Endpoints

As there is no nesting, we group endpoints only logically. The idea is to focus
on the feature set endpoints enable. The grouping reflects the high level
entities of the [Airy Data Model](/docs/data-model.md).

### Conversations

Please refer to our [conversation](/docs/data-model.md#conversation) definition for more
information.

#### List by organization id

`POST /conversations`

This is a [paginated](#pagination) endpoint.

Example body:

```json
{
  "organization_id": "4242-4242-4242-424242",
  "filter": {
    "contact_id": "contact-42",
    "contact_ids": ["contact-42"],
    "fb_page_ids": ["page42"],
    "channel_ids": ["channel-42"],
    "contact_tags": ["contact_id"],
    "display_name": "Grace Hopper",
    "display_names": ["Grace Hopper"],
    "min_unread_message_count": 24,
    "max_unread_message_count": 42,
    "state": "OPEN"
  },
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Required**:

- `organization_id` UUID

**Optional**:

- `filter` Object
  - `contact_id` String (DEPRECATED. Please use `contact_ids`)
  - `contact_ids` List of String
  - `fb_page_ids` List of Facebook Page Ids (DEPRECATED. Please use `channel_ids`)
  - `channel_ids` List of channel ids (UUID)
  - `contact_tags` List of String
  - `display_name` String (DEPRECATED. Please use `display_names`)
  - `display_names` List of String
  - `min_unread_message_count` Integer
  - `max_unread_message_count` Integer
  - `state` String
- `cursor` UUID
- `page_size` Integer

Example Response:

```
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "state": "OPEN",
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
        "tags": null
      },
      "last_message": {
        "display_text": "Welcome to Airy Messenger - I’m Mathias and I’m here to help.",
        "media_type": "text/fb-template",
        "id": "1e7674d7-b575-4683-8a77-d2651b9e3149-relayed",
        "sent_at": "2019-01-07T09:01:44.000Z"
      },
      "message": {
        "id": "{UUID}",
        //unique message id
        "text": "{String}",
        //textual message content
        "metadata": "{String}",
        //message correlation id, for matching to the locally rendered message on the device that generated the message originally
        "attachments": [
          //list of attachments
          {
            "type": "{string/enum}",
            //the type of attachments [IMAGE, VIDEO, AUDIO, FB_TEMPLATE, LINK, FILE]
            "url": "{String}",
            //a field related to order receipts
            "title: "{String}",
            //a field related to order receipts
            payload: {
              url: "{string}",
              //present in case the type is IMAGE, VIDEO, AUDIO, LINK, or FILE
              title: "{string}",
              //present in case the type is LINK or TEMPLATE
              subtitle: "{string}",
              //present in case type is TEMPLATE
              template_type: "{string}",
              //present in case of TEMPLATE
              receipient_name: {"String"},
              //a field related to order receipts
              merchant_name: {"String"},
              //a field related to order receipts
              order_number: {"String"},
              //a field related to order receipts
              currency: {"String"},
              //a field related to order receipts
              timestamp: {"String"},
              //a field related to order receipts
              payment_method: {"String"},
              //a field related to order receipts
              order_url: {"String"},
              //a field related to order receipts
              summary: {
                total_cost: {long},
                //a field related to order receipts
                total_tax: {long},
                //a field related to order receipts
                subtotal: {long},
                //a field related to order receipts
                shipping_cost: {long},
                //a field related to order receipts
              },
              elements: [
                {
                  title: "{string}",
                  subtitle: "{string}",
                  image_url: "{string}",
                  default_action_url: "{string}",
                  buttons: [
                    {
                      type: "{string}"
                      //[URL, POSTBACK, SHARE, BUY, CALL
                    }
                  ]
                }
              ]
            }
          }
        ],
        offset: "{number}",
        //represents the chronological ordering of messages in a conversation,
        sender: {
          avatar_url: "{string}",
          //url to the sender’s avatar
          first_name: "{string}",
          //sender’s first name
          last_name: "{string}",
          //sender’s last name
          id: "{UUID}",
          //sender’s member id
          tags: [
            {
              id: "{UUID}",
              //tag id
              name: "{String}",
              //tag name (display value)
              color: "{TagColor}"
              //tag-blue, tag-red, tag-green, tag-purple
            }
          ]
        },
        alignment: "{string/enum}",
        //LEFT, RIGHT, CENTER - horizontal placement of message
        sent_at: "{string}"
        //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
        preview: {
            display_text: "{String}",
            //calculated field, extracts the preview text to display for any type of content type
            content_type:  "{String}",
            //content type of the message
        }
      }
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
  "state": "OPEN",
  "channel": {
    "name": "AIRY",
    "id": "318efa04-7cc1-4200-988e-50699d0dd6e3"
  },
  "created_at": "2019-01-07T09:01:44.000Z",
  "contact": {
    "avatar_url": "https://example.com/profile.jpg",
    "first_name": "Grace",
    "last_name": "Hopper",
    "id": "36d07b7b-e242-4612-a82c-76832cfd1026",
    "tags": null
  },
  "last_message": {
    "display_text": "The answer is 42",
    "media_type": "text/plain",
    "id": "1e7674d7-b575-4683-8a77-d2651b9e3149",
    "sent_at": "2019-01-07T09:01:44.000Z"
  },
  message: {
    id: "{UUID}",
    //unique message id
    text: "{String}",
    //textual message content
    metadata: "{String}",
    //message correlation id, for matching to the locally rendered message on the device that generated the message originally
    attachments: [
      //list of attachments
      {
        type: "{string/enum}",
        //the type of attachments [IMAGE, VIDEO, AUDIO, FB_TEMPLATE, LINK, FILE]
        url: "{String}",
        //a field related to order receipts
        title: "{String}",
        //a field related to order receipts
        payload: {
          url: "{string}",
          //present in case the type is IMAGE, VIDEO, AUDIO, LINK, or FILE
          title: "{string}",
          //present in case the type is LINK or TEMPLATE
          subtitle: "{string}",
          //present in case type is TEMPLATE
          template_type: "{string}",
          //present in case of TEMPLATE
          receipient_name: {"String"},
          //a field related to order receipts
          merchant_name: {"String"},
          //a field related to order receipts
          order_number: {"String"},
          //a field related to order receipts
          currency: {"String"},
          //a field related to order receipts
          timestamp: {"String"},
          //a field related to order receipts
          payment_method: {"String"},
          //a field related to order receipts
          order_url: {"String"},
          //a field related to order receipts
          summary: {
          	total_cost: {long},
          	//a field related to order receipts
          	total_tax: {long},
          	//a field related to order receipts
          	subtotal: {long},
          	//a field related to order receipts
          	shipping_cost: {long},
          	//a field related to order receipts
          },
          elements: [
            {
              title: "{string}",
              subtitle: "{string}",
              image_url: "{string}",
              default_action_url: "{string}",
              buttons: [
                {
                  type: "{string}"
                  //[URL, POSTBACK, SHARE, BUY, CALL
                }
              ]
            }
          ]
        }
      }
    ],
    offset: "{number}",
    //represents the chronological ordering of messages in a conversation,
    sender: {
      avatar_url: "{string}",
      //url to the sender’s avatar
      first_name: "{string}",
      //sender’s first name
      last_name: "{string}",
      //sender’s last name
      id: "{UUID}",
      //sender’s member id
      tags: [
        {
          id: "{UUID}",
          //tag id
          name: "{String}",
          //tag name (display value)
          color: "{TagColor}"
          //tag-blue, tag-red, tag-green, tag-purple
        }
      ]
    },
    alignment: "{string/enum}",
    //LEFT, RIGHT, CENTER - horizontal placement of message
    sent_at: "{string}"
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
    preview: {
        display_text: "{String}",
        //calculated field, extracts the preview text to display for any type of content type
        content_type:  "{String}",
       	//content type of the message
    }
  }
  "unread_message_count": 1
}
```

#### Change conversation state

`POST /change-conversation-state`

Example body:

```json
{
  "conversation_id": "4242-4242-4242-424242",
  "state": "CLOSED"
}
```

**Required**:

- `conversation_id` UUID
- `state` String enum ["OPEN", "CLOSED"]

The endpoint returns `200` **only** if the state change was successfully recorded.

#### Mark all conversations as done

Will mark all conversations from a specific organization to be have the DONE state.

`POST /mark-all-conversations-as-done`

Example body:

```json
{
  "organization_id": "4242-4242-4242-424242",
}
```

**Required**:

- `organization_id` UUID

The endpoint returns `200` **only** if all the conversations were marked as done.

#### Is conversation blocked

`POST /is-conversation-blocked`

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
  "blocked": true | false
}
```

This endpoint will always return status *200* and `blocked` will be true
if the conversation is blocked, meaning the last message was sent over 7 days ago.


#### Mark all conversations as read

`POST /mark-all-conversations-as-read`

Marks all the conversations in a given organization as read.

Example body:

```json
{
  "organization_id": "4242-4242-4242-424242"
}
```

**Required**:

- `organization_id` UUID


#### Get conversation count by channel

`POST /conversation-stats`
Example body:
```json
{
  "organization_id": "4242-4242-4242-424242"
}
```
**Required**:
- `organization_id` UUID

The response contains three lists "totals_by_day", "totals_by_channel" and "totals_by_cumulative_channel" where each item contains a date field and the lists are ordered by it. Dates without data are not in the list.

Example Response:

```
{
   "totals_by_day":[
      {
         "date":"2020-09-17",
         "value":"1"
      },
      {
         "date":"2020-09-22",
         "value":"3"
      },
      {
         "date":"2020-09-23",
         "value":"1"
      }
   ],
   "totals_by_channel":[
      {
         "date":"2020-09-17",
         "channel-one":"0",
         "channel-two":"1"
      },
      {
         "date":"2020-09-22",
         "channel-one":"0",
         "channel-two":"3"
      },
      {
         "date":"2020-09-23",
         "channel-one":"0",
         "channel-two":"1"
      }
   ],
   "totals_by_cumulative_channel":[
      {
         "date":"2020-09-17",
         "channel-one":"0",
         "channel-two":"1"
      },
      {
         "date":"2020-09-22",
         "channel-one":"0",
         "channel-two":"4"
      },
      {
         "date":"2020-09-23",
         "channel-one":"0",
         "channel-two":"5"
      }
   ]
}
```

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

```
{
  "data": [
    {
        id: "{UUID}",
        //unique message id
        text: "{String}",
        //textual message content
        metadata: "{String}",
        //message correlation id, for matching to the locally rendered message on the device that generated the message originally
        attachments: [
          //list of attachments
          {
            type: "{string/enum}",
            //the type of attachments [IMAGE, VIDEO, AUDIO, FB_TEMPLATE, LINK, FILE]
            url: "{String}",
            //a field related to order receipts
            title: "{String}",
            //a field related to order receipts
            payload: {
              url: "{string}",
              //present in case the type is IMAGE, VIDEO, AUDIO, LINK, or FILE
              title: "{string}",
              //present in case the type is LINK or TEMPLATE
              subtitle: "{string}",
              //present in case type is TEMPLATE
              template_type: "{string}",
              //present in case of TEMPLATE
              receipient_name: {"String"},
              //a field related to order receipts
              merchant_name: {"String"},
              //a field related to order receipts
              order_number: {"String"},
              //a field related to order receipts
              currency: {"String"},
              //a field related to order receipts
              timestamp: {"String"},
              //a field related to order receipts
              payment_method: {"String"},
              //a field related to order receipts
              order_url: {"String"},
              //a field related to order receipts
              summary: {
                total_cost: {long},
                //a field related to order receipts
                total_tax: {long},
                //a field related to order receipts
                subtotal: {long},
                //a field related to order receipts
                shipping_cost: {long},
                //a field related to order receipts
              },
              elements: [
                {
                  title: "{string}",
                  subtitle: "{string}",
                  image_url: "{string}",
                  default_action_url: "{string}",
                  buttons: [
                    {
                      type: "{string}"
                      //[URL, POSTBACK, SHARE, BUY, CALL
                    }
                  ]
                }
              ]
            }
          }
        ],
        offset: "{number}",
        //represents the chronological ordering of messages in a conversation,
        sender: {
          avatar_url: "{string}",
          //url to the sender’s avatar
          first_name: "{string}",
          //sender’s first name
          last_name: "{string}",
          //sender’s last name
          id: "{UUID}",
          //sender’s member id
          tags: [
            {
              id: "{UUID}",
              //tag id
              name: "{String}",
              //tag name (display value)
              color: "{TagColor}"
              //tag-blue, tag-red, tag-green, tag-purple
            }
          ]
        },
        alignment: "{string/enum}",
        //LEFT, RIGHT, CENTER - horizontal placement of message
        sent_at: "{string}"
        //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
        preview: {
            display_text: "{String}",
            //calculated field, extracts the preview text to display for any type of content type
            content_type:  "{String}",
            //content type of the message
        }
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
    text: "{String}",
    attachments: [
      {
        type: "{string/enum}", // One of [IMAGE, VIDEO, AUDIO, FB_TEMPLATE, LINK, FILE]
        payload: {
          url: "{string}", // Required if type is one of [IMAGE, VIDEO, AUDIO, LINK, FILE]
          title: "{string}", // Required if type is LINK or TEMPLATE
          subtitle: "{string}", // Required if type is TEMPLATE
          template_type: "{string}", // Required if type is TEMPLATE
          elements: [
            {
              title: "{string}",
              subtitle: "{string}",
              image_url: "{string}",
              default_action_url: "{string}",
              buttons: [
                {
                  type: "{string}"
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

Example response:

```json
{
    "message_id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a"
}
```

#### Send template message

`POST /send-template-message`

Returns the id that the message will be persisted with in the backend. Combined with the websocket [queue for message upserts](websocket.md#userqueueairymessageupsert) (/user/queue/airy/message/upsert) you can use this id to verify that a message has been delivered.


**Required**:

- `conversation_id` UUID
- `template_id` UUID

**Optional**:
- `variables` Object
- `metadata`: String

Example payload:

```json5
{
  conversation_id: "4242424242",
  template_id: "232323223",
  variables: {
    var1: "value1"
  },
  metadata: "XXX123"
}
```

Example response:

```json
{
    "message_id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a"
}
```

#### Contacts List

`POST /contacts`

This is a [paginated](#pagination) endpoint, which supports (optional) filtering.

Example payload:

```json5
{
  "organization_id": "org-uuid",
  "filter": { // optional
    "info_values": [
      {
        "key": "likes_dogs",
        "value": "yes"
      }
    ]
  }
}
```

Example response:

```json
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "first_name": "Grace",
      "last_name": "Hopper",
      "avatar_url": "http://example.com/avatar.png",
      "tags": ["7b66e3d9-ff68-4c12-8588-8950dee1eb32"],
      "info": {
        "likes_dogs": "yes",
        "phone": "123456"
      }
    }
  ],
  "response_metadata": {
    "previous_cursor": "",
    "next_cursor": "",
    "total": 1
  }
}
```

#### Rename Contact

`POST /rename-contact`

This is an async endpoint for renaming contacts.  Despite producing a renamed
contact into kafka in a synchronous manner, it is considered async due to the
latency of propagating the change into the relevant tables across the
platform.

The endpoing takes the `name` field from the payload, splits it based on the
`space` char and set the first token as the first name, and the remaining
tokens as the last name.  In the example payload below, we'd end up with a
contact that has "Michael" as first name, and "Jeffrey Jordan" as last name.

Example payload:

```json5
{
  "organization_id": "org-uuid",
  "contact_id": "some-contact-uuid",
  "name": "Michael Jeffrey Jordan"
}
```

Example response: (201)

```json
{}
```

### Tags

The following endpoints enable adding and removing tags on a contact level.
Adding and removing tags is an async action, so the response is always empty.

#### Creating a tag

First we need to create a tag on an organization.

`POST /create-tag`

Example body:

```json
{
  "organization_id": "org-uuid",
  "name": "Urgent",
  "color": "tag-red"
}
```

**Required**:

- `organization_id`: UUID
- `name`: String
- `color`: tag-red | tag-blue | tag-green | tag-purple

If the tag is successfully created the endpoint will return `201` (created) with the tag id in the response body.

Example response:

```json5
{
  id: "TAG-UUID"
}
```

#### Deleting a tag

Deleting a tag on an organization level

`POST /delete-tag`

```json
{
  "organization_id": "org-uuid",
  "id": "ID-OF-THE-TAG"
}
```

**Required**:

- `organization_id`: UUID
- `tag_id`: UUID

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
  "organization_id": "org-uuid",
  "id": "TAG-ID",
  "name": "Urgent",
  "color": "tag-blue"
}
```

**Required**:

- `organization_id`: UUID
- `id`: UUID
- `name`: String
- `color`: tag-red | tag-blue | tag-green | tag-purple

Since this is an async action, the endpoint returns `202` (accepted). The
response is always an empty JSON.

Example response:

```json5
{}
```

#### Getting tags

`POST /organization-tags`

```json
{
  "organization_id": "org-uuid"
}
```

**Required**:

- `organization_id`: UUID

Example response:

```json5
{
  tags: [
    {
      id: "TAG-ID",
      organization_id: "org-id",
      name: "name of the tag",
      color: "RED"
    }
  ]
}
```

#### Adding tag

This endpoint adds an existing tag (from an organization)

`POST /add-tag`

Example body:

```json5
{
  contact_id: "424242424242",
  organization_id: "org-uuid",
  tag_id: "uuid-of-the-tag"
}
```

**Required**:

- `contact_id` String
- `organization_id` UUID
- `tag_id` UUID

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
  contact_id: "424242424242",
  organization_id: "org-uuid",
  tag_id: "tag-uuid"
}
```

**Required**:

- `contact_id` String
- `organization_id` UUID
- `tag_id` UUID

Since this is an async action, the endpoint returns `202` HTTP status code (accepted).
The response is always an empty JSON.

Example response:

```json5
{}
```

### Channels

#### Connecting Channels

`POST /connect-channels`

Async endpoint for connecting channels to an organization.  It submits one or
more `ChannelConnectRequest` records to be handled by a source specific
`ChannelConnector`.  The endoint responds with a map of external channel ids
(supplied in the endpoint's payload), and their generated Airy channel ids.
The Airy channel ids are used to await connection confirmation over websocket
(see websocket.md)

**Sample Request**

```json5
{
  "organization_id": "org-UUID",
  "source": "FACEBOOK",
  "external_channel_ids": ["fb-page-id-1", "fb-page-id-2"],
  "token": "FB_TOKEN",
  "name": "My custom name for this page", // optional
  "image_url": "http://aws.com/jeff.jpg" // optional
}
```

**Required**

- `organization_id`: UUID
- `source`: FACEBOOK | GOOGLE | SMS_TWILIO | WHATSAPP_TWILIO
- `external_channel_ids`: list of external channel ids to connect.  In the case of FACEBOOK, this is a list of page ids.

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

Async endpoint for disconnecting channels from an organization.  It submits
one or more `ChannelDisConnectRequest` records to be handled by a source
specific `ChannelConnector`.  The endpoint has  no response, but the Airy
channel ids can be used to await disconnection confirmation over websocket
(see websocket.md)

**Sample Request**

```json5
{
  "organization_id": "org-UUID",
  "source": "FACEBOOK",
  "external_channel_ids": ["external-channel-id-1", "external-channel-id-2"]
}
```

**Required**

- `organization_id`: UUID
- `source`: FACEBOOK
- `token` : security token for fetching the available channels directly from the source



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
response also specifies, per channel, whether or not it is connected to the
given organization.

**Sample Request**

```json5
{
  "organization_id": "org-UUID",
  "source": "FACEBOOK",
  "token": "some-token"
}
```

**Required**

- `organization_id`: UUID
- `source`: FACEBOOK
- `channel_ids` : list of airy channel ids to disconnect

**Sample Response**

```json5
{
	"available_channels_request_id": "some-uuid"
}
```


#### List Connected Channels

`POST /connected-channels`

Endoint for listing all channels connected to a given organization.

**Sample Request**

```json5
{
  "organization_id": "org-UUID"
}
```

**Required**

- `organization_id`: UUID

**Sample Response**

```json5
{
	"channels": [
		{
			"id": "channel-uuid-1",
			"name": "my page 1",
			"source": "FACEBOOK",
			"organization_id": "org-uuid",
			"external_channel_id": "fb-page-id-1"
		},
		{
			"id": "channel-uuid-2",
			"name": "my page 2",
			"source": "FACEBOOK",
			"organization_id": "org-uuid",
			"external_channel_id": "fb-page-id-2"
		}
	]
}
```

### Teams

A team is a collection of filters.

#### Getting teams

`POST /teams`

**Sample Request**

```json5
{
  "organization_id": "ORG ID"
}
```

**Required**

- `organization_id`: UUID

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
    "organization_id": "org_id",
    "name": "TEAM NAME",
    "query": {
        "contact_ids": ["cid1", "cid2"], //for a team that only receive conversations of cid1 and cid2,
        "channel_ids": ["channel1", "channel2"], //for a team that only receives conversations written to channel1 and channel 2
        "display_names": ["Kobi", "Thomas"], //for a team that only receives conversations with Kobi or Thomas
        "min_unread_message_count": 1, //for a team that only receives conversations with at least 1 unread message
        "max_unread_message_count": 5, //for a team that only receives conversations with at most 5 unread messages
        "state": "OPEN", //for a team that only receives conversations in state OPEN
        "contact_tag_ids": ["tag1", "tag2"], //for a team that only receives conversation with contacts tagged with tag1 and tag2
    },
    "member_ids": ["user id 1", "user id 2"]
}
```

**Required**

- `organization_id`: UUID
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
  - `state`: String
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
    "organization_id": "org_id",
    "name": "TEAM NAME",
    "query": {
        "contact_ids": ["cid1", "cid2"], //for a team that only receive conversations of cid1 and cid2,
        "channel_ids": ["channel1", "channel2"], //for a team that only receives conversations written to channel1 and channel 2
        "display_names": ["Kobi", "Thomas"], //for a team that only receives conversations with Kobi or Thomas
        "min_unread_message_count": 1, //for a team that only receives conversations with at least 1 unread message
        "max_unread_message_count": 5, //for a team that only receives conversations with at most 5 unread messages
        "state": "OPEN", //for a team that only receives conversations in state OPEN
        "contact_tag_ids": ["tag1", "tag2"], //for a team that only receives conversation with contacts tagged with tag1 and tag2
    }
}
```

**Required**

- `team_id`: UUID of the team
- `organization_id`: UUID
- `name`: String
- `query`:
  - `channel_ids`: List of UUIDs. Needs to have AT LEAST one channel id.

**Optional**
- `query`:
  - `contact_ids`: List of UUIDs
  - `display_names`: List of String
  - `min_unread_message_count`: Integer
  - `max_unread_message_count`: Integer
  - `state`: String
  - `contact_tag_ids`: List of String

#### Adding users to a team

`POST /add-users-to-team`

**Sample Request**

```json5
{
    "organization_id": "org_id",
    "team_id": "team_id",
    "user_ids": ["user1", "user2"]
}
```

**Required**

- `organization_id`: UUID
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
    "organization_id": "org_id",
    "team_id": "team_id",
    "user_ids": ["user1", "user2"]
}
```

**Required**

- `organization_id`: UUID
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
  "organization_id": "ORG ID",
  "team_id": "TEAM ID"
}
```

**Required**

- `organization_id`: UUID
- `team_id`: UUID

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
    "state": "OPEN",
    "contact_tag_ids": ["tag1", "tag2"],
  }
}
```
#### Deleting a team

`POST /delete-team`

**Sample Request**
```json5
{
  "organization_id": "ORG ID",
  "team_id": "TEAM ID"
}
```

**Required**

- `organization_id`: UUID
- `team_id`: UUID

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
  "organization_id": "org-id",
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

**Sample Request**

```json5
{
  "organization_id": "org-id"
}
```

**Response**

This endpoints returns 200 and an empty body.

#### Get webhook

`POST /webhook`

**Sample Request**

```json5
{
  "organization_id": "org-id"
}
```

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
