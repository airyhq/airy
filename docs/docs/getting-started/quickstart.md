---
title: Quickstart
sidebar_label: Quickstart
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Connect a Chat Plugin source

The chat plugin source is well suited for a first integration because it does
not require any configuration.

Once you [signed up](/api/endpoints/users.md#signup), you must [log
in](/api/authentication.md#login) so you can obtain a valid JWT token for the
upcoming API calls:

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

<img alt="channels_connect" src={useBaseUrl('img/getting-started/quickstart/connect_chatplugin_channel.gif')} />

The ID from the response is the `channel_id`. It is required for
the next steps, so note it down.

## Send messages via the Chat Plugin

Pass the `channel_id` as a query parameter when opening the demo page in your
browser. This authenticates the chat plugin and enables you to send messages
immediately:

```
http://chatplugin.airy/example?channel_id=<channel_id>
```

You can now type a message in the text box and send it 🎉

<img alt="chatplugin working" src={useBaseUrl('img/getting-started/quickstart/chatplugin.gif')} />

To see how messages are flowing through the system, [list
conversations](/api/endpoints/conversations.md#list) for the channel you have just
created. it should return the message you have just sent.

<img alt="conversations.list" src={useBaseUrl('img/getting-started/quickstart/conversation_list.gif')} />

```bash
curl -H "Content-Type: application/json" -H "Authorization: $token" -d "{}" \
api.airy/conversations.list | jq .
```

You can also consume the messages directly from the Kafka
`application.communication.messages` topic:

```
cd infrastructure && vagrant ssh
kubectl exec -it kafka-0 -- /bin/bash
kafka-console-consumer \
--bootstrap-server airy-cp-kafka:9092 \
--topic application.communication.messages \
--from-beginning
```

<img alt="Kafka Topic" src={useBaseUrl('img/getting-started/quickstart/messages_topic.gif')} />
