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

This document provides a step-by-step guide to integrate a Twilio SMS source with your Airy
Core Platform instance.

The Twilio SMS source provides a channel for sending and receiving SMS using the
[Twilio API](https://www.twilio.com/).

:::tip What you will learn

- The required steps to configure the Twilio SMS source
- How to connect a Twilio SMS source to Airy Core

:::

:::note

The SMS via Twilio source is not enabled by default.

You need to add configuration in your airy.yaml file and apply it to activate it.

:::

## Configuration

import TwilioConfig from './twilio-config.mdx'

<TwilioConfig />

import TwilioSources from './twilio-sources.mdx'

<TwilioSources />

<SuccessBox>

Success! You are now ready to connect a Twilio.SMS source to your Airy Core instance 🎉

</SuccessBox>

### Connect a Twilio provider to your instance

There are 2 options to connect a Twilio.SMS source to your instance:

- you can connect the source via an API request (using curl or platforms such as Postman)
- you can connect the source via the UI

We cover both options in this document.

## Connect a Twilio.SMS source via API request

You connect connect a Twilio.SMS source by sending a request to the Channels endpoint.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description='Connect a Twilio SMS source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#sms'
/>

<br />

<ConnectTwilioSms />

import ConnectTwilioSms from '../api/endpoints/connect-twilioSms.mdx'

## Connect a Twilio.SMS source via the UI

You can connect a Twilio.SMS source via your Airy Core instance [UI](/ui/overview).

On your instance's [Control Center](/ui/control-center/introduction), click on 'Catalog' on the left sidebar menu and select the SMS channel. Add your Twilio phone number in the Twilio Phone Number field. You can optionally add a name and an image.

<img alt="TwilioSMS connect" src={useBaseUrl('img/sources/twilioSMS/twilioSMS_ui.png')} />

Your twilio.sms channel will appear as connected in the UI.

Make sure the variables have been successfully applied to your instance, otherwise you won't be able to connect the Twilio SMS channel through the UI.

import ApplyVariablesNote from './applyVariables-note.mdx'

<ApplyVariablesNote />

## Send and receive messages with the Inbox UI

After connecting the source to your instance, it's time to create a conversation between your
Airy Core instance, and a Twilio.SMS source.

Send a text message (SMS) from a mobile phone to the Twilio phone number you have used.
This will create a conversation: a Twilio.SMS conversation will appear in the UI with the text message you have sent.

import DebuggingTwilio from './debugging-twilio.mdx'

<DebuggingTwilio />

import TwilioSendMessage from './twilio-send-message.mdx'

<TwilioSendMessage />
