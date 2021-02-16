---
title: Webhook
sidebar_label: Webhook
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Use Webhooks to receive events to notify you when a variety of interactions or events happen.

</TLDR>

The webhook integration enables you to programmatically participate in
conversations by sending messages or reacting to them. Here's a common
integration pattern:

- Call the [subscribe](#subscribing) endpoint
- Consume on your URL of choice [events](#event-payload)
- React to those events by calling the [send
  message](/api/endpoints/messages.md#send) endpoint

You must de-duplicate messages on arrival as the webhook _does not_ guarantee
events uniqueness.

## Subscribing

`POST /webhooks.subscribe`

Subscribes the webhook for the first time or update its parameters.

**Sample request**

```json5
{
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

**Sample response**

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

**Sample response**

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

**Sample response**

```json5
{
  "status": "Subscribed",
  "url": "https://my-url-to-be-hit",
  "headers": {
    "X-Custom-Header": "custom-code-for-header"
  }
}
```

## Event Payloads

After [subscribing](#subscribing) to an Airy webhook, you will
start receiving events on your URL of choice. The event will _always_ be a POST
request with one the following payloads:

import EventPayloads from "./event-payloads.mdx"

<EventPayloads />
