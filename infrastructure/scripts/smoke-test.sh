#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'


function apiCall {
  local endpoint=$1
  local request_payload=$2
  local expected_http_response_code=$3
  local token=${4:-no-auth}
  local url="api.airy/${endpoint}"

  if [ "$token" = "no-auth" ]; then
      response=$(curl -H ${content_type} -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)
    else
      response=$(curl -H ${content_type} -H "Authorization: $token" -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)
      >&2 echo curl -H ${content_type} -H "Authorization: $token" -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1

  fi
  response_http_code=$(head -1 <<< "$response")
  response_payload=$(tail -1 <<< "$response")

  if [ "${response_http_code}" != "${expected_http_response_code}" ]; then
    >&2 echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_payload}
}

login_payload=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200)

token=$(echo $login_payload | jq -r '.token')

channels_connect=$(apiCall "channels.connect" '{"source": "chat_plugin", "source_channel_id": "my-chat-channel-1", "token": "wat", "name": "chat plugin source", "image_url": ""}' 200 ${token})
channels_connect_payload=$(tail -1 <<< "$channels_connect")
channel_id=$(echo $channels_connect_payload | jq -r '.id')
chatplugin_authenticate_payload=$(apiCall "chatplugin.authenticate" "{\"channel_id\": \"$channel_id\"}" 200 ${token})
exit


conversation_list_payload=$(apiCall "conversations.list" '{}' 200 ${token})
conversations_info_payload=$(apiCall "conversations.info" '{}' 200 ${token})
conversations_read_payload=$(apiCall "conversations.read" '{}' 200 ${token})


channels_list=$(apiCall "channels.list" '{}' 200 ${token})
channels_disconnect=$(apiCall "channels.disconnect" '{}' 200 ${token})
channels_explore=$(apiCall "channels.explore" '{}' 200 ${token})

webhooks_subscribe_payload=$(apiCall "webhooks.subscribe" '{}' 200 ${token})
webhooks_unsubscribe_payload=$(apiCall "webhooks.unsubscribe" '{}' 200 ${token})
webhooks_info_payload=$(apiCall "webhooks.info" '{}' 200 ${token})

tags_create_payload=$(apiCall "tags.create" '{}' 200 ${token})
tags_update_payload=$(apiCall "tags.update" '{}' 200 ${token})
tags_list_payload=$(apiCall "tags.list" '{}' 200 ${token})
tags_delete_payload=$(apiCall "tags.delete" '{}' 200 ${token})

users_password_payload=$(apiCall "users.password-reset" '{}' 200 ${token})
messages_list_payload=$(apiCall "messages.list" '{}' 200 ${token})
messages_send_payload=$(apiCall "messages.send" '{}' 200 ${token})
