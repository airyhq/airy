#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

content_type='Content-Type: application/json'

API_URL=http://${HOST}:${PORT}

function apiCall {
  local endpoint=$1
  local request_payload=$2
  local expected_http_response_code=$3
  local token=$4

  url=${API_URL}/$1
  if [ $token == "no-auth" ]
    then
      auth=""
    else
      auth="-H \"Authorization: $token\""
  fi
  response=$(curl -H ${content_type} ${auth} -s -w "%{stderr}%{http_code}\n" ${url} -d ${request_payload} 2>&1)

  response_http_code=$(head -1 <<< "$response")
  response_payload=$(tail -1 <<< "$response")

  if [ ${response_http_code} != ${expected_http_response_code} ]; then
    >&2 echo "${url} response code was ${response_http_code}. expected: ${expected_http_response_code}"
    exit
  fi

  echo ${response_payload}
}

login_payload=$(apiCall "users.login" '{"email":"grace@example.com","password":"the_answer_is_42"}' 200 "no-auth")

token=$(echo $login_payload | jq -r '.token')

# conversation_list_payload=$(apiCall "conversations.list" '{}' 200)
