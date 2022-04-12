---
title: Quickstart
sidebar_label: Quickstart
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import RocketSVG from "@site/static/icons/rocket.svg";

<TLDR>

In this Quickstart we are **setting up our first source, listen to
conversations, and consume directly from Kafka**

</TLDR>

We are going to use Airy's Live Chat Plugin as our first source. We then use the
plugin to send messages, and check them out in the [Inbox UI](/ui/inbox/introduction),
your terminal and directly in Apache Kafka.

Airy's Live Chat Plugin can be connected both through API request and the
[Control Center UI](/ui/control-center/introduction). This document covers both options.

- [Step 1: Set up your first source](#step-1-set-up-your-first-source)
- [Step 2: Send messages via the Chat Plugin](#step-2-send-messages-via-the-chat-plugin)
- [Step 3: Use the HTTP API to list conversations](#step-3-use-the-http-api-to-list-conversations)
- [Step 4: Consume directly from Apache Kafka](#step-4-consume-directly-from-apache-kafka)

<ButtonBox
icon={<RocketSVG />}
title='Did you already install the Airy CLI?'
description='To get going with the Quickstart, you must install Airy first. Once the CLI is up and running you are good to go.'
link='/getting-started/installation/introduction'
/>

## Step 1: Set up your first source

```shell script
curl -H "Content-Type: application/json" -d \
"{
    \"name\": \"chat plugin source\"
}" http://airy.core/channels.chatplugin.connect
```

<img alt="channels_connect" src={useBaseUrl('img/sources/chatplugin/connect_chatplugin_channel.gif')} />

The ID from the response is the `channel_id`. It is required for
the next steps, so note it down.

Alternatively, you can connect an Airy's Live Chat Plugin channel via the [UI](/ui/overview).

On your instance's [Control Center](/ui/control-center/introduction), click on the 'Connectors' icon on the left sidebar menu and select Airy Live Chat. Then, click on the button "Connect Airy Live Chat".

<img alt="chat plugin channels UI" src={useBaseUrl('img/sources/chatplugin/chatplugin-connect.png')} />

Enter a display name and optionally an image URL in the respective fields. The display name will be used as the [conversation](/getting-started/glossary/#conversation)'s name while the image URL will be used as its icon in the [Inbox UI](/ui/inbox/introduction). A fallback image will be used if you do not enter a valid image URL. Click on the Save button.

<img alt="chat plugin channels UI" src={useBaseUrl('img/sources/chatplugin/chatplugin-connect-form.png')} />

An Airy's Live Chat Plugin [channel](/getting-started/glossary/#channel) will appear as connected in the [Connectors](/ui/control-center/connectors) page in the [Control Center UI](/ui/control-center/introduction).

<img alt="Control Center connectors" src={useBaseUrl('img/ui/controlCenterConnectors.png')} />

Click on the Airy Live Chat Button. This will bring you to a page where you can edit or disconnect all Airy Live Chat Plugin channels. Select the channel you just connected and click on 'Edit'.

<img alt="chat plugin channels UI" src={useBaseUrl('img/sources/chatplugin/chatplugin-channel-connected.png')} />

<img alt="chat plugin channels UI" src={useBaseUrl('img/sources/chatplugin/chatplugin-id.png')} />

Click on the 'Install app' tab. Here you will find the `channel_id`, which is located in the sample code (highlighted in the screenshot above). It is required for the next steps, so note it down.

## Step 2: Send messages via the Chat Plugin

Pass the `channel_id` as a query parameter when opening the demo page in your
browser. This authenticates the chat plugin and enables you to send messages
immediately:

```
http://airy.core/chatplugin/ui/example?channel_id=<channel_id>
```

You can now type a message in the text box and send it 🎉

<img alt="chatplugin working" src={useBaseUrl('img/sources/chatplugin/chatplugin.gif')} />

## Step 3: Use the HTTP API to list conversations

To see how messages are flowing through the system, [list
conversations](/api/endpoints/conversations.md#list) for the channel you have just
created. it should return the message you have just sent.

<img alt="conversations.list" src={useBaseUrl('img/sources/chatplugin/conversation_list.gif')} />

<br />

```sh
curl -XPOST http://airy.core/conversations.list | jq .
```

The [Inbox UI](/ui/inbox/introduction) lists all your [conversations](/getting-started/glossary/#conversation), across all [sources](/getting-started/glossary/#source).

The screenshot below shows a conversation list in the [Inbox UI's messenger](/ui/inbox/messenger). In this example, all the [conversations](/getting-started/glossary/#conversation) have been created by connecting an Airy Live Chat [channel](/getting-started/glossary/#channel) to an Airy Core instance.

Each time you connect a new [channel](/getting-started/glossary/#channel), a new [conversation](/getting-started/glossary/#conversation) is created and added in the [Inbox UI's messenger](/ui/inbox/messenger). You can then use it to respond to [messages](/getting-started/glossary/#message).

<img alt="conversations list UI" src={useBaseUrl('img/sources/chatplugin/chatplugin-conversations.png')} />

## Step 4: Consume directly from Apache Kafka

You can also consume the messages directly from the Kafka
`application.communication.messages` topic:

```
kubectl exec -it kafka-0 -- /bin/bash
kafka-console-consumer.sh \
--bootstrap-server kafka:9092 \
--topic application.communication.messages \
--from-beginning
```

<img alt="Kafka Topic"
src={useBaseUrl('img/sources/chatplugin/messages_topic.gif')} />
