---
title: Facebook
sidebar_label: Facebook
---

The Facebook source provides a channel of communication between a Facebook page and your running instance of the Airy Core Platform.

## Configuration

For Facebook to start sending events to your local instance, it must first
verify your instance with a challenge. To verify your Facebook webhook
integration, you must set the environment variable `FACEBOOK_WEBHOOK_SECRET` to
the same value you supply in the webhook configuration on the Facebook
integration.

You must also configure the webhook URL to `https://<your-address-url>/facebook`.

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core Platform instance.

## Connecting a channel

Connects a Facebook page to the Airy Core Platform.

```
POST /channels.connect
```

- `source` _must_ be `facebook`
- `source_channel_id` is the Facebook page id
- `token` is the page Access Token

```json5
{
  "source": "facebook",
  "source_channel_id": "fb-page-id-1",
  "token": "authentication token",
  "name": "My custom name for this page", // optional
  "image_url": "https://example.org/custom-image.jpg" // optional
}
```

**Sample Response**

```json5
{
  "id": "channel-uuid-1",
  "name": "My custom name for this page",
  "image_url": "https://example.org/custom-image.jpg", // optional
  "source": "facebook",
  "source_channel_id": "fb-page-id-1"
}
```
