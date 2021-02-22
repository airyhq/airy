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
- [Step 2: Configure the webhook integration](#step-2-configure-the-webhook-integration)
- [Step 3: Obtain the page token](#step-3-obtain-a-page-token)

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

On your application's dashboard, note down the `App ID` of your application and then head to the Basic Settings page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/settings/basic/
```

Here you will find your `App Secret`:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Now you can use the App Id and the App Secret for the following environment variables in `infrastructure/airy.yaml`. Copy and paste them as strings next to `appId` and `appSecret` below `sources/facebook` in your airy.yaml file (see below). `webhookSecret`is be used to confirm the webhook integration; we will take care of it in the next step, leave it as it is for now.

<img alt="Facebook yaml file" src={useBaseUrl('img/sources/facebook/yamlFile.png')} />

:::note

Refer to the [Configuration Docs](/getting-started/deployment/configuration.md#components) on how to input these values.

Refer to the [test](getting-started/deployment/vagrant.md#connect-sources) guide
or the [production](getting-started/deployment/production.md#connect-sources)
one to set these variables in your Airy Core instance.

:::

### Step 2: Configure the webhook integration

Facebook must first verify your integration with a challenge to start sending events to your running instance. To verify your Facebook webhook integration, you must set the environment variable `webhookSecret` in `infrastructure/airy.yaml` to a value of your choice.

:::note

Refer to the [test](/getting-started/deployment/vagrant.md#connect-sources)
guide or the
[production](/getting-started/deployment/production.md#connect-sources) one to
set these variables in your Airy Core instance.

:::

Then you are ready to configure the webhook integration. Click on "Products" on the left sidebar of your application's dashboard and click on the + icon: scroll down, a list of products will appear.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

Scroll through the list and select the product "Webhooks" by clicking on the button "Set Up".

<img alt="Facebook webhook add product" src={useBaseUrl('img/sources/facebook/webhookProduct.png')} />

This will lead you to the webhooks product page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/webhooks/
```

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/webhook_1.png')} />

Select "Page" from the dropdown at the top right and click on the button "Subscribe to this object".

This will open a modal box: add your callback url (your instance's Facebook Webhook url) and verify token (the webhookSecret you added in `infrastructure/airy.yaml` in the previous step).

You can find your Facebook Webhook url by running in the terminal:

```
cd infrastructure
vagrant status
```

Your Facebook Webhook url should have the following format:

```
`https://fb-RANDOM_STRING.tunnel.airy.co/facebook`
```

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/webhook_2.png')} />

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core instance. If you encounter errors, please verify that the token matches the webhookSecret in `infrastructure/airy.yaml` and that your variables have been successfully set to your Airy Core instance.

:::note

Refer to the [test](/getting-started/deployment/vagrant.md#connect-sources)
guide or the
[production](/getting-started/deployment/production.md#connect-sources) one to
set these variables in your Airy Core instance.

:::

### Step 3: Obtain the page token

Next, go back to the Products page and select "Messenger" from the list by clicking on the button
"Set Up".

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger_product.png')} />

Click on the blue button "Add or Remove Pages" and select your page. After that, click on the button "Add callback url" and add your callback url (your instance's Facebook Webhook url) and verify token (the webhookSecret you added in `infrastructure/airy.yaml` in the previous step).

You can find your Facebook Webhook url by running in the terminal:

```
cd infrastructure
vagrant status
```

Your Facebook Webhook url should have the following format:

```
`https://fb-RANDOM_STRING.tunnel.airy.co/facebook`
```

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger.png')} />

Once your page has been added, click on the button "Generate Token".

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/token_messenger.png')} />

This will open a pop-up revealing your page token. Copy it, you will need it to connect the Facebook page to your instance.

<img alt="Facebook edit subscription" src={useBaseUrl('img/sources/facebook/tokenMessenger_popUp.png')} />

<br />
<br />

<SuccessBox>

You are now ready to connect a Facebook page to your Airy Core instance 🎉

</SuccessBox>

## Connect a Facebook page to your instance

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#facebook) to connect a Facebook page to your instance. `page_token` is the Page Access Token you obtained in the previous step.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Facebook source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#facebook'
/>

<br />

import ConnectFacebook from './connect-facebook.mdx'

<ConnectFacebook />

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

## Send and receive messages with the Inbox UI

Now that you connected Facebook Messenger to your instance and started a conversation, you can see the conversations, messages and templates in the [Airy Inbox](/apps/ui/inbox), and use it to respond to the messages.

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description='Receive messages from a Facebook source and send messsages using the Inbox UI'
link='apps/ui/inbox'
/>
