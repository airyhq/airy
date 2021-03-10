---
title: Chat Plugin
sidebar_label: Chat Plugin
---

Refer to our [Chat Plugin introduction](sources/chatplugin/overview.md) for
more information.

The HTTP api adheres to standards laid out in the [core
API](/api/introduction#authentication).

### Authenticating web users

`POST /chatplugin.authenticate`

The request returns an authentication token that needs to be included in the
WebSocket connection handshake.

You can either pass the `channel_id` for a new conversation or a `resume_token` that was obtained in a
previous conversation using the [resume endpoint](#get-a-resume-token).

**Sample request**

```json5
{
  "channel_id": "09816fe0-7950-40cb-bf60-adfa0d6d0679"
}
```

**Sample response (New conversation)**

```json5
{
  "token": "jwt",
  "messages": []
}
```

**Sample response (Resumed conversation)**

```json5
{
  "token": "jwt",
  "messages": [
    {
      "id": "{UUID}",
      "content": {"text": "Hello World"},
      // source message payload
      "state": "{String}",
      // delivery state of message, one of PENDING, FAILED, DELIVERED
      "sender_type": "{string/enum}",
      // See glossary
      "sent_at": "{string}",
      //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
      "metadata": {
        "sentFrom": "iPhone"
      }
      // metadata object of the message
    }
  ]
}
```

### Get a resume token

`POST /chatplugin.resumeToken`

You must set the `token` obtained on the [authorization
endpoint](#authenticating-web-users) as an `Authorization` header.

**Sample request**

```json5
{}
```

**Sample response**

```json5
{
  "resume_token": "jwt auth token"
}
```

#### Send message

You must set the `token` obtained on the [authorization endpoint](#authenticating-web-users) as an `Authorization`
header.

`POST /chatplugin.send`

**Sample request**

```json5
{
  "message": {
    "text": "{String}"
  }
}
```

**Sample response**

```json5
{
  id: "{UUID}",
  "content": {"text": "Hello World"},
  // source message payload
  state: "{String}",
  // delivery state of message, one of PENDING, FAILED, DELIVERED
  sender_type: "{string/enum}",
  // See glossary
  sent_at: "{string}",
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  "metadata": {
    "sentFrom": "iPhone"
  }
  // metadata object of the message
}
```

## WebSocket API

Connection and standards are the same as for the [WebSocket server
API](api/websocket.md). The authorization token is obtained from the
[authentication endpoint](#authenticating-web-users).

The WebSocket connection endpoint is at `/ws.chatplugin`.

### Receive message

`/user/queue/message`

**Sample payload**

```json5
{
  message: {
    id: "{UUID}",
    "content": {"text": "Hello World"},
    // source message payload
    state: "{String}",
    // delivery state of message, one of PENDING, FAILED, DELIVERED
    sender_type: "{string/enum}",
    // See glossary
    sent_at: "{string}",
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
    "metadata": {
      "sentFrom": "iPhone"
    }
    // metadata object of the message
  }
}
```
