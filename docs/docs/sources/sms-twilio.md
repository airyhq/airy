---
title: SMS via Twilio
sidebar_label: SMS - Twilio
---

The Twilio sms source provides a channel for sending and receiving SMS using the
[Twilio API](https://www.twilio.com/).

:::note

This document assumes that you have a Twilio account.

:::

## Configuration

import TwilioSource from './twilio-source.mdx'

<TwilioSource />

## Connect

After you created a Twilio phone number you must [point its webhook
integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your running Airy Core Platform instance.

Next call the Platform API:

```
POST /twilio.sms.connect
```

- `phone_number` The phone number as listed in your [Twilio
  dashboard](https://www.twilio.com/console/phone-numbers/). It must _not_ contain
  spaces and must include the country code.
- `name` Custom name for the connected phone number
- `image_url` Custom image URL

**Sample request**

```json5
{
  "phone_number": "+491234567",
  "name": "SMS for receipts",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid-1",
  "name": "SMS for receipts",
  "image_url": "https://example.com/custom-image.jpg",
  "source": "twilio.sms",
  "source_channel_id": "+491234567"
}
```

## Disconnect

```
POST /twilio.sms.disconnect
```

import ChannelDisconnect from './channel-disconnect.mdx'

<ChannelDisconnect />
