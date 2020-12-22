---
title: Google
sidebar_label: Google
---

The Google source provides a channel of communication between your Google
Business Location and your running instance of the Airy Core Platform.

:::tip What you will learn

- The required steps to configure the Google source
- How to connect a Google Business Location to the Airy core Platform

:::

## Configuration

The first step is to copy the Google Service Account file provided by Google to
`infrastructure/airy.conf` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key

Once the verification process has been completed, Google will immediately start
sending events to your Airy Core Platform instance.

## Connect

Connects a Google Business Account to the Airy Core Platform.

```
POST /google.connect
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
  "name": "My custom name for this location",
  "image_url": "https://example.com/custom-image.jpg",
  "source": "google",
  "source_channel_id": "gbm-id"
}
```

## Disconnect

```
POST /google.disconnect
```

import ChannelDisconnect from './channel-disconnect.mdx'

<ChannelDisconnect />