---
title: Channels
sidebar_label: Channels
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import useBaseUrl from '@docusaurus/useBaseUrl';
import ChannelsUI from "@site/static/icons/channelsUi.svg";

## Introduction

<TLDR>

Use the Channels UI to connect your sources simply and directly with a UI.

</TLDR>

**Sample**

<img alt="Connect Channel Example" src={useBaseUrl('img/ui/connectChannelExample.gif')} />

<br/>

## Configuration

- [Airy Live Chat](https://airy.co/docs/core/sources/chatplugin/quickstart)
  - Step 1: Sign up and log in
  - Step 2: Set up first source
  - Step 3: Send messages via the Chat Plugin
  - Step 4: Use the HTTP API to list conversations
  - Step 5: Consume directly from Apache Kafka
- [Facebook](https://airy.co/docs/core/sources/facebook#configuration)
  - Step 1: Find the App ID and Secret
  - Step 2: Configure the webhook integration
  - Step 3: Obtain the page token
  - Step 4: Connect Facebook page to your instance
- [Twilio SMS](https://airy.co/docs/core/sources/sms-twilio#configuration) & [Twilio Whatsapp](https://airy.co/docs/core/sources/whatsapp-twilio#configuration)
  - Step 1: Find the authToken and accountSid
  - Step 2: Configure the webhook integration
  - Step 3: Connect a Twilio provider to your instance
- [Google](https://airy.co/docs/core/sources/google#configuration)
  - Step 1: Registration
  - Step 2: Editing of the yaml file in Airy Core
  - Step 3: Verification by Google
