---
title: Google’s Business Messages
sidebar_label: Google’s Business Messages
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import InboxSVG from "@site/static/icons/prototype.svg";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

Start receiving and sending messages from **Google Maps & Google Search**.

</TLDR>

Google's Business Messages source provides a channel of communication between your Google
Business Location and your running instance of Airy Core.

:::tip What you will learn

- The required steps to configure Google's Business Messages source
- How to connect a Google Business Location to Airy Core

:::

## Configuration

Google's Business Messages requires the following configuration:

- [Configuration](#configuration)
  - [Step 1: Registration](#step-1-registration)
  - [Step 2: Editing of the yaml file in Airy Core](#step-2-editing-of-the-yaml-file-in-airy-core)
  - [Step 3: Verification by Google](#step-3-verification-by-google)
- [Connecting Google's Business Messages to your Airy Core instance](#connecting-googles-business-messages-to-your-airy-core-instance)
- [Send messages from Google's Business Messages source](#send-messages-from-googles-business-messages-source)

Let's proceed step by step.

### Step 1: Registration

You first need to be registered with Google's Business Messages before
configuring this source. Refer to [Google's Business Messages'
guides](https://developers.google.com/business-communications/business-messages/guides)
to find more information about this source and the registration process.

### Step 2: Editing of the yaml file in Airy Core

Once you are registered, head over to your Google Service Account and create a key in json format.

<img alt="Facebook token page" src={useBaseUrl('img/sources/google/key.png')} />

Copy the Google Service Account key file provided by Google to
your `airy.yaml` file as a one line string next to `saFile:` below `components/sources/google`:

### Step 3: Verification by Google

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the value for `partnerKey:` to your partner key,
in your `airy.yaml` file, below `components/sources/google`.

import ApplyVariablesNote from './applyVariables-note.mdx'

<ApplyVariablesNote />

<SuccessBox>

Once the verification process has been completed, Google's Business Messages will immediately start sending events to your Airy Core instance 🎉

</SuccessBox>

## Connecting Google's Business Messages to your Airy Core instance

After the configuration, you can connect Google's Business Messages source to your instance by sending a request to the [Channels endpoint](/api/endpoints/channels#google).

<ButtonBox
icon={<BoltSVG />}
title='Channels endpoint'
description="Connect Google's Business Messages source to your Airy Core instance through the Channels endpoint"
link='api/endpoints/channels#google'
/>

<br/>

import ConnectGoogle from '../api/endpoints/connect-google.mdx'

<ConnectGoogle />

## Send messages from Google's Business Messages source

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send).

import GoogleMessagesSend from '../api/endpoints/google-messages-send.mdx'

<GoogleMessagesSend />
