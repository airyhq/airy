---
title: WhatsApp via Twilio
sidebar_label: WhatsApp Business API
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import ButtonBox from "@site/src/components/ButtonBox";

<TLDR>

Connect with **2 billion WhatsApp users** via messages and templates.

</TLDR>

The Twilio WhatsApp source provides a channel for sending and receiving WhatsApp
messages using the [Twilio API](https://www.twilio.com/).

:::tip What you will learn

- The required steps to configure the Twilio WhatsApp source
- How to connect a Twilio WhatsApp source to Airy Core

:::

:::note

The WhatsApp via Twilio source is not enabled by default.

You need to add configuration in your airy.yaml file and apply it to activate it.

:::

## Configuration

import TwilioConfig from './twilio-config.mdx'

<TwilioConfig />

Then, you need to request access to enable your Twilio number for WhatsApp by completing the request form on [Twilio's website](https://www.twilio.com/whatsapp/request-access). To request access, you
need to have a Facebook Business Manager ID: read [Twilio's documentation](https://www.twilio.com/docs/whatsapp/api) for more information on the request process.

import TwilioSources from './twilio-sources.mdx'

<TwilioSources />

<SuccessBox>

Success! You are now ready to connect a Twilio.WhatsApp source to your Airy Core instance 🎉

</SuccessBox>

### Connect a Twilio provider to your instance

There are 2 options to connect a Twilio.WhatsApp source to your instance:

- you can connect the source via an API request (using curl or platforms such as Postman)
- you can connect the source via the UI

We cover both options in this document.

## Connect a Twilio.WhatsApp source via API request

You connect connect a Twilio.WhatsApp source by sending a request to the Channels endpoint.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Twilio.WhatsApp source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#whatsapp'
/>

<br />

<ConnectTwilioWhatsApp />

import ConnectTwilioWhatsApp from '../api/endpoints/connect-twilioWhatsApp.mdx'

## Connect a Twilio.WhatsApp source via the UI

You can connect a Twilio.WhatsApp source via your Airy Core instance UI.

On your instance's Airy Core Control Center UI, click on 'Connectors' on the left sidebar menu and select the WhatsApp channel. Add your Twilio phone number in the Twilio Phone Number field. You can optionally add a name and an image.

```
http://localhost:8080/control-center/connectors
```

Your twilio.whatsApp channel will appear as connected in the UI.

## Send and receive messages with the Inbox UI

After connecting the source to your instance, it's time to create a conversation between your
Airy Core instance, and a Twilio.Whatsapp source.

Send a text message (Whatsapp) from a mobile phone to the Twilio phone number you have used.
This will create a conversation: a Twilio.Whatsapp conversation will appear in the UI with the text message you have sent.

import DebuggingTwilio from './debugging-twilio.mdx'

<DebuggingTwilio />

import TwilioSendMessage from './twilio-send-message.mdx'

<TwilioSendMessage />
