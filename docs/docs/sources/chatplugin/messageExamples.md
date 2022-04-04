---
title: Message Types
sidebar_label: Message Types
---

import useBaseUrl from '@docusaurus/useBaseUrl';

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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "attachment": {
            "type": "image",
            "payload": {
                "url": "https://xxxxxxxx.jpg"
            }
        }
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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "attachment": {
            "type": "video",
            "payload": {
                "url": "https://xxxxxxxx.mp4"
            }
        }
    }
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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "attachment": {
            "type": "file",
            "payload": {
                "url": "https://xxxxxxxx.pdf"
            }
        }
    }
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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "attachment": {
            "type": "audio",
            "payload": {
                "url": "https://xxxxxxxx.mp3"
            }
        }
    }
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
      "text":"xxx",
      "fallback":"xxx",
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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "fallback": "xxxxx",
        "richCard": {
            "standaloneCard": {
                "cardContent": {
                    "title": "Hello, world!",
                    "description": "Sent with Business Messages.",
                    "media": {
                        "height": "TALL",
                        "contentInfo": {
                            "altText": "xxxx",
                            "fileUrl": "https://xxxxxxxx.png",
                            "forceRefresh": "false"
                        }
                    },
                    "suggestions": [
                        {
                            "reply": {
                                "text": "Suggestion #1",
                                "postbackData": "suggestion_1"
                            }
                        },
                        {
                            "reply": {
                                "text": "Suggestion #2",
                                "postbackData": "suggestion_2"
                            }
                        }
                    ]
                }
            }
        }
    }
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
        "fallback": "xxx",
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
                                "fileUrl": "https://xxxxxxxx.png",
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
                                "fileUrl": "https://xxxxxxxx.png",
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

  type: 'quickReplies';
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];

```json
{
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "type": "quickReplies",
        "text": "xxx",
        "attachment": "xxx",
        "quickReplies": "xxx"
    }
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
    "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "message": {
        "type": "suggestionResponse",
        "text": "xxx",
        "postbackData": "xxx"
    }
}
```

</td>
<td> text </td>
</tr>
</table>
