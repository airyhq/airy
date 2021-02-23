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

- [Step 1: Find the App ID and Secret](#step-1-find-the-app-id-and-secret)
- [Step 2: Configure the webhook integration](#step-2-configure-the-webhook-integration)
- [Step 3: Obtain the page token](#step-3-obtain-the-page-token)

Let's proceed step by step.

### Step 1: Find the App ID and Secret

To connect a page, you must have an approved Facebook app. If you don't have
one, you must register and create a Business app on [Facebook for Developers](https://developers.facebook.com/).

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

You will find your `App Secret` on this page:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Copy and paste your App ID and App Secret as strings next to `appId` and `appSecret` below `sources/facebook` in `infrastructure/airy.yaml`.

:::note

Refer to the [Configuration Docs](/getting-started/deployment/configuration.md#components) on how to input these values.

Refer to the [test](getting-started/deployment/vagrant.md#connect-sources) guide
or the [production](getting-started/deployment/production.md#connect-sources)
one to set these variables in your Airy Core instance.

:::

### Step 2: Configure the webhook integration

Facebook must first verify your integration with a challenge to start sending events to your running instance. To verify your Facebook webhook integration, set the environment variable `webhookSecret` in `infrastructure/airy.yaml` to a value of your choice.

You are now ready to configure the webhook integration. Click on the + icon next to "Products" on the left sidebar of your app's dashboard: scroll down, a list of products will appear.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

Click on the button "Set Up" on the Webhooks product card.

<img alt="Facebook webhook add product" src={useBaseUrl('img/sources/facebook/webhookProduct.png')} />

This will add the Webhooks as one of your app's products and will lead you to the Webhooks product page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/webhooks/
```

<img alt="Facebook webhook" src={useBaseUrl('img/sources/facebook/webhook_1.png')} />

Select "Page" from the dropdown (the default is "User") and click on the button "Subscribe to this object".

This will open a modal box: add your Callback URL (your instance's Facebook Webhook URL) and Verify Token (the webhookSecret you added in `infrastructure/airy.yaml` in the previous step).

<img alt="Facebook webhook" src={useBaseUrl('img/sources/facebook/webhook_2.png')} />

<br />

:::note

Your Facebook Webhook URL should have the following format:

```
`https://fb-RANDOM_STRING.tunnel.airy.co/facebook`
```

Refer to [our section on the Vagrant box status](/getting-started/deployment/vagrant#status) for information about how to find your Facebook Webhook URL.
:::

If you encounter errors, please make sure that the Verify Token matches the `webhookSecret` in `infrastructure/airy.yaml` and that your variables have been successfully set to your Airy Core instance.

:::note

Refer to the [test](/getting-started/deployment/vagrant.md#connect-sources)
guide or the
[production](/getting-started/deployment/production.md#connect-sources) one to
set these variables in your Airy Core instance.

:::

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core instance.

### Step 3: Obtain the page token

Go to the Products page (click on the + icon next to Products on the left sidebar).

Click on the button "Set Up" on the Messenger product card.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger_product.png')} />

This will add Messenger as one of your app's products and will lead you to the Messenger product page.

Notice that at the bottom of the page, the Webhooks product has been added with the variables you gave at the previous step.

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger.png')} />

Click on the blue button "Add or Remove Pages" and select your page.

Once your page has been added, scroll down and click on the button "Add Subscriptions".

<img alt="Facebook page subscriptions" src={useBaseUrl('img/sources/facebook/add_subscriptions.png')} />

This opens a modal box: tick "messages" and "messaging_postbacks" from the Subscription Fields list.

<img alt="Facebook page subscriptions" src={useBaseUrl('img/sources/facebook/edit_page_subs.png')} />

Next, scroll up, and click on the button "Generate Token".

<img alt="Facebook page token" src={useBaseUrl('img/sources/facebook/token_messenger.png')} />

This will open a pop-up revealing your page Access Token. Copy it, you will need it to connect the Facebook page to your instance.

<img alt="Facebook page token" src={useBaseUrl('img/sources/facebook/tokenMessenger_popUp.png')} />

<br />
<br />

<SuccessBox>

Success! You are now ready to connect a Facebook page to your Airy Core instance 🎉

</SuccessBox>

## Connect a Facebook page to your instance

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#facebook) to connect a Facebook page to your instance.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Facebook source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#facebook'
/>

<br />

import ConnectFacebook from '../api/endpoints/connect-facebook.mdx'

<ConnectFacebook />

## Send messages from a Facebook source

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description='Send messages to your Airy Core instance from a Facebook source through the Messages endpoint'
link='api/endpoints/messages#send'
/>

<br />

import MessagesSend from '../api/endpoints/messages-send.mdx'

<MessagesSend />

## Send and receive messages with the Inbox UI

Now that you connected Facebook Messenger to your instance and started a conversation, you can see the conversations, messages, and templates in the [Airy Inbox](/apps/ui/inbox), and use it to respond to the messages.

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description='Receive messages from a Facebook source and send messages using the Inbox UI'
link='apps/ui/inbox'
/>
