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

Update a channel's name or image URL.

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

import ConnectChatPlugin from './connect-chatPlugin.mdx'

<ConnectChatPlugin />

### Facebook

import ConnectFacebook from './connect-facebook.mdx'

<ConnectFacebook />

### Instagram

import ConnectInstagram from './connect-instagram.mdx'

<ConnectInstagram />

### Google

import ConnectGoogle from './connect-google.mdx'

<ConnectGoogle />

### SMS

import ConnectSMSTwilio from './connect-twilioSms.mdx'

<ConnectSMSTwilio />

### Whatsapp

import ConnectWhatsappTwilio from './connect-twilioWhatsApp.mdx'

<ConnectWhatsappTwilio />

## Disconnecting channels

import ChannelDisconnect from './channel-disconnect.mdx'

### Airy Live Chat Plugin

```
POST /channels.chatplugin.disconnect
```

<ChannelDisconnect />

### Facebook

Disconnects a Facebook page from Airy Core.

```
POST /channels.facebook.disconnect
```

<ChannelDisconnect />

### Instagram

Disconnects an instagram account from Airy Core.

```
POST /channels.instagram.disconnect
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
