---
title: Message Types
sidebar_label: Message Types
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<table>
<thead>
<tr>
<th>Payload</th><th>Preview</th></tr>
</thead>
<tbody>
<tr>
<td>
<br/>
Text
<br/>
<br/>

```json
{
  "conversation_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
  "message": {
    "text": "Welcome!"
  }
}
```

</td>
<td>
<img alt="Text Message Preview" src={useBaseUrl('img/sources/chatplugin/textMessagePreview.png')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
Image
<br/>
<br/>

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
<td>
<img alt="Text Message Preview" src={useBaseUrl('img/sources/chatplugin/ImageMessagePreview.png')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
Video
<br/>
<br/>

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
<td>
<img alt="Text Message Preview" src={useBaseUrl('img/sources/chatplugin/videoMessagePreview.png')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
File
<br/>
<br/>

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
<td>
<img alt="Text Message Preview" src={useBaseUrl('img/sources/chatplugin/fileMessagePreview.png')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
Audio
<br/>
<br/>

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
<td>
<img alt="Rich Card Example" src={useBaseUrl('img/ui/richCardChatpluginExample.gif')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
RichText
<br/>
<br/>

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
<td>
<img alt="Rich Card Example" src={useBaseUrl('img/ui/richCardChatpluginExample.gif')} />
</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
RichCard
<br/>
<br/>

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
</tbody>
<tbody>
<tr>
<td>
<br/>
RichCardCarousel
<br/>
<br/>

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
</tbody>
<tbody>
<tr>
<td>
<br/>
QuickReplies
<br/>
<br/>

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
<td>text</td>
</tr>
</tbody>
<tbody>
<tr>
<td>
<br/>
SuggestionReponse
<br/>
<br/>

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
<td>text</td>
</tr>
</tbody>
</table>
