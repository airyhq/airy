---
title: Google’s Business Messages
sidebar_label: Google’s Business Messages
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import GoogleSVG from "@site/static/icons/google.svg";

<TLDR>

Start receiving and sending messages from **Google Maps & Google Search**.

</TLDR>

The Google source provides a channel of communication between your Google
Business Location and your running instance of Airy Core.

:::tip What you will learn

- The required steps to configure the Google source
- How to connect a Google Business Location to Airy Core

:::

## Configuration

Find information about registering with Google Business Messages and its messages types [here] (https://developers.google.com/business-communications/business-messages/guides).

The first step is to copy the Google Service Account file provided by Google to
`infrastructure/airy.yaml` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key. 

Once the verification process has been completed, Google will immediately start
sending events to your Airy Core instance 🎉

The next step is to send a request to the [Channels endpoint](api/endpoints/channels.md#Google) to connect a Google source to your instance. 

After connecting the Google source to your instance, you will be able to send messages through the [Messages endpoint](api/endpoints/messages). The frontend of Airy Core is able render the messages types you can send from a Google source.

<ButtonBoxList>
<ButtonBox
    icon={() => <GoogleSVG />}
    title='Channels endpoint'
    description='Connect a Google source to your Airy Core instance through the Channels endpoint'
    link='api/endpoints/channels.md#Google'
/>

<ButtonBox
    icon={() => <GoogleSVG />}
    title='Messages endpoint'
    description='Send messages to your Airy Core instance from a Google source through the Messages endpoint'
    link='api/endpoints/messages'
/>
</ButtonBoxList>