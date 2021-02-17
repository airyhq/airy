---
title: Google’s Business Messages
sidebar_label: Google’s Business Messages
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import BoltSVG from "@site/static/icons/bolt.svg";
import InboxSVG from "@site/static/icons/prototype.svg";

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

You first need to be registered with Google Business Messages before configuring this source. You can find more information about Google Business Messages and its messages types [here](https://developers.google.com/business-communications/business-messages/guides).

Once you are registered, copy the Google Service Account file provided by Google to
`infrastructure/airy.yaml` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key.

Once the verification process has been completed, Google will immediately start
sending events to your Airy Core instance 🎉

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#google) to connect the Google Business Messages source to your instance.

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send). [Airy's Inbox UI](/apps/ui/inbox) is able render the messages types you can send from a Google Business Messages source, such as Rich Cards or Suggestions.

<ButtonBoxList>
<ButtonBox
    icon={() => <BoltSVG />}
    title='Channels endpoint'
    description='Connect a Google Business Messages source to your Airy Core instance through the Channels endpoint'
    link='api/endpoints/channels#google'
/>

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description='Send messages to your Airy Core instance from a Google Business Messages source through the Messages endpoint'
link='api/endpoints/messages#send'
/>

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description='See the messages sent from a Google Business Messages source in the Inbox UI'
link='apps/ui/inbox'
/>
</ButtonBoxList>
