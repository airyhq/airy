---
id: index
title: Home
slug: /
---

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

- A webhook integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integration
  exposes events users can "listen" to and react programmatically.)

- A WebSocket server that allows clients to receive near real-time updates about
  data flowing through the system.

## Getting started

You can run the Airy Core Platform locally by running the following commands:

```sh
$ git clone -b main https://github.com/airyhq/airy
$ cd airy
$ ./scripts/bootstrap.sh
```

The bootstrap installation requires
[Vagrant](https://www.vagrantup.com/downloads) and
[VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not
found, the script will attempt to install them for you. Check out our [user
guide](user-guide.md) for detailed information.

## Next Steps
### 1. Connecting a chatplugin source

You can start connecting any source but the chatplugin is well suited to be the first because it doesn't have any outside dependencies. For connecting other sources refer to the respective documentation e.g. [Facebook](sources/facebook).

Make sure that you have [signed up](api/http#signup) with the user which we are using to get the authentication token.

```
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




Note the id from the response because that is the channel id which you will need in the next step.

### 2. Sending messages with the chatplugin

Pass the channel id as query parameter when opening the demo page in your browser. This will authenticate the chatplugin and enable you to send messages immedietly. 

```
http://chatplugin.airy/example.html?channel_id=<channel_id>
```

Next simply type your message in the text box and send it.

### 3. Receiving messages in the core platform

Finally, request all conversations for the channel you just created which should return the message you just sent.

```
curl -H "Content-Type: application/json" -H "Authorization: $token" -d \
"{ \
    \"filter\": \
        { \
            \"channel_ids\": [\"<channel_id>\"] \
        } \
}" api.airy/conversations.list | jq .
```

If you want to consume the messages directly from the Kafka topic you can do so with:

```
cd infrastructure && vagrant ssh
k exec -it airy-cp-kafka-0 -- /bin/bash
kafka-console-consumer \
--bootstrap-server airy-cp-kafka:9092 \
--topic application.communication.messages \
--from-beginning
```
