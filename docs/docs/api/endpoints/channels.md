---
title: Channels
sidebar_label: Channels
---

Refer to our [channel](getting-started/glossary.md#channel) definition
for more information.

## List

`POST /channels.list`

**Sample response**

```json5
{
  "data": [
    {
      "id": "channel-uuid-1",
      "source": "facebook",
      "source_channel_id": "fb-page-id-1",
      "metadata": {
        "name": "my page 1",
        // optional
        "image_url": "http://example.org/avatar.jpeg"
      }
    },
    {
      "id": "channel-uuid-2",
      "source": "facebook",
      "source_channel_id": "fb-page-id-2",
      "metadata": {
        "name": "my page 2"
      }
    }
  ]
}
```

## Connecting channels

### Airy Live Chat Plugin

Connects a Chat Plugin source to Airy Core.

```
POST /channels.chatplugin.connect
```

- `name` is a unique identifier of your choice

```json5
{
  "name": "website-identifier-42"
}
```

**Sample response**

```json5
{
  "id": "1F679227-76C2-4302-BB12-703B2ADB0F66",
  "source": "chat_plugin",
  "source_channel_id": "website-identifier-42",
  "metadata": {"name": "website-identifier-42"}
}
```

### Facebook

Connects a Facebook page to Airy Core.

```
POST /channels.facebook.connect
```

- `page_id` is the Facebook page id
- `page_token` is the page Access Token
- `name` Custom name for the connected page
- `image_url` Custom image URL

**Sample request**

```json5
{
  "page_id": "fb-page-id-1",
  "page_token": "authentication token",
  "name": "My custom name for this page",
  "image_url": "https://example.org/custom-image.jpg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid-1",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "metadata": {
    "name": "My custom name for this page",
    // optional
    "image_url": "https://example.org/custom-image.jpg"
  }
}
```

### Google

Connects a Google Business Account to Airy Core.

```
POST /channels.google.connect
```

- `gbm_id` The id of your Google Business Message [agent](https://developers.google.com/business-communications/business-messages/reference/business-communications/rest/v1/brands.agents#Agent).
- `name` Custom name for the connected business
- `image_url` Custom image URL

```json5
{
  "gbm_id": "gbm-id",
  "name": "My custom name for this location",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid-1",
  "metadata": {"name": "My custom name for this location", "image_url": "https://example.com/custom-image.jpg"},
  "source": "google",
  "source_channel_id": "gbm-id"
}
```

### SMS - Twilio

After you created a Twilio phone number you must [point its webhook
integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your running Airy Core instance.

Next call the Platform API:

```
POST /channels.twilio.sms.connect
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
  "metadata": {"name": "SMS for receipts", "image_url": "https://example.com/custom-image.jpg"},
  "source": "twilio.sms",
  "source_channel_id": "+491234567"
}
```

### Whatsapp - Twilio

After you created a Twilio phone number, you must [point its
webhook integration](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-java#configure-your-webhook-url)
to your Airy Core running instance.

Next call the Airy Core API for connecting channels:

```
POST /channels.twilio.whatsapp.connect
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
  "metadata": {"name": "WhatsApp Marketing", "image_url": "https://example.com/custom-image.jpg"},
  "source": "twilio.whatsapp",
  "source_channel_id": "whatsapp:+491234567"
}
```

## Disconnecting channels

import ChannelDisconnect from './channel-disconnect.mdx'

### Airy Live Chat Plugin

```
POST /channels.chatplugin.disconnect
```

<ChannelDisconnect />

### Facebook

Disconnects a Facebook page from Airy Core

```
POST /channels.facebook.disconnect
```

<ChannelDisconnect />

### Google

```
POST /channels.google.disconnect
```

<ChannelDisconnect />

### SMS - Twilio

```
POST /channels.twilio.sms.disconnect
```

<ChannelDisconnect />

### Whatsapp - Twilio

```
POST /channels.twilio.whatsapp.disconnect
```

<ChannelDisconnect />

## Exploring available channels

### Facebook

`POST /channels.facebook.explore`

A synchronous endpoint that makes a request to Facebook
to list the available Facebook pages. Some of those pages may already
be connected, which is accounted for in the boolean field `connected`. Due to
the nature of the request, the response time may vary.

**Sample request**

```json5
{
  "auth_token": "authentication token"
}
```

**Sample response**

```json5
{
  "data": [
    {
      "name": "my page 1",
      "page_id": "fb-page-id-1",
      "connected": false,
      "image_url": "http://example.org/avatar.jpeg" // optional
    },
    {
      "name": "my page 2",
      "page_id": "fb-page-id-2",
      "connected": true
    }
  ]
}
```
