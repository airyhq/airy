---
title: WhatsApp via Twilio
sidebar_label: Twilio WhatsApp
---

import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import ButtonBox from "@site/src/components/ButtonBox";
import useBaseUrl from '@docusaurus/useBaseUrl';

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

import TwilioConfig from './twilio-config.mdx'

<TwilioConfig />

## Step 1: Configuration

Then, you need to request access to enable your Twilio number for WhatsApp by completing the request form on [Twilio's website](https://www.twilio.com/whatsapp/request-access). To request access, you
need to have a Facebook Business Manager ID: read [Twilio's documentation](https://www.twilio.com/docs/whatsapp/api) for more information on the request process.

import TwilioSources from './twilio-sources.mdx'

<TwilioSources />

<SuccessBox>

Success! You are now ready to connect a Twilio.WhatsApp source to your Airy Core instance 🎉

</SuccessBox>

## Step 2: Connect a Twilio provider to your instance

import ConnectChannelOptions from "./connectChannelOptions.mdx"

<ConnectChannelOptions />

### Connect Twilio.WhatsApp via API request

You connect connect a Twilio.WhatsApp source by sending a request to the Channels endpoint.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Twilio.WhatsApp source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#whatsapp'
/>

<br />

<ConnectTwilioWhatsApp />

import ConnectTwilioWhatsApp from '../../api/endpoints/connect-twilioWhatsApp.mdx'

### Connect Twilio.WhatsApp via the UI

You can connect a Twilio.WhatsApp channel via your Airy Core instance [Control Center UI](/ui/control-center/introduction).

On your instance's [Control Center](/ui/control-center/introduction), click on 'Catalog' on the left sidebar menu and select 'WhatsApp'.

This will open a page with a form.

<img alt="WhatsApp connect form" src={useBaseUrl('img/sources/twilio/whatsAppConnect.png')} />

Add your Twilio phone number in the respective field.

<ConnectFormOptional />

import ConnectFormOptional from './connectFormOptional.mdx'

Upon successful connection, Twilio.WhatsApp will appear as connected in the [Connectors](/ui/control-center/connectors) page in your app's [Control Center](/ui/control-center/introduction).

You can edit its configuration at any time by selecting 'WhatsApp' in the list.

<img alt="Control Center connectors" src={useBaseUrl('img/ui/controlCenterConnectors.png')} />

## Step 3: Send and receive messages with the Inbox UI

After connecting the source to your instance, it's time to create a conversation between your
Airy Core instance, and a Twilio.Whatsapp source.

Send a text message (Whatsapp) from a mobile phone to the Twilio phone number you have used.
This will create a conversation: a Twilio.Whatsapp conversation will appear in the [Inbox UI's messenger](/ui/inbox/messenger) with the text message you have sent.

import DebuggingTwilio from './debugging-twilio.mdx'

<DebuggingTwilio />

import TwilioSendMessage from './twilio-send-message.mdx'

<TwilioSendMessage />
