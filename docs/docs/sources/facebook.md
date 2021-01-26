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

### Configure the webhook integration

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

## Connect

Connects a Facebook page to the Airy Core Platform.

```
POST /facebook.connect
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
  "name": "My custom name for this page",
  "image_url": "https://example.org/custom-image.jpg",
  "source": "facebook",
  "source_channel_id": "fb-page-id-1"
}
```

## Disconnect

Disconnects a Facebook page from the Airy Core Platform

```
POST /facebook.disconnect
```

import ChannelDisconnect from './channel-disconnect.mdx'

<ChannelDisconnect />

## Explore

`POST /facebook.explore`

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

## Send a template message

With Facebook messenger you can send [templates](https://developers.facebook.com/docs/messenger-platform/send-messages/templates) to your contacts,
which is useful for automations, FAQs, receipts and many more use cases. To send Facebook templates using the [send message API](/api/http.md#send-a-message) you have to
first build an attachment for Facebook using their template model. Quoting from the docs:

> The body of the request follows a standard format for all template types, with the `message.attachment.payload` property containing the type and content details that are specific to each template type:
>
> ```json5
> {
>   "recipient": {
>     "id": "<PSID>"
>   },
>   "message": {
>     "attachment": {
>       "type": "template",
>       "payload": {
>         "template_type": "<TEMPLATE_TYPE>"
>         // ...
>       }
>     }
>   }
> }
> ```

Next take the `message.attachment.payload` field and add it to the `message` field on the API request like so:

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "payload": {
      "template_type": "<TEMPLATE_TYPE>"
      // ...
    },
    "type": "source.template"
  }
}
```
