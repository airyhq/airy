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

- Registration with Google's Business Messages
- Editing of the yaml file in Airy Core
- Verification by Google

Let's proceed step by step.

## Registration with Google's Business Messages

You first need to be registered with Google's Business Messages before configuring this source. You can find more information about Google's Business Messages and its messages types [here](https://developers.google.com/business-communications/business-messages/guides).

## Editing of the yaml file in Airy Core

Once you are registered, head over to your Google Service Account and create a key in json format.

<img alt="Facebook token page" src={useBaseUrl('img/sources/google/key.png')} />

Copy the Google Service Account key file provided by Google to
`infrastructure/airy.yaml` as a one line string

```
GOOGLE_SA_FILE=<CONTENT OF THE FILE>
```

## Verification by Google

As a security measure, every request sent by Google is signed and verified
against your partner key. You must also set the environment variable
`GOOGLE_PARTNER_KEY` to your partner key.

<SuccessBox>

Once the verification process has been completed, Google's Business Messages will immediately start
sending events to your Airy Core instance 🎉

</SuccessBox>

## Connecting Google's Business Messages to your Airy Core instance

After the configuration, send a request to the [Channels endpoint](/api/endpoints/channels#google) to connect Google's Business Messages source to your instance.

<ButtonBox
icon={() => <BoltSVG />}
title='Channels endpoint'
description="Connect Google's Business Messages source to your Airy Core instance through the Channels endpoint"
link='api/endpoints/channels#google'
/>

<br/>

```
POST /channels.google.connect
```

- `gbm_id` The id of your Google Business Message [agent](https://developers.google.com/business-communications/business-messages/reference/business-communications/rest/v1/brands.agents#Agent).
- `name` Custom name for the connected business
- `image_url` Custom image URL

```json5
{
  "gbm_id": "gbm-id",
  "name": "My custom name for this location",
  "image_url": "https://example.com/custom-image.jpg" // optional
}
```

**Sample response**

```json5
{
  "id": "channel-uuid-1",
  "metadata": {"name": "My custom name for this location", "image_url": "https://example.com/custom-image.jpg"},
  "source": "google",
  "source_channel_id": "gbm-id"
}
```

## Send messages from Google's Business Messages source

After connecting the source to your instance, you will be able to send messages through the [Messages endpoint](/api/endpoints/messages#send). See a sample request for sending a text message below.

<ButtonBox
icon={() => <BoltSVG />}
title='Messages endpoint'
description="Send messages to your Airy Core instance from Google's Business Messages through the Messages endpoint"
link='api/endpoints/messages#send'
/>

<br />

`POST /messages.send`

Sends a message to a conversation and returns a payload. Whatever is put on the
`message` field will be forwarded "as-is" to the source's message endpoint.

**Sending a text message**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "text": "Hello World"
  }
}
```

**Sample response**

```json5
{
  "id": "{UUID}",
  "content": '{"text":"Hello"}',
  "state": "pending|failed|delivered",
  "sender_type": "{string/enum}",
  // See glossary
  "sent_at": "{string}",
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  "source": "{String}",
  // one of the possible sources
  "metadata": {
    "sentFrom": "iPhone"
  }
  // metadata object of the message
}
```

## Send and receive messages with the Inbox UI

Now that you connected Google's Business Messages to your instance and started a conversation, you can see the conversations, messages in the [Airy Inbox](/apps/ui/inbox), and use it to respond to the messages. The [Inbox's UI](/apps/ui/inbox) is able render the messages types you can send from Google's Business Messages, such as Rich Cards or Suggestions.

<ButtonBox
icon={() => <InboxSVG />}
title='Inbox'
description="Receive messages from Google's Business Messages and send messsages using the Inbox UI"
link='apps/ui/inbox'
/>
