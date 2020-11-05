#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'

API_URL=https://${HOST}:${PORT}

function apiCall {
  local endpoint=$1
  local request_payload=$2
  local expected_http_response_code=$3

  url=${API_URL}/$1
  response=$(curl -H ${content_type} -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)

  response_http_code=$(head -1 <<< "$response")
  response_payload=$(tail -1 <<< "$response")

  if [ ${response_http_code} != ${expected_http_response_code} ]; then
    echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_payload}
}

login_payload=$(apiCall "login-via-email" '{"email":"luca@airy.co","password":"validpassword"}' 200)

token=$(echo $login_payload | jq -r '.token')

echo $token

conversation_list_payload=$(apiCall "/conversations" '{}' 200)
