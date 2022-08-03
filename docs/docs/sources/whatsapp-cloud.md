---
title: WhatsApp via Twilio
sidebar_label: Twilio WhatsApp
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import ButtonBox from "@site/src/components/ButtonBox";
import useBaseUrl from '@docusaurus/useBaseUrl';

:::warning

This source is still under development. You can track the progress [here](https://github.com/airyhq/airy/milestone/38).

:::

<TLDR>

Connect with **2 billion WhatsApp users** via messages and templates.

</TLDR>

The Whatsapp cloud API has finally been released for general use and you can now connect it with Airy.

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
3. A Whatsapp test phone number

After you also complete step 2 you have now verified that you can send messages from that test phone number to.

Next we also need to obtain a long-lived user access token that Airy will use to send messages to Whatsapp:

1. Go to the [Facebook Graph explorer](https://developers.facebook.com/tools/explorer)
2. Select your app and "User access token", and copy the automatically generated token
3. Go to the Facebook token debugger and put in your token
4. Click "Extend token" and copy the new token


## Step 2: Install the Whatsapp cloud source

Here we assume that you already have a running Airy core instance ([get started](getting-started/installation/introduction)).
Now in order to use this source you have to first install it either by navigating to the [control center](/ui/control-center/connectors) or by directly calling the components installation API like so:

```
POST /components.install
{
  "name": "airy-core/sources-whatsapp"
}
``` 

## Step 3: Configure the Whatsapp cloud source

Now that the source is installed we can enable and configure it using the values obtained in the creation of the test phone number.
For this you can again either use the control center UI or make the following call to the components API:

```
POST /components.update

{
  "components": [
    {
      "name": "sources-whatsapp",
      "enabled": true,
      "data": {
        "token": "access token obtained in step 1",
        "webhook_secret": "a random secret created by you"
      }
    }
  ]
}
``` 

Note down the `webhook_secret` and use it when registering your webhook.


## Step 4: Connect a phone number to Airy

TBD

## Step 5: Connect a phone number to Airy

TBD

## Step 6: Send and receive messages with the Inbox UI

TBD
