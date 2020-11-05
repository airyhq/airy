#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'

API_URL=https://${HOST}:${PORT}

function apiCall {
  local endpoint=$1
  local request_payload=$2
  local expected_http_response_code=$3
  local token=${4:-no-auth}

  url=${API_URL}/$1
  if [ "$token" = "no-auth" ]; then
      response=$(curl -H ${content_type} -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)
    else
      response=$(curl -H ${content_type} -H "Authorization: $token" -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)
  fi
  response_http_code=$(head -1 <<< "$response")
  response_payload=$(tail -1 <<< "$response")

  if [ ${response_http_code} != ${expected_http_response_code} ]; then
    >&2 echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_payload}
}

login_payload=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200)

token=$(echo $login_payload | jq -r '.token')

conversation_list_payload=$(apiCall "conversations" '{}' 200 ${token})
conversations_info=$(apiCall "conversations.info" '{}' 200 ${token})
conversations_read=$(apiCall "conversations.read" '{}' 200 ${token})

chatplugin_authenticate_payload=$(apiCall "chatplugin.authenticate" '{}' 200 ${token})

channels_list=$(apiCall "channels.list" '{}' 200 ${token})
channels_disconnect=$(apiCall "channels.disconnect" '{}' 200 ${token})
channels_explore=$(apiCall "channels.explore" '{}' 200 ${token})
channels_connect=$(apiCall "channels.connect" '{}' 200 ${token})

webhooks_subscribe=$(apiCall "webhooks.subscribe" '{}' 200 ${token})
webhooks_unsubscribe=$(apiCall "webhooks.unsubscribe" '{}' 200 ${token})
webhooks_info=$(apiCall "webhooks.info" '{}' 200 ${token})

tags_create=$(apiCall "tags.create" '{}' 200 ${token})
tags_update=$(apiCall "tags.update" '{}' 200 ${token})
tags_list=$(apiCall "tags.list" '{}' 200 ${token})
tags_delete=$(apiCall "tags.delete" '{}' 200 ${token})

users_password=$(apiCall "users.password-reset" '{}' 200 ${token})
messages_list=$(apiCall "messages.list" '{}' 200 ${token})
messages_send=$(apiCall "messages.send" '{}' 200 ${token})
