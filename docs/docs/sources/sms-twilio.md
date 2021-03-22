---
title: SMS via Twilio
sidebar_label: SMS
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

**Sending and receiving SMS** with every phone on the planet.

</TLDR>

This document provides a step by step guide to integrate a Twilio SMS source with your Airy
Core Platform instance.

The Twilio SMS source provides a channel for sending and receiving SMS using the
[Twilio API](https://www.twilio.com/).

:::tip What you will learn

- The required steps to configure the Twilio SMS source
- How to connect a Twilio SMS source to Airy Core

:::

:::

## Configuration

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

import ConnectTwilioSms from '../api/endpoints/connect-twilioSms.mdx'

<ConnectTwilioSms />

## Connect a Twilio.SMS source via the UI

You can connect a Twilio.SMS source via your Airy Core instance UI. For this, you must
have first cloned the repository and runned Airy Core on your local machine.

On your Airy Core Instance UI, click on Channels on the left sidebar menu and select Twilio SMS. Add your Twilio phone number in the Twilio Phone Number field. You can optionally add a name and an image.

```
`http://localhost:8080/ui/channels`
```

<img alt="TwilioSMS connect" src={useBaseUrl('img/sources/twilioSMS/twilioSMS_ui.png')} />

Your twilio.sms channel will appear as connected in the UI.

```
`http://localhost:8080/ui/channels/connected/twilio.sms/`
```

## Send messages from a Twilio.SMS source

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description='Send messages to your Airy Core instance from a Twilio.SMS source through the Messages endpoint'
link='api/endpoints/messages#send'
/>

<br />

import MessagesSend from '../api/endpoints/messages-send.mdx'

<MessagesSend />

## Send and receive messages with the Inbox UI

Now that you connected this source to your instance and started a conversation, you can see the conversations, messages, and templates in the [Airy Inbox](/apps/ui/inbox), and use it to respond to the messages.

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description='Receive messages from a Twilio.SMS source and send messages using the Inbox UI'
link='apps/ui/inbox'
/>
