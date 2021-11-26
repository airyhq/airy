---
title: Instagram
sidebar_label: Instagram
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import InboxSVG from "@site/static/icons/prototype.svg";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

Start interacting with 1 billion monthly active users on Instagram!

</TLDR>

<video controls autoPlay loop style={{width: "100%"}} muted>

<source src="https://s3.amazonaws.com/assets.airy.co/docs/instagram.mp4" type="video/mp4"/>  
 <source src="https://s3.amazonaws.com/assets.airy.co/docs/instagram.webm" type="video/webm"/>
</video>

This document provides a step by step guide to connect an Instagram account with your Airy
Core Platform instance.

:::tip What you will learn

- The required steps to configure the Instagram source
- How to connect an Instagram account to Airy Core

:::

:::note Before you start

Make sure you have:

- An instagram account fulfilling Facebook's [rollout criteria](https://developers.facebook.com/docs/messenger-platform/instagram/rollout).
- A Facebook Page connected to that account (linking can only be done via the Instagram mobile app).
- A registered [Facebook app](https://developers.facebook.com/docs/apps#register).

You also need to allow API Access in Settings > Privacy > Messages in the Instagram mobile app.

:::

To connect an instagram account we have to complete the following steps:

- [Step 1: Find the App ID and Secret](#step-1-find-the-app-id-and-secret)
- [Step 2: Update the webhook integration](#step-2-configure-the-webhook-integration)
- [Step 3: Enable the Instagram Graph API](#step-3-enable-the-instagram-graph-api)
- [Step 4: Obtain the Page token](#step-4-obtain-the-page-token)
- [Step 5: Get the Instagram account ID](#step-5-get-the-instagram-account-id)
- [Step 6: Connect an Instagram channel via API request](#step-6-connect-an-instagram-channel-via-api-request)
- [Step 7: Send a message to Instagram](#step-7-send-a-message-to-instagram)

### Step 1: Find the App ID and Secret

Assuming that you already have a registered app, you can find it listed under [developers.facebook.com/apps](https://developers.facebook.com/apps/).

<img alt="Facebook apps Page" src={useBaseUrl('img/sources/facebook/apps.jpg')} />

On your application's dashboard, note down the `App ID` of your application and then head to the`Settings > Basic` page, where you will find your `App Secret`:

<img alt="Facebook basic settings Page" src={useBaseUrl('img/sources/facebook/secret.png')} />

Copy and paste your App ID and App Secret as strings next to `appId:` and `appSecret:`, below `components/sources/facebook` in your `airy.yaml` file.

import ApplyVariablesNote from './applyVariables-note.mdx'

<ApplyVariablesNote />

### Step 2: Configure the webhook integration

Facebook must first verify your integration with a challenge to start sending events to your running instance. To verify your Facebook webhook integration, set the value next to `webhookSecret:`, below `components/sources/facebook` in your `airy.yaml` file, to a value of your choice.

You are now ready to configure the webhook integration. Click on the + icon next to "Products" on the left sidebar of your app's dashboard: scroll down, a list of products will appear.

Click on the button `Set Up` on the Webhooks product card.

<img alt="Facebook webhook add product" src={useBaseUrl('img/sources/facebook/webhookProduct.png')} />

This will add the Webhooks as one of your app's products and will lead you to the Webhooks product page.

<img alt="Instagram webhook" src={useBaseUrl('img/sources/instagram/webhookInstagram.jpg')} />

Select `Instagram` from the dropdown (the default is `User`) and click on the button `Subscribe to this object`.

This will open a modal box: Add your Callback URL (your instance's Facebook Webhook URL) and verify token (the `webhookSecret` you added in your `airy.yaml` file in the previous step). After this is done you will see a list of events, where you need to subscribe to `messages`.

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

If you encounter errors, please make sure the verify token matches the
`webhookSecret` in your `airy.yaml` file and that your variables have been
configured successfully in your Airy Core instance.

<ApplyVariablesNote />

Once the verification process is complete, Facebook will immediately
start sending events to your Airy Core instance.

### Step 3: Enable the Instagram Graph API

To allow Airy to access names and profile pictures you need to enable the Instagram API. To do so go to the Products page and click the `Set Up` button on the Instagram Graph API product card.

### Step 4: Obtain the Page token

Go to the Products page (click on the + icon next to Products on the left sidebar).

Next click the `Set Up` button on the Messenger product card.

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger_product.png')} />

This will add Messenger as one of your app's products and will lead you to the Messenger product page.

Notice that at the bottom of the page, the Webhooks product has been added with the variables you gave at the previous step.

<img alt="Facebook messenger product" src={useBaseUrl('img/sources/facebook/messenger.png')} />

Click on the blue button `Add or Remove Pages` and select your page. Next, scroll up, and click on the button `Generate Token`.

<img alt="Facebook Page token" src={useBaseUrl('img/sources/facebook/token_messenger.png')} />

This will open a pop-up revealing your Page access token. Copy it! You will need it to connect the instagram account to your instance.

<img alt="Facebook Page token" src={useBaseUrl('img/sources/facebook/tokenMessenger_popUp.png')} />

### Step 5: Get the Instagram account ID

To connect your account you will also need the ID (not the username) of your Instagram Business account. To get
it you can click on [this link](https://developers.facebook.com/tools/explorer/?method=GET&path=me%3Ffields%3Dinstagram_business_account&version=v11.0) to run a prepared query against the Facebook Graph API. Make sure
to either select your Page and App or to use the Page token you acquired in step 4.

<img alt="Use the Facebook Graph explorer to get your instagram account id" src={useBaseUrl('img/sources/instagram/instagramAccountId.jpg')} />

<SuccessBox>

Success! You are now ready to connect an Instagram Account to your Airy Core instance 🎉

</SuccessBox>

<br />
<br />

## Step 6: Connect an Instagram channel via API request

The next step is to send a request to the [channels endpoint](/api/endpoints/channels#instagram) to connect an instagram account to your instance.

<ButtonBox
icon={<BoltSVG />}
title='Channels endpoint'
description='Connect an instagram account to your Airy Core instance via the channels endpoint'
link='api/endpoints/channels#instagram'
/>

<br />

import ConnectInstagram from '../api/endpoints/connect-instagram.mdx'

<ConnectInstagram />

:::note

Troubleshooting:

- Make sure the credentials you have added to the airy.yaml file (refer back to step 1) have been applied to your Airy Core instance.

- Verify your webhook integration (refer back to step 2). Make sure your Facebook Webhook URL has been correctly added on your app's dashboard. You should edit the 'Instagram' subscriptions for the Webhooks and Messenger product each time you create a new instance. Make sure that you have selected 'Instagram' subscription and not 'User' (which is the default).

:::

## Step 7: Send a message to Instagram

To test this you can now send a message to your Instagram account using the Instagram app or web interface.

<video controls autoPlay loop style={{width: "100%"}} muted>

<source src="https://s3.amazonaws.com/assets.airy.co/docs/instagram.mp4" type="video/mp4"/>  
 <source src="https://s3.amazonaws.com/assets.airy.co/docs/instagram.webm" type="video/webm"/>
</video>

import InboxMessages from './inbox-messages.mdx'

<InboxMessages />
