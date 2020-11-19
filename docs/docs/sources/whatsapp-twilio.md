---
title: Whatsapp via Twilio
sidebar_label: Whatsapp - Twilio
---

The Twilio Whatsapp source provides a channel for sending and receiving Whatsapp messages
using the [Twilio API](https://www.twilio.com/).

This document assumes that you have a Twilio account connected to [Whatsapp](https://www.twilio.com/whatsapp).

## Configuration
 
You must create a [Twilio auth token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them) and add it to `infrastructure/airy.conf` together with your account sid:



## Connecting a channel

After you created a Twilio phone number, you must [point its webhook](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url) to your Airy Core Platform running instance.

Next call the Airy Core Platform API for connecting channels:

```
POST /channels.connect
```

- `source` *must* be `whatsapp.twilio`
- `source_channel_id`   The phone number as listed in your [Twilio dashboard](https://www.twilio.com/console/phone-numbers/). 
                        Must not have spaces, must include the country code, and be prefixed by `whatsapp:` 
- `token` leave empty.

```json5
{
  "source": "whatsapp.twilio",
  "source_channel_id": "whatsapp:+491234567",
  "name": "My custom name for this location",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample Response**

```json5
{
    "id": "channel-uuid-1",
    "name": "My custom name for this location",
    "image_url": "https://example.com/custom-image.jpg",
    "source": "whatsapp.twilio",
    "source_channel_id": "whatsapp:+491234567"
}
```
