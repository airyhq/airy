---
title: WhatsApp
sidebar_label: WhatsApp
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import ButtonBox from "@site/src/components/ButtonBox";
import useBaseUrl from '@docusaurus/useBaseUrl';

<TLDR>

Connect with **2 billion WhatsApp users** via messages and templates.

</TLDR>

The Whatsapp cloud API has finally been released for general use and you can now connect it to Airy.

:::tip What you will learn

- The required steps to configure Whatsapp
- How to connect a Twilio WhatsApp source to Airy Core

:::

:::note

The WhatsApp cloud source is not enabled by default.

You need to add configuration in your airy.yaml file and apply it to activate it.

:::

- [Step 1: Get a Whatsapp test phone number](#step-1-get-a-whatsapp-test-phone-number)
- [Step 2: Install the Whatsapp cloud source](#step-2-install-the-whatsapp-cloud-source)
- [Step 3: Configure the Whatsapp cloud source](#step-3-configure-the-whatsapp-cloud-source)
- [Step 4: Connect the webhook](#step-4-connect-the-webhook)
- [Step 5: Connect a phone number to Airy](#step-4-connect-a-phone-number-to-airy)
- [Step 6: Send and receive messages with the Inbox UI](#step-6-send-and-receive-messages-with-the-inbox-ui)

We will go through [this guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started) provided by Meta step by step and once we are able to send messages we will configure Airy to be able to send/receive messages from Whatsapp.

## Step 1: Get a Whatsapp test phone number

First you need to complete step 1 of [this guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started).
At the end of which you should have the following:

1. A meta developer account and a business account
2. A meta app with Whatsapp connected as a product
3. A Whatsapp test phone number id

After you also complete step 2 you have now verified that you can send messages from that test phone number to.

Before proceeding go to your app dashboard and note down the id and secret of your app.
Airy will use these to generate long-lived access tokens and fetch conversation metadata on your behalf.

## Step 2: Install the Whatsapp cloud source

Here we assume that you already have a running Airy core instance ([get started](getting-started/installation/introduction)).
Now in order to use this source you have to first install it either by navigating to the [control center](/ui/control-center/connectors) or by directly calling the components installation API like so:

`POST /components.install`

```json
{
  "name": "airy-core/sources-whatsapp"
}
```

## Step 3: Configure the Whatsapp cloud source

Now that the source is installed we can enable and configure it using the values obtained in the creation of the test phone number.
For this you can again either use the control center UI or make the following call to the components API:

`POST /components.update`

```json5
{
  "components": [
    {
      "name": "sources-whatsapp",
      "enabled": true,
      "data": {
        "appId": "The id of your meta app",
        "appSecret": "The secret of your meta app",
        "webhookSecret": "a random secret created by you"
      }
    }
  ]
}
```

Note down the `webhook_secret` and use it when registering your webhook.

## Step 4: Connect the webhook

In order to be able to receive messages from Whatsapp your Airy instance needs to be accessible from the internet.
Go to the Whatsapp product section of your Meta app and click on the "Configuration" section.
Here you need to set the URL to `https://<your-airy-address>/whatsapp` and the secret to the value you noted down earlier.
When clicking "Verify and Save" the connection will be tested so that you can be sure that everything is working.

Next select the fields that you want to subscribe to.
You need to select at least `messages` and a version of `14.0` or higher.

## Step 5: Connect a phone number to Airy

Airy manages different connections of a messaging source as [channels](/getting-started/glossary.md#channel).
So in order to connect a phone number to Airy you need to create a channel.
You can do so by either using the control center UI or by using the API:

<ButtonBox
icon={<BoltSVG />}
title='Channels endpoint'
description='Connect a Whatsapp phone number to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#whatsapp'
/>

<br />

import ConnectWhatsapp from '../api/endpoints/connect-whatsapp.mdx'

<ConnectWhatsapp />

You can get a user token associated to your app using the [Facebook graph explorer](https://developers.facebook.com/tools/explorer).

To confirm that this is working you can write a message to this phone number.
The conversation should appear in your inbox.

## Step 6: Send and receive messages with the Inbox UI

Now let's confirm that we can write messages to our Whatsapp contacts you can select the conversation we created in the previous step in the inbox and write a message.

You can also use the [Messages API endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title="Messages endpoint"
description="Send messages from your Airy Core instance to different sources through the Messages endpoint"
link="api/endpoints/messages#send"
/>

<br />

**Sending a text message**

```json5
{
  "conversation_id": "<the conversation id>",
  "message": {
    "type": "text",
    "text": {
      "preview_url": false,
      "body": "Welcome to our business"
    }
  }
}
```

<br />

import InboxMessages from './inbox-messages.mdx'

<InboxMessages />
