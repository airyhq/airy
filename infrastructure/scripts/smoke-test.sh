#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'


function apiCall {
  local endpoint=$1
  local request_response=$2
  local expected_http_response_code=$3
  local token=${4:-no-auth}
  local url="api.airy/${endpoint}"

  if [ "$token" = "no-auth" ]; then
      response=$(curl -H ${content_type} -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_response} 2>&1)
    else
      response=$(curl -H ${content_type} -H "Authorization: $token" -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_response} 2>&1)
      # >&2 echo curl -H ${content_type} -H "Authorization: $token" -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_response} 2>&1

  fi
  response_http_code=$(head -1 <<< "$response")
  response_response=$(tail -1 <<< "$response")

  if [ "${response_http_code}" != "${expected_http_response_code}" ]; then
    >&2 echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_response}
}

function getValueFrom {
  local payload=$(tail -1 <<< "$1")
  echo $payload | jq -r ".$2"
}

login_response=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200)

token=$(echo $login_response | jq -r '.token')

channels_connect_response=$(apiCall "channels.connect" '{"source": "chat_plugin", "source_channel_id": "my-chat-channel-1", "token": "wat", "name": "chat plugin source", "image_url": ""}' 200 ${token})
channels_list=$(apiCall "channels.list" '{}' 200 ${token})
channels_explore=$(apiCall "channels.explore" '{}' 200 ${token})
channel_id=$(getValueFrom $channels_connect_response "id")


chatplugin_authenticate_response=$(apiCall "chatplugin.authenticate" "{\"channel_id\": \"$channel_id\"}" 200 ${token})
chatplugin_token=$(getValueFrom $chatplugin_authenticate_response "token")

chatplugin_send_response=$(apiCall "chatplugin.send" '{"message": {"text": "Message from chatplugin"}}' 200 ${chatplugin_token})

conversation_list_response=$(apiCall "conversations.list" '{}' 200 ${token})
conversation_id=$(getValueFrom $conversation_list_response "data[0].id")
conversations_info_response=$(apiCall "conversations.info" "{\"conversation_id\": \"$conversation_id\"}" 200 ${token})
conversations_read_response=$(apiCall "conversations.read" "{\"conversation_id\": \"$conversation_id\"}" 202 ${token})


messages_send_response=$(apiCall "messages.send" "{\"conversation_id\": \"$conversation_id\"}, \"message\":{\"text\": \"Response from Airy\"}" 200 ${token})
messages_list_response=$(apiCall "messages.list" "{\"conversation_id\": \"$conversation_id\"}" 200 ${token})

tags_create_response=$(apiCall "tags.create" '{"name": "tag-1", "color":"tag-red"}' 201 ${token})
tag_id=$(getValueFrom $tags_create_response "id")
tags_update_response=$(apiCall "tags.update" "{\"id\":\"$tag_id\", \"name\": \"tag-1\", \"color\": \"tag-blue\"}" 200 ${token})
tags_list_response=$(apiCall "tags.list" '{}' 200 ${token})
tags_delete_response=$(apiCall "tags.delete" "{\"id\": \"$tag_id\"}" 200 ${token})

webhooks_subscribe_response=$(apiCall "webhooks.subscribe" '{}' 200 ${token})
webhooks_unsubscribe_response=$(apiCall "webhooks.unsubscribe" '{}' 200 ${token})
webhooks_info_response=$(apiCall "webhooks.info" '{}' 200 ${token})


users_password_response=$(apiCall "users.password-reset" '{}' 200 ${token})

channels_disconnect=$(apiCall "channels.disconnect" "{\"channel_id\": \"$channel_id\"}" 200 ${token})
