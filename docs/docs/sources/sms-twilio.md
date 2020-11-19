---
title: SMS via Twilio
sidebar_label: SMS - Twilio
---

The Twilio sms source provides a channel for sending and receiving SMS using the [Twilio API](https://www.twilio.com/).

This document assumes that you have a Twilio account.

## Configuration
 
First you must create a [Twilio auth token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them),
which you then add to `infrastructure/airy.conf` like so:

```
TWILIO_AUTH_TOKEN=<YOUR AUTH TOKEN>
```

You also have to add your account sid:

```
TWILIO_SID=<YOUR ACCOUNT SID>
```

## Connecting a channel

After you have created a Twilio phone number you must [point its webhook](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url) to your
Airy Core installation.

Next call the Platform API:

```
POST /channels.connect
```

- `source` *must* be `sms.twilio`
- `source_channel_id`   The phone number as listed in your [Twilio dashboard](https://www.twilio.com/console/phone-numbers/). 
                        Must not have spaces and must include the country code. 
- `token` leave empty.

```json5
{
  "source": "sms.twilio",
  "source_channel_id": "+491234567",
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
    "source": "sms.twilio",
    "source_channel_id": "+491234567"
}
```
