---
title: Viber
sidebar_label: Viber
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import InboxSVG from "@site/static/icons/prototype.svg";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

Start receiving and sending messages using **the popular messaging app, Viber**.

</TLDR>

Viber allows you to configure a business account that you can use to send and receive messages
to and from users

:::tip What you will learn

- The required steps to configure the Viber messages source
- How to connect your Viber account to Airy

:::

## Configuration

To get started with Viber we will complete the following steps

- [Step 1: Registration](#step-1-registration)
- [Step 2: Editing of the yaml file in Airy Core](#step-2-updating-the-airy-config-file)
- [Step 3: Connecting the channel](#step-2-editing-of-the-yaml-file-in-airy-core)
- [Step 4: Send and receive a test message](#send-messages-from-googles-business-messages-source)

Let's proceed step by step.

### Step 1: Registration

First you need a Viber bot account. You can register one by clicking on [this link](https://partners.viber.com/account/create-bot-account) and filling out the required form. At the end of the process you will be presented with your authentication token. Copy it for the next step.

<img alt="Viber successful account creation" src={useBaseUrl('img/sources/viber/account-creation.jpg')} />

### Step 2: Updating the Airy config file

Add a section for viber in your `airy.yaml` under `components > sources`. Add your authentication token so that your file looks like so:

```yaml
components:
  sources:
    viber:
      authToken: "<your viber authentication token>"
```

Now run the `airy config apply` command and viber is ready to use.

### Step 3: Connecting the channel

The next step is to send a request to the [Channels endpoint](/api/endpoints/channels#viber) to connect Viber to your instance.

<ButtonBox
icon={<BoltSVG />}
title='Channels endpoint'
description='Connect a Viber source to your Airy Core instance through the Channels endpoint'
link='api/endpoints/channels#viber'
/>

<br />

import ConnectViber from '../api/endpoints/connect-viber.mdx'

<ConnectViber />

## Step 4: Send and receive a test message

Find your bot on Viber and send it a message. The message should show up in your Airy Inbox.
Now the conversation is created and you are ready to reply using the ui or the [Messages endpoint](/api/endpoints/messages#send).

<ButtonBox
icon={() => <BoltSVG />}
title="Messages endpoint"
description="Send messages to your Airy Core instance from different sources through the Messages endpoint"
link="api/endpoints/messages#send"
/>

<br />

**Sending a text message**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#text-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "text": "Hello World",
    "type": "text"
  }
}
```

**Sending a picture**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#picture-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "picture",
    "text": "Photo description",
    "media": "http://www.images.com/img.jpg",
    "thumbnail": "http://www.images.com/thumb.jpg"
  }
}
```

**Sending a video**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#video-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "video",
    "media": "http://www.images.com/video.mp4",
    "thumbnail": "http://www.images.com/thumb.jpg",
    "size": 10000,
    "duration": 10
  }
}
```

**Sending a file**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#file-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "file",
    "media": "http://www.images.com/file.doc",
    "size": 10000,
    "file_name": "name_of_file.doc"
  }
}
```

**Sharing a contact**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#contact-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "contact",
    "contact": {
      "name": "Itamar",
      "phone_number": "+972511123123"
    }
  }
}
```

**Sharing a location**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#location-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "location",
    "location": {
      "lat": "37.7898",
      "lon": "-122.3942"
    }
  }
}
```

**Sending a URL**

[Learn more](https://developers.viber.com/docs/api/rest-bot-api/#url-message)

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "type": "url",
    "media": "http://www.website.com/go_here"
  }
}
```
