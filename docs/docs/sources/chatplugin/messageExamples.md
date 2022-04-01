---
title: Message Types
sidebar_label: Message Types
---

import useBaseUrl from '@docusaurus/useBaseUrl';

To install the Chat Plugin UI on your website add the following script tag to
the `<head>` section:

<table>
<tr>
<td> Message Type </td> <td> Payload </td> <td> Preview </td>
</tr>
<tr>
<td> text </td>
<td>

```json
{
  "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
  "message": {
    "text": "Welcome!"
  }
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> image </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> images </td>
<td>

```json
{
   "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
   "message":{
      "attachments":[
         {
            "type":"video",
            "videoUrl":"https://res.cloudinary.com/dzyccx5om/video/upload/v1612949675/mov_bbb_bfucrc.mp4"
         }
      ]
   }
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> video </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> file </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> audio </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> richText </td>
<td>

```json
{
   "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
   "message":{
      "text":"https://google.fr",
      "fallback":"some string without markdown",
      "containsRichText":"true"
   }
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> richCard </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td>

<img alt="Rich Card Example" src={useBaseUrl('img/ui/richCardChatpluginExample.gif')} />

</td>
</tr>
<tr>
<td> richCardCarousel </td>
<td>

```json
{
  "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
  "message": {
    "fallback": "Card #1\n #1\n\nCard #2\n\n\nReply with \"Card #1\" or \"Card #2\"",
    "richCard": {
      "carouselCard": {
        "cardWidth": "MEDIUM",
        "cardContents": [
          {
            "title": "Card #1",
            "description": "The description for card #1",
            "suggestions": [
              {
                "reply": {
                  "text": "Card #1",
                  "postbackData": "card_1"
                }
              }
            ],
            "media": {
              "height": "MEDIUM",
              "contentInfo": {
                "fileUrl": "https://picsum.photos/id/237/200",
                "forceRefresh": "false"
              }
            }
          },
          {
            "title": "Card #2",
            "description": "The description for card #2",
            "suggestions": [
              {
                "reply": {
                  "text": "Card #2",
                  "postbackData": "card_2"
                }
              }
            ],
            "media": {
              "height": "MEDIUM",
              "contentInfo": {
                "fileUrl": "https://picsum.photos/id/238/200",
                "forceRefresh": "false"
              }
            }
          }
        ]
      }
    }
  }
}
```

</td>
<td> 
<img alt="Rich Card Carousel Example" src={useBaseUrl('img/ui/richCardCarouselChatpluginExample.gif')} />
</td>
</tr>
<tr>
<td> quickReplies </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
<tr>
<td> suggestionResponse </td>
<td>

```json
{
  "id": 10,
  "username": "alanpartridge",
  "email": "alan@alan.com",
  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
  "created_at": "2015-02-14T20:45:26.433Z",
  "updated_at": "2015-02-14T20:45:26.540Z"
}
```

</td>
<td> text </td>
</tr>
</table>

You must replace `CHANNEL_ID` with the channel ID obtained when
[connecting](#connecting-a-channel) the source and `SCRIPT_HOST` with the host
of your Chat Plugin server. When using the local minikube environment
`SCRIPT_HOST` must be set to `airy.core`.

:::note

`airy.core` is not publicly accessible. The setup will only work for local web pages.

:::

To test the setup, replace the `CHANNEL_ID` in the URL
`http://airy.core/chatplugin/ui/example?channel_id=CHANNEL_ID` and open it in your
browser.
