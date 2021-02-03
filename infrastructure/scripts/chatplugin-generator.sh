#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_PATH=$(dirname "${BASH_SOURCE[0]}")
# shellcheck source=/dev/null
source "${SCRIPT_PATH}/lib/api.sh"

channels=${CHANNELS:-10}
messages=${MESSAGES:-50}
delay=${DELAY:-0.2}

login_response=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200)
token=$(echo "$login_response" | jq -r '.token')

echo Using token: "$token"

# Create channels
printf "" > /tmp/chatplugin_tokens
for i in seq 1 1 ${channels}
do
	payload="{\"name\": \"my-channel-${i}\"}"
	channels_connect_response=$(apiCall "chatplugin.connect" "${payload}" 200 "${token}")
	channel_id=$(echo "$channels_connect_response" | jq -r '.id')
	chatplugin_authenticate_response=$(apiCall "chatplugin.authenticate" "{\"channel_id\": \"$channel_id\"}" 200 "${token}" chatplugin)
	chatplugin_token=$(extractFromPayload "$chatplugin_authenticate_response" "token")
       
	echo "$chatplugin_token" >> /tmp/chatplugin_tokens
done

# Send messages to all channels
for i in seq 1 1 ${messages}
do
  generateChatPluginMessages "${i}" "/tmp/chatplugin_tokens" &
  sleep "${delay}"
done
