---
title: Webhook
sidebar_label: Webhook
---

The webhook integration enables you to programmatically participate in
conversations by sending messages or reacting to them. Here's a common
integration pattern:

- Call the [subscribe](#subscribing) endpoint
- Consume on your URL of choice [events](#event-payload)
- React to those events by calling the [send
  message](api/http.md#send-a-message) endpoint

You must de-duplicate messages on arrival as the webhook _does not_ guarantee
events uniqueness.

## Subscribing

`POST /webhooks.subscribe`

Subscribes the webhook for the first time or update its parameters.

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

```json5
{
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  },
  "status": "Subscribed",
  "api_secret": "{UUID}"
}
```

## Unsubscribing

`POST /webhooks.unsubscribe`

**Sample Response**

```json5
{
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  },
  "status": "Unsubscribed",
  "api_secret": "{UUID}"
}
```

## Info

`POST /webhooks.info`

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

## Event Payload

After [subscribing](#subscribing-to-a-webhook) to an Airy webhook, you will start receiving events on your
URL of choice. The event will _always_ be a POST request with the following
structure:

```json5
{
  "conversation_id": "4242424242",
  "id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a",
  "sender": {
    "id": "adac9220-fe7b-40a8-98e5-2fcfaf4a53b5",
    "type": "source_contact"
  },
  "source": "FACEBOOK",
  "sent_at": "2020-07-20T14:18:08.584Z",
  "text": "Message to be sent"
}
```

For possible values of `sender.type` see the [Message model documentation](glossary.md#fields)
