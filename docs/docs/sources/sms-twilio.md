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

## Connect a channel

After you created a Twilio phone number you must [point its webhook
integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your running Airy Core Platform instance.

Next call the Platform API:

```
POST /channels.connect
```

- `source` _must_ be `twilio.sms`
- `source_channel_id` The phone number as listed in your [Twilio
  dashboard](https://www.twilio.com/console/phone-numbers/). It must _not_ contain
  spaces and must include the country code.

**Sample Request**

```json5
{
  "source": "twilio.sms",
  "source_channel_id": "+491234567",
  "name": "SMS for receipts",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample Response**

```json5
{
  "id": "channel-uuid-1",
  "name": "SMS for receipts",
  "image_url": "https://example.com/custom-image.jpg",
  "source": "twilio.sms",
  "source_channel_id": "+491234567"
}
```
