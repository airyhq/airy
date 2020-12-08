---
title: Whatsapp via Twilio
sidebar_label: Whatsapp - Twilio
---

The Twilio Whatsapp source provides a channel for sending and receiving Whatsapp
messages using the [Twilio API](https://www.twilio.com/).

This document assumes that you have a Twilio account connected to
[Whatsapp](https://www.twilio.com/whatsapp).

## Configuration

import TwilioSource from './twilio-source.mdx'

<TwilioSource />

## Connecting a channel

After you created a Twilio phone number, you must [point its
webhook integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your Airy Core Platform running instance.

Next call the Airy Core Platform API for connecting channels:

```
POST /channels.connect
```

- `source` _must_ be `twilio.whatsapp`
- `source_channel_id` The phone number as listed in your [Twilio
  dashboard](https://www.twilio.com/console/phone-numbers/).
  It must _not_ have spaces, must include the country
  code, and be prefixed by `whatsapp:`

**Sample Request**

```json5
{
  "source": "twilio.whatsapp",
  "source_channel_id": "whatsapp:+491234567",
  "name": "Whatsapp Marketing",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample Response**

```json5
{
  "id": "channel-uuid-1",
  "name": "Whatsapp Marketing",
  "image_url": "https://example.com/custom-image.jpg",
  "source": "twilio.whatsapp",
  "source_channel_id": "whatsapp:+491234567"
}
```
