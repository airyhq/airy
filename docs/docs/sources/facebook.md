---
title: Facebook Messenger
sidebar_label: Facebook Messenger
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import InboxSVG from "@site/static/icons/prototype.svg";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

**Connect your Facebook Pages**, send and receive messages from Facebook’s 1,3
Billion users.

</TLDR>

This document provides a step by step guide to integrate Facebook with your Airy
Core Platform instance.

:::tip What you will learn

- The required steps to configure the Facebook source
- How to connect a Facebook page to Airy Core

:::

## Configuration

The Facebook source requires the following configuration:

- [Step 1: Step 1: Find the App ID and secret](#step-1-find-the-app-id-and-secret)
- [Step 2:  Configure the webhook integration](#step-2-configure-the-webhook-integration)
- [Step 3: Obtain a page token](#step-3-obtain-a-page-token)

Let's proceed step by step.

### Step 1: Find the app id and secret

To connect a page, you must have an approved Facebook app. If you don't have
one, you must register and create an app on [Facebook For Developers](https://developers.facebook.com/).

All your registered apps are listed on [developers.facebook.com/apps](https://developers.facebook.com/apps/).

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/apps.jpg')} />

The dashboard of each registered apps can be found on:

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/
```

On your application's dashboard, note down the `App ID` of your application and then head to the Basic
Settings page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/settings/basic/
```

Here you will find your `App Secret`:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Now you can use the app id and the app secret for the following environment variables:

- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

Refer to the [Configuration Docs](/getting-started/deployment/configuration.md#components) on how to input these values.

:::note

Refer to the [test](getting-started/deployment/vagrant.md#connect-sources) guide
or the [production](getting-started/deployment/production.md#connect-sources)
one to set these variables in your Airy Core instance.

:::

### Step 2: Configure the webhook integration

For Facebook to start sending events to your running instance, it must first
verify your integration with a challenge. To verify your Facebook webhook
integration, you must set the environment variable `FACEBOOK_WEBHOOK_SECRET` to
a value of your choice.

:::note

Refer to the [test](/getting-started/deployment/vagrant.md#connect-sources)
guide or the
[production](/getting-started/deployment/production.md#connect-sources) one to
set these variables in your Airy Core instance.

:::

Then you are ready to configure the webhook integration. Head to the dashboard
of your Facebook application, find the "Webhooks" link on the left menu and then
click on "Edit subscription".

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/webhooks/
```

You will see something like this:

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/webhook.png')} />

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core instance.

### Step 3: Obtain a page token

The next step is to obtain a page token, so that Airy Core can send messages on
behalf of your page. The fastest way to get one is to use the graph explorer
that Facebook provides [Graph
Explorer](https://developers.facebook.com/tools/explorer/).

On the `User or Page` option, select `Get Page Token` and click on `Generate Access Token`:

<img alt="Facebook token page" src={useBaseUrl('img/sources/facebook/token.jpg')} />

<SuccessBox>

You are now ready to connect a Facebook page to your Airy Core instance 🎉

</SuccessBox>

<br />

## Connect a Facebook page to your instance

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#facebook) to connect a Facebook page to your instance.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Facebook source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#facebook'
/>

<br />

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

## Send messages from a Facebook source

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send). See a sample request for sending a text message below.

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description='Send messages to your Airy Core instance from a Facebook source through the Messages endpoint'
link='api/endpoints/messages#send'
/>

<br />

`POST /messages.send`

Sends a message to a conversation and returns a payload. Whatever is put on the
`message` field will be forwarded "as-is" to the source's message endpoint.

**Sending a text message**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "text": "Hello World"
  }
}
```

**Sample response**

```json5
{
  "id": "{UUID}",
  "content": '{"text":"Hello"}',
  "state": "pending|failed|delivered",
  "sender_type": "{string/enum}",
  // See glossary
  "sent_at": "{string}",
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  "source": "{String}",
  // one of the possible sources
  "metadata": {
    "sentFrom": "iPhone"
  }
  // metadata object of the message
}
```

<br />

## Send and receive messages with the Inbox UI

Now that you connected Facebook Messenger to your instance and started a conversation, you can see the conversations, messages and templates in the [Airy Inbox](/apps/ui/inbox), and use it to respond to the messages.

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description='Receive messages from a Facebook source and send messsages using the Inbox UI'
link='apps/ui/inbox'
/>
