---
title: Chat Plugin
sidebar_label: Chat Plugin
---


The chat plugin allows anonymous website visitors to start a conversation with 
the Airy Core Platform and respond to messages.

This documents offers an overview of the HTTP endpoints and WebSocket queues required for the Airy Chat plugin to function.

- [Introduction](#introduction)
- [HTTP API](#http-api)
  - [Authenticating web users](#authenticating-web-users)
    - [Send message](#send-message)
- [WebSocket API](#websocket-api)
  - [Receive message](#receive-message)

## Introduction

The Airy Core chat plugin is a fully-featured [source](./glossary.md#source)
that enables conversations with anonymous website visitors through a web chat
plugin.

Like for any other source you must connect a channel first using the [channels
connection endpoint](api/http.md#connecting-channels) and setting the `source`
field in the request payload to `chat_plugin`. You can leave the token parameter
empty. 


## HTTP API

The HTTP api adheres to standards laid out in the [core
API](api/http.md#introduction).

### Authenticating web users

`POST /chatplugin.authenticate`

The request returns an authentication token that needs to be included in the WebSocket connection handshake.

**Sample Request**

```json5
{
  "channel_id": "09816fe0-7950-40cb-bf60-adfa0d6d0679"
}
```

**Sample Response**

```json5
{
  "token": "jwt auth token"
}
```

#### Send message

`POST /chatplugin.send`

**Sample Request**

```json5
{
  "message": {
    "text": "{String}"
  }
}
```

**Sample Response**

```json5
{
  id: "{UUID}",
  content: "{String}",
  // source content string
  state: "{String}",
  // delivery state of message, one of PENDING, FAILED, DELIVERED
  alignment: "{string/enum}",
  // LEFT, RIGHT, CENTER - horizontal placement of message
  sent_at: "{string}",
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
}
```

## WebSocket API

Connection and standards are the same as for the [core websocket](api/websocket.md)
except that the authorization token is obtained from the [chatplugin
authentication API](#authenticating-web-users).

The WebSocket endpoint is at `/ws.chatplugin`. 

### Receive message

`/queue/message`

**Sample Payload**

```json5
{
  message: {
      id: "{UUID}",
      content: "{String}",
      // source content string
      state: "{String}",
      // delivery state of message, one of PENDING, FAILED, DELIVERED
      alignment: "{string/enum}",
      // LEFT, RIGHT, CENTER - horizontal placement of message
      sent_at: "{string}",
      //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  }
}
```