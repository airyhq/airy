#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
SCRIPT_PATH=$(dirname ${BASH_SOURCE[0]})
source ${SCRIPT_PATH}/lib/api.sh

login_response=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200)

token=$(echo $login_response | jq -r '.token')

channels_connect_response=$(apiCall "channels.connect" '{"source": "chat_plugin", "source_channel_id": "my-chat-channel-1", "token": "wat", "name": "chat plugin source", "image_url": ""}' 200 ${token})
sleep 1
channel_id=$(extractFromPayload $channels_connect_response "id")

echo "created channed ${channel_id}"

channels_list=$(apiCall "channels.list" '{}' 200 ${token})
channels_explore=$(apiCall "channels.explore" '{"source": "chat_plugin"}' 200 ${token})

chatplugin_authenticate_response=$(apiCall "chatplugin.authenticate" "{\"channel_id\": \"$channel_id\"}" 200 ${token} chatplugin)
chatplugin_token=$(extractFromPayload $chatplugin_authenticate_response "token")

echo "authenticated via chatplugin ${chatplugin_token}"

chatplugin_send_response=$(apiCall "chatplugin.send" '{"message": {"text": "Message from chatplugin"}}' 200 ${chatplugin_token} chatplugin)
chatplugin_message_id=$(extractFromPayload $chatplugin_send_response "id")
sleep 1

conversation_list_response=$(apiCall "conversations.list" '{}' 200 ${token})
conversation_id=$(extractFromPayload $conversation_list_response "data[0].id")

echo "message sent and created conversation ${conversation_id}"

conversation_info_response=$(apiCall "conversations.info" "{\"conversation_id\": \"$conversation_id\"}" 200 ${token})

echo "conversation info response ${conversation_info_response}"

conversations_read_response=$(apiCall "conversations.read" "{\"conversation_id\": \"$conversation_id\"}" 202 ${token})

messages_send_response=$(apiCall "messages.send" "{\"conversation_id\": \"$conversation_id\", \"message\":{\"text\": \"Response from Airy\"}}" 200 ${token})
messages_list_response=$(apiCall "messages.list" "{\"conversation_id\": \"$conversation_id\"}" 200 ${token})

tags_create_response=$(apiCall "tags.create" '{"name": "tag-1", "color":"tag-red"}' 201 ${token})
tag_id=$(extractFromPayload $tags_create_response "id")

echo "tag created ${tag_id}"

conversation_tag_response=$(apiCall "conversations.tag" "{\"conversation_id\": \"$conversation_id\", \"tag_id\": \"${tag_id}\"}" 202 ${token})
conversation_info_response=$(apiCall "conversations.info" "{\"conversation_id\": \"$conversation_id\"}" 200 ${token})

echo "conversation info response ${conversation_info_response}"

tags_update_response=$(apiCall "tags.update" "{\"id\":\"$tag_id\", \"name\": \"tag-1\", \"color\": \"tag-blue\"}" 200 ${token})
tags_list_response=$(apiCall "tags.list" '{}' 200 ${token})
tags_delete_response=$(apiCall "tags.delete" "{\"id\": \"$tag_id\"}" 200 ${token})

webhooks_subscribe_response=$(apiCall "webhooks.subscribe" '{}' 200 ${token})
webhooks_unsubscribe_response=$(apiCall "webhooks.unsubscribe" '{}' 200 ${token})
webhooks_info_response=$(apiCall "webhooks.info" '{}' 200 ${token})

channels_disconnect=$(apiCall "channels.disconnect" "{\"channel_id\": \"$channel_id\"}" 200 ${token})
