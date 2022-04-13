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

**Connect your Facebook Pages**, send and receive messages from Facebook’s 1.3
billion users.

</TLDR>

This document provides a step by step guide to integrate Facebook with your Airy
Core Platform instance.

:::tip What you will learn

- The required steps to configure the Facebook source
- How to connect a Facebook page to Airy Core

:::

:::note

The Facebook Messenger source is not enabled by default.

You need to add configuration in your airy.yaml file and apply it to activate it.

:::

## Configuration

The Facebook source requires the following configuration:

- [Step 1: Find the App ID and Secret](#step-1-find-the-app-id-and-secret)
- [Step 2: Configure the webhook integration](#step-2-configure-the-webhook-integration)
- [Step 3: Obtain the page token](#step-3-obtain-the-page-token)
- [Step 4: Connect a Facebook page to your instance](#step-4-connect-a-facebook-page-to-your-instance)
- [Step 5: Send messages from a Facebook channel](#step-5-send-messages-from-a-facebook-channel)

Let's proceed step by step.

### Step 1: Find the App ID and Secret

To connect a page, you must have an approved Facebook app. If you don't have
one, you must register and create a Business app on [Facebook for Developers](https://developers.facebook.com/).

All of your registered apps are listed on [developers.facebook.com/apps](https://developers.facebook.com/apps/).

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/apps.jpg')} />

The dashboard of each registered app can be found on:

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/
```

On your application's dashboard, note down the `App ID` of your application and then head to the Basic Settings page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/settings/basic/
```

You will find your `App Secret` on this page:

<img alt="Facebook apps page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Copy and paste your App ID and App Secret as strings next to `appId:` and `appSecret:`, below `components/sources/facebook` in your `airy.yaml` file.

import ApplyVariablesNote from './applyVariables-note.mdx'

<ApplyVariablesNote />

### Step 2: Configure the webhook integration

Facebook must first verify your integration with a challenge to start sending events to your running instance. To verify your Facebook webhook integration, set the value next to `webhookSecret:`, below `components/sources/facebook` in your `airy.yaml` file, to a value of your choice.

You are now ready to configure the webhook integration. Click on the + icon next to "Products" on the left sidebar of your app's dashboard: scroll down, a list of products will appear.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

Click on the button 'Set Up' on the Webhooks product card.

<img alt="Facebook webhook add product" src={useBaseUrl('img/sources/facebook/webhookProduct.png')} />

This will add the Webhooks as one of your app's products and will lead you to the Webhooks product page.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/webhooks/
```

<img alt="Facebook webhook" src={useBaseUrl('img/sources/facebook/webhook_1.png')} />

Select 'Page' from the dropdown (the default is 'User') and click on the button 'Subscribe to this object'.

This will open a modal box: add your Callback URL (your instance's Facebook Webhook URL) and Verify Token (the webhookSecret you added in your `airy.yaml` file in the previous step).

<img alt="Facebook webhook" src={useBaseUrl('img/sources/facebook/webhook_2.png')} />

<br />

:::note

Your Facebook Webhook URL should have the following format:

```
https://your-public-fqdn/facebook
```

or if you are using Ngrok:

```
https://RANDOM_STRING.tunnel.airy.co/facebook
```

:::

If you encounter errors, please make sure that the Verify Token matches the
`webhookSecret` in your `airy.yaml` file and that your variables have been
successfully set to your Airy Core instance.

<ApplyVariablesNote />

Once the verification process has been completed, Facebook will immediately
start sending events to your Airy Core instance.

### Step 3: Obtain the page token

Go to the Products page (click on the + icon next to Products on the left sidebar).

Click the 'Set Up' button on the Messenger product card.

```
https://developers.facebook.com/apps/INSERT_YOUR_APP_ID_HERE/dashboard/#addProduct
```

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger_product.png')} />

This will add Messenger as one of your app's products and will lead you to the Messenger product page.

Notice that at the bottom of the page, the Webhooks product has been added with the variables you gave at the previous step.

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger.png')} />

Click on the blue button 'Add or Remove Pages' and select your page.

Once your page has been added, scroll down and click on the button 'Add Subscriptions'.

<img alt="Facebook page subscriptions" src={useBaseUrl('img/sources/facebook/add_subscriptions.png')} />

This opens a modal box: tick 'messages' and 'messaging_postbacks' from the Subscription Fields list.

<img alt="Facebook page subscriptions" src={useBaseUrl('img/sources/facebook/edit_page_subs.png')} />

Next, scroll up, and click on the button 'Generate Token'.

<img alt="Facebook page token" src={useBaseUrl('img/sources/facebook/token_messenger.png')} />

This will open a pop-up revealing your page Access Token. Copy it, you will need it to connect the Facebook page to your instance.

<img alt="Facebook page token" src={useBaseUrl('img/sources/facebook/tokenMessenger_popUp.png')} />

<br />
<br />

<SuccessBox>

Success! You are now ready to connect a Facebook page to your Airy Core instance 🎉

</SuccessBox>

## Step 4: Connect a Facebook page to your instance

import ConnectChannelOptions from "./connectChannelOptions.mdx"

<ConnectChannelOptions />

### Connect a Facebook channel via API request

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#facebook) to connect a Facebook page to your instance.

<ButtonBox
icon={<BoltSVG />}
title='Channels endpoint'
description='Connect a Facebook source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#facebook'
/>

<br />

import ConnectFacebook from '../api/endpoints/connect-facebook.mdx'

<ConnectFacebook />

:::note

If you encounter errors, please follow these debugging steps:

- Make sure the credentials you have added to the [airy.yaml configuration file](/getting-started/installation/configuration) have been applied to your Airy Core instance (refer back to step 1) .

- Verify your webhook integration (refer back to step 2). Make sure your Facebook Webhook URL has been correctly added on your app's dashboard. You should edit the 'Page' subscriptions for the Webhooks and Messenger product each time you create a new instance. Make sure that you have selected 'Page' subscription and not 'User' (which is the default).

:::

### Connect a Facebook channel via the UI

You can connect a Facebook channel via your app's [Control Center UI](/ui/control-center/introduction).

On your instance's [Control Center](/ui/control-center/introduction), click on 'Catalog' on the left sidebar menu and select 'Facebook'.

This will open a page with a form.

<img alt="Facebook connect" src={useBaseUrl('img/sources/facebook/facebook_ui.png')} />

Add your Facebook Page ID and Page Access Token in the form's respective fields.

Your can find your Facebook Page ID and Page Access Token on your app's dashboard on [Facebook For Developers](https://developers.facebook.com/): the Facebook Page ID is the ID of the page you want to connect and the Page Access Token is generated on the Messenger product section (refer back to the previous steps).

Make sure the variables have been successfully applied to your instance, otherwise you won't be able to connect the Facebook channel through the UI.

<ApplyVariablesNote />

<ConnectFormOptional />

import ConnectFormOptional from './connectFormOptional.mdx'

Next, click on the 'Save' button.

## Step 5: Send messages from a Facebook channel

Now, send a message to your Facebook page through Facebook Messenger.

This will create a new conversation between your Airy Core instance and Facebook Messenger, wich will appear instantly in the [Inbox UI's messenger](/ui/inbox/messenger).

If you do not see the conversation in the [Inbox UI's messenger](/ui/inbox/messenger) after sending the message, it means that the channel hasn't been successfully connected. Refer back to the previous steps.

Once a conversation has been successfully created, you will be able to send messages through
the [Messages endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title="Messages endpoint"
description="Send messages to your Airy Core instance from different sources through the Messages endpoint"
link="api/endpoints/messages#send"
/>

<br />

**Sending a text message**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "text": "Hello World"
  }
}
```

<br />

import InboxMessages from './inbox-messages.mdx'

<InboxMessages />
