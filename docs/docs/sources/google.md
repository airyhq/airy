---
title: Google
sidebar_label: Google
---

The Google source provides a channel of communication between your Google
Business Location and your running instance of the Airy Core Platform.

## Configuration

First step is to copy the Google Service Account file provided by Google to
`infrastructure/airy.conf` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key

Once the verification process has been completed, Google will immediately start
sending events to your Airy Core Platform instance.

## Connecting a channel

Connects a Google Business Account to the Airy Core Platform.

```
POST /channels.connect
```

- `source` _must_ be `google`
- `source_channel_id` The id of your Google Business Message [agent](https://developers.google.com/business-communications/business-messages/reference/business-communications/rest/v1/brands.agents#Agent).
- `token` leave empty. To allow authentication you must provide a [Google service account key file](https://developers.google.com/business-communications/business-messages/guides/quickstarts/prerequisite-setup) in your runtime configuration.

```json5
{
  "source": "google",
  "source_channel_id": "gbm-id",
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
  "source": "google",
  "source_channel_id": "gbm-id"
}
```
