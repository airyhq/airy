---
title: Channels
sidebar_label: Channels
---

Refer to our [channel](getting-started/glossary.md#channel) definition
for more information.

## List

`POST /channels.list`

**Sample request**

```json5
{
  "source": "source to filter on" // optional
}
```

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
      },
      "connected": true
    },
    {
      "id": "channel-uuid-2",
      "source": "facebook",
      "source_channel_id": "fb-page-id-2",
      "metadata": {
        "name": "my page 2"
      },
      "connected": true
    }
  ]
}
```

## Info

`POST /channels.info`

**Sample request**

```json5
{
  "channel_id": "channel-uuid"
}
```

**Sample response**

```json5
{
  "id": "channel-uuid",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "metadata": {
    "name": "my page 1",
    // optional
    "image_url": "http://example.org/avatar.jpeg"
  },
  "connected": true
}
```

## Update

`POST /channels.update`

Update a channel's name or image url.

**Sample request**

```json5
{
  "channel_id": "channel-uuid",
  "name": "new name for this channel", // optional
  "image_url": "http://example.org/avatar_redesign.jpeg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "metadata": {
    "name": "new name for this channel",
    "image_url": "http://example.org/avatar_redesign.jpeg"
  },
  "connected": true
}
```

## Connecting channels

### Airy Live Chat Plugin

Connects a Chat Plugin source to Airy Core.\_\_

```
POST /channels.chatplugin.connect
```

- `name` is a unique identifier of your choice

```json5
{
  "name": "website-identifier-42",
  "image_url": "http://example.org/plugin_icon.jpeg" // optional
}
```

**Sample response**

```json5
{
  "id": "1F679227-76C2-4302-BB12-703B2ADB0F66",
  "source": "chat_plugin",
  "source_channel_id": "website-identifier-42",
  "metadata": {
    "name": "website-identifier-42",
    "image_url": "http://example.org/plugin_icon.jpeg" // optional
  },
  "connected": true
}
```

### Facebook

import ConnectFacebook from './connect-facebook.mdx'

<ConnectFacebook />

### Google

import ConnectGoogle from './connect-google.mdx'

<ConnectGoogle />

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
  "source_channel_id": "+491234567",
  "connected": true
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
  "source_channel_id": "whatsapp:+491234567",
  "connected": true
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
