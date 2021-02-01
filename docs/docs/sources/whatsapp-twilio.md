---
title: WhatsApp via Twilio
sidebar_label: WhatsApp Business API
---

The Twilio WhatsApp source provides a channel for sending and receiving WhatsApp
messages using the [Twilio API](https://www.twilio.com/).

:::note

This document assumes that you have a Twilio account connected to
[WhatsApp](https://www.twilio.com/whatsapp).

:::

## Configuration

import TwilioSource from './twilio-source.mdx'

<TwilioSource />

## Connect a channel

After you created a Twilio phone number, you must [point its
webhook integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your Airy Core running instance.

Next call the Airy Core API for connecting channels:

```
POST /twilio.whatsapp.connect
```

- `phone_number` The phone number as listed in your [Twilio
  dashboard](https://www.twilio.com/console/phone-numbers/).
  It must _not_ have spaces and must include the country
  code.
- `name` Custom name for the connected phone number
- `image_url` Custom image URL

**Sample request**

```json5
{
  "phone_number": "+491234567",
  "name": "WhatsApp Marketing",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid-1",
  "name": "WhatsApp Marketing",
  "image_url": "https://example.com/custom-image.jpg",
  "source": "twilio.whatsapp",
  "source_channel_id": "whatsapp:+491234567"
}
```

## Disconnect

```
POST /twilio.whatsapp.disconnect
```

import ChannelDisconnect from './channel-disconnect.mdx'

<ChannelDisconnect />
