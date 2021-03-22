---
title: SMS via Twilio
sidebar_label: Twilio SMS
---

import TLDR from "@site/src/components/TLDR";
import useBaseUrl from '@docusaurus/useBaseUrl';
import ButtonBox from "@site/src/components/ButtonBox";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

**Sending and receiving SMS** with every phone on the planet.

</TLDR>

[Twilio](https://www.twilio.com/) is a communication platform specialized in phone services. Airy Core supports Twilio as a provider of 2 different sources: Twilio WhatsApp and Twilio SMS.

This document provides a step by step guide to integrate a Twilio SMS source with your Airy
Core Platform instance.

The Twilio SMS source provides a channel for sending and receiving SMS using the
[Twilio API](https://www.twilio.com/).

:::tip What you will learn

- The required steps to configure the Twilio SMS source
- How to connect a Twilio SMS source to Airy Core

:::

import TwilioSource from './twilio-source.mdx'

<TwilioSource />

<SuccessBox>

Success! You are now ready to connect a Twilio.SMS source to your Airy Core instance 🎉

</SuccessBox>

### Connect a Twilio.SMS source to your instance

There are 2 options to connect a Twilio.SMS source to your instance:

- you can connect the source via an API request (using curl or platforms such as Postman)
- you can connect the source via the UI

We cover both options in this document.

## Connect a Twilio.SMS source via API request

You connect connect a Twilio.SMS source by sending a request to the [Channels endpoint](/api/endpoints/channels#facebook).

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Twilio.SMS source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#twilioSms'
/>

<br />

import ConnectTwilioSms from '../api/endpoints/connect-twilioSms.mdx'

<ConnectTwilioSms />

## Connect a Twilio.SMS source via the UI

You can connect a Twilio.SMS source via your Airy Core instance UI.

On your instance's Airy Core UI, click on 'Channels' on the left sidebar menu and select the SMS channel. Add your Twilio phone number in the Twilio Phone Number field. You can optionally add a name and an image.

```
http://localhost:8080/ui/channels
```

<img alt="TwilioSMS connect" src={useBaseUrl('img/sources/twilioSMS/twilioSMS_ui.png')} />

Your twilio.sms channel will appear as connected in the UI.

```
http://localhost:8080/ui/channels/connected/twilio.sms/
```

## Send messages from a Twilio.SMS source

After connecting the source to your instance, it's time to create a conversation between your
Airy Core instance and a Twilio.SMS source.

Send a text message (SMS) from a mobile phone to the Twilio phone number you have used.
This will create a conversation: a Twilio.SMS conversation will appear in the UI with the text message you have sent.

If the channel has been successfully connected, but the message you sent does not appear in a conversation and a conversation is not created, please see below for debugging advices.

import DebuggingTwilio from './debugging-twilio.mdx'

<DebuggingTwilio />

Once the conversation has been successfully created, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description='Send messages to your Airy Core instance from a Twilio.SMS source through the Messages endpoint'
link='api/endpoints/messages#send'
/>

<br />

import MessagesSend from '../api/endpoints/messages-send.mdx'

<MessagesSend />

import InboxMessages from './inbox-messages.mdx'

<InboxMessages />
