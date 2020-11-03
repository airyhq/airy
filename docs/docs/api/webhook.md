---
title: Webhook
sidebar_label: Webhook
---

## Webhook payload

After subscribing to an Airy webhook, you will start receiving events on your URL of choice.
The event will *always* be a POST request with the following structure:

```json5
{
  "conversation_id": "4242424242",
  "id": "7560bf66-d9c4-48f8-b7f1-27ab6c40a40a",
  "sender": {
    "id": "adac9220-fe7b-40a8-98e5-2fcfaf4a53b5"
  },
  "source": "FACEBOOK",
  "sent_at": "2020-07-20T14:18:08.584Z",
  "text": "Message to be sent"
}
```
