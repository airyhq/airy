---
id: index
title: Home
slug: /
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows you to process messaging data from a variety of sources (like
Facebook messenger or Google business messages). The core platform contains the
following components:

- An ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](glossary.md) for formal definitions).

- An [HTTP API](api/http.md) that allows you to manage the data sets the
  platform handles.

- A [webhook](api/webhook) integration server that allows to programmatically
  participate in conversations by sending messages. The webhook integration
  exposes events you can "listen" to and react programmatically.

- A [WebSocket](api/websocket) server that allows you to receive near real-time
  updates about the data flowing through the system.

## Bootstrap the Airy Core Platform

Run the Airy Core Platform locally by entering the following commands:

```bash
git clone -b main https://github.com/airyhq/airy
cd airy
./scripts/bootstrap.sh
```

The bootstrap installation requires
[Vagrant](https://www.vagrantup.com/downloads) and
[VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not found,
the script will attempt to install them for you.

If Vagrant or VirtualBox cannot be installed with the `bootstrap.sh` script, you
need to install them manually.

The script will also ask for your administrative credentials as we are using the
[Vagrant Host Manager
Plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) to add entries to
your hosts file. You can skip this step and add the following lines to your
hosts file yourself.

```
192.168.50.5  demo.airy
192.168.50.5  api.airy
192.168.50.5  chatplugin.airy
```

Check out our [guide for running in test environment](guides/airy-core-in-test-env.md) for detailed information.

## Connect a Chat Plugin source

The chat plugin source is well suited for a first integration because it does
not require any configuration.

Once you [signed up](api/http#signup), you must [log in](api/http#login) so you
can obtain a valid JWT token for the upcoming API calls:

```bash
token=$(echo $(curl -H 'Content-Type: application/json' -d \
"{ \
\"email\":\"grace@example.com\", \
\"password\":\"the_answer_is_42\" \
}" api.airy/users.login) | jq -r '.token')
curl -H "Content-Type: application/json" -H "Authorization: $token" -d \
"{
    \"name\": \"chat plugin source\"
}" api.airy/chatplugin.connect
```

<img alt="channels_connect" src={useBaseUrl('img/home/connect_chatplugin_channel.gif')} />

The ID from the response is the `channel_id`. It is required for
the next steps, so note it down.

## Send messages via the Chat Plugin

Pass the `channel_id` as a query parameter when opening the demo page in your
browser. This authenticates the chat plugin and enables you to send messages
immediately:

```
http://chatplugin.airy/example.html?channel_id=<channel_id>
```

You can now type a message in the text box and send it 🎉

<img alt="chatplugin working" src={useBaseUrl('img/home/chatplugin.gif')} />

To see how messages are flowing through the system, [list
conversations](api/http.md#list-conversations) for the channel you have just created.
it should return the message you have just sent.

<img alt="conversations.list" src={useBaseUrl('img/home/conversation_list.gif')} />

```bash
curl -H "Content-Type: application/json" -H "Authorization: $token" -d "{}" \
api.airy/conversations.list | jq .
```

You can also consume the messages directly from the Kafka
`application.communication.messages` topic:

```bash
cd infrastructure && vagrant ssh
kubectl exec -it airy-cp-kafka-0 -- /bin/bash
kafka-console-consumer \
--bootstrap-server airy-cp-kafka:9092 \
--topic application.communication.messages \
--from-beginning
```

<img alt="Kafka Topic" src={useBaseUrl('img/home/kafka.gif')} />
