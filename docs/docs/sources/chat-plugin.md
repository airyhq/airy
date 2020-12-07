---
title: Chat Plugin
sidebar_label: Chat Plugin
---

The Airy Core chat plugin is a fully-featured [source](/glossary.md#source)
that enables conversations with anonymous website visitors through a web chat
plugin.

This document covers how to connect a chat plugin as as
[source](/glossary.md#source), how to install the chat plugin web widget, and
the HTTP and WebSocket APIs that power it.

## Connecting a channel

Connects a chat plugin source to the Airy Core Platform.

```
POST /channels.connect
```

- `source` _must_ be `chat_plugin`
- `source_channel_id` is a unique identifier of your choice

```json5
{
  "source": "chat_plugin",
  "source_channel_id": "website-identifier-42"
}
```

**Sample Response**

```json5
{
  "id": "channel-uuid-1",
  "name": "Chat plugin",
  "source": "chat_plugin",
  "source_channel_id": "awesome-website-42"
}
```

## Installation

To install the chat plugin UI on your website add the following script tag to
the `<head>` section:

```html
<script>
  (function(w, d, s, n) {
    w[n] = w[n] || {};
    w[n].cid = "CHANNEL_ID";
    w[n].h = "SCRIPT_HOST";
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s);
    j.async = true;
    j.src = w[n].h + "/s.js";
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "airy");
</script>
```

You must replace `CHANNEL_ID` with the channel id obtained when
[connecting](#connecting-a-channel) the source and `SCRIPT_HOST` with the host
of your chat plugin server. When using the local vagrant environment
`SCRIPT_HOST` must be set to `chatplugin.airy`.

:::note
`chatplugin.airy` is not publicly accessible. The setup will only work for local web pages.
:::

To test the setup, replace the `CHANNEL_ID` in the URL
`http://chatplugin.airy/example.html?channel_id=CHANNEL_ID` and open it in your
browser.

## HTTP API

The HTTP api adheres to standards laid out in the [core
API](api/http.md#introduction).

### Authenticating web users

`POST /chatplugin.authenticate`

The request returns an authentication token that needs to be included in the
WebSocket connection handshake.

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

You must set the `token` obtained on the [authorization endpoint](#authenticating-web-users) as an `Authorization`
header.

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
  content: {
    text: "{String}",
    type: "text"
    // Determines the schema of the content
  },
  state: "{String}",
  // delivery state of message, one of PENDING, FAILED, DELIVERED
  sender_type: "{string/enum}",
  // See glossary
  sent_at: "{string}"
  //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
}
```

## WebSocket API

Connection and standards are the same as for the [WebSocket server
API](api/websocket.md). The authorization token is obtained from the
[authentication endpoint](#authenticating-web-users).

The WebSocket connection endpoint is at `/ws.chatplugin`.

### Receive message

`/user/queue/message`

**Sample Payload**

```json5
{
  message: {
    id: "{UUID}",
    content: "{String}",
    // source content string
    state: "{String}",
    // delivery state of message, one of PENDING, FAILED, DELIVERED
    sender_type: "{string/enum}",
    // See glossary
    sent_at: "{string}"
    //'yyyy-MM-dd'T'HH:mm:ss.SSSZ' date in UTC form, to be localized by clients
  }
}
```
