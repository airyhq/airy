---
title: Facebook
sidebar_label: Facebook
---

import useBaseUrl from '@docusaurus/useBaseUrl';

This document provides a step by step guide to integrate Facebook with your Airy
Core Platform instance.

:::tip What you will learn

- The required steps to configure the Facebook source
- How to connect a Facebook page to the Airy Core Platform

:::

## Configuration

The Facebook source requires the following configuration:

- An app id and an app secret so that the platform can send messages back via
  your Facebook application
- A webhook integration so that the platform can ingest messages from your
  Facebook pages
- A page token for each facebook page you intend to integrate

Let's proceed step by step.

### Find the app id and secret

To connect a page, you must have an approved Facebook app. If you don't have
one, you must to create it before proceeding. Once you are done with the
configuration, you should see something like this:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/apps.jpg')} />

Note down the `App ID` of your Facebook application and then head to the basic
settings page. Here you will find your `App Secret`:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Now you can use the app id and the app secret for the following environment variables:

- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

:::note

Refer to the [test](/guides/airy-core-in-test-env#connect-sources) guide or the [production](/guides/airy-core-in-production#connect-sources) one to set these variables in your Airy Core Platform instance.

:::

### Configure the webook integration

For Facebook to start sending events to your running instance, it must first
verify your integration with a challenge. To verify your Facebook webhook
integration, you must set the environment variable `FACEBOOK_WEBHOOK_SECRET` to
a value of your choice.

:::note

Refer to the [test](/guides/airy-core-in-test-env#connect-sources) guide or the [production](/guides/airy-core-in-production#connect-sources) one to set these variables in your Airy Core Platform instance.

:::

Then you are ready to configure the webhook integration. Head to the dashboard
of your Facebook application, find the "Webhooks" link on the left menu and then
click on "Edit subscription". You will see something like this:

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/webhook.png')} />

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core Platform instance.

### Obtain a page token

The next step is to obtain a page token, so the Airy Core Platform can send messages
on behalf of your page. The fastest way to get one is to use the graph explorer that
Facebook provides [Graph
Explorer](https://developers.facebook.com/tools/explorer/).

On the `User or Page` option, select `Get Page Token` and click on `Generate Access Token`:

<img alt="Facebook token page" src={useBaseUrl('img/sources/facebook/token.jpg')} />

You're now ready to connect a Facebook page to the Airy Core Platform 🎉.

## Connect a channel

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
