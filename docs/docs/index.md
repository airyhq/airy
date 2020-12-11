---
id: index
title: Home
slug: /
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows its user to process messaging data from a variety of sources (like
facebook messenger or google business messages). The core platform contains the
following components:

- An ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](glossary.md) for formal definitions).

- An [HTTP api](api/http.md) to manage the data sets the platform
  handles.

- A [webhook](api/webhook) integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integration
  exposes events users can "listen" to and react programmatically.)

- A [WebSocket](api/websocket) server that allows clients to receive near real-time updates about
  data flowing through the system.

## Bootstrapping the Airy Core Platform

You can run the Airy Core Platform locally by running the following commands:

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
will need to install them manually.

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

## Connecting a chat plugin source

The chat plugin source is well suited for a first integration because it does
not require any configuration.

Once you [signed up](api/http#signup), you must [log in](api/http#login) so you
can obtain a valid JWT token for the up-coming API calls:

```bash
token=$(echo $(curl -H 'Content-Type: application/json' -d \
"{ \
\"email\":\"grace@example.com\", \
\"password\":\"the_answer_is_42\" \
}" api.airy/users.login) | jq -r '.token')
curl -H "Content-Type: application/json" -H "Authorization: $token" -d \
"{ \
    \"source\": \"chat_plugin\", \
    \"source_channel_id\": \"my-chat-channel-1\", \
    \"name\": \"chat plugin source\"
}" api.airy/channels.connect
```

<img alt="channels_connect" src={useBaseUrl('img/home/channels_connect.gif')} />

The id from the response is the `channel_id`, note it down as it's required in
the next steps.

## Sending messages with the chat plugin

Pass the `channel_id` as query parameter when opening the demo page in your
browser. This will authenticate the chat plugin and enable you to send messages
immediately:

```
http://chatplugin.airy/example.html?channel_id=<channel_id>
```

You can now type a message in the text box and send it 🎉

<img alt="chatplugin working" src={useBaseUrl('img/home/chatplugin.gif')} />

To see how messages are flowing through the system, you can now [list
conversations](api/http.md#list-conversations) for the channel you just created
which should return the message you just sent.

<img alt="conversations.list" src={useBaseUrl('img/home/conversation.list.jpg')} />

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
