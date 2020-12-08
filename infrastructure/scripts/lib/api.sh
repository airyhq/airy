#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'

function apiCall {
  local endpoint=${1}
  local request_payload=${2}
  local expected_http_response_code=${3}
  local token=${4:-no-auth}
  local host=${5:-api}
  local url="${host}.airy/${endpoint}"

  if [ "$token" = "no-auth" ]; then
      response=$(curl -H ${content_type} -s -w "\n%{http_code}\n" ${url} -d ${request_payload} 2>&1)
    else
      response=$(curl -H ${content_type} -H "Authorization: $token" -s -w "\n%{http_code}\n" ${url} -d ${request_payload} 2>&1)
  fi
  response_payload=$(head -1 <<< "${response}")
  response_http_code=$(tail -1 <<< "${response}")

  if [ "${response_http_code}" != "${expected_http_response_code}" ]; then
    >&2 echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_payload}
}

function extractFromPayload {
  local payload=$(tail -1 <<< "${1}")
  echo ${payload} | jq -r ".${2}"
}

function generateChatPluginMessages {
  local id=${1}
  local file=${2}

  while read chatplugin_token
  do
    apiCall "chatplugin.send" "{\"message\": {\"text\": \"You deserve it ${id} !\"}}" 200 ${chatplugin_token} chatplugin
  done < ${file}
}
