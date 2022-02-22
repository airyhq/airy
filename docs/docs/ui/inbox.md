---
title: Inbox
sidebar_label: Inbox
---

import ButtonBox from "@site/src/components/ButtonBox";
import AiryBubbleSVG from "@site/static/icons/airyBubble.svg";
import PriceTag from "@site/static/icons/priceTag.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

## Introduction

Airy’s Inbox gives you a UI for all of your conversations.

See all conversations from the sources you connected, regardless of whether they come via the [Live Chat Plugin](sources/chatplugin/overview.md), [Facebook Messenger](sources/facebook.md), [Google’s Business Messages](sources/google.md), [SMS](sources/sms-twilio.md), [WhatsApp](sources/whatsapp-twilio.md) or a custom source.

The inbox supports not only text messages but a variety of different message types.

:::warning

Authentication is disabled by default in the Inbox UI component of `Airy Core`.

As this is suitable **only for testing purposes**, we advise you to refer to our [Authentication configuration section](/getting-started/installation/security).

:::

## Message Types

**Send & Receive Messages**

You and your team members can use the inbox to receive and send messages from different sources.
Each of these sources have different character limits.

**Facebook Templates**

A template is a simple structured message that can include a title, subtitle, image, and up to three buttons.
Airy’s Inbox supports all templates that Facebook supports, from [Generic Templates](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic) to [Button Templates](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button).

**Sample Button Template Message**

<img alt="Button Template Example" src={useBaseUrl('img/ui/FacebookButtonTemplate.png')} />

**Sample request**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to do next?",
        "buttons": [
          {
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "Visit Messenger"
          },
          {
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "Visit Website"
          },
          {
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "Test Button"
          }
        ]
      }
    }
  }
}
```

**Google’s Rich Cards**

Rich Cards are Google’s templates: a simple structured message that can include a title, description, media and up to 4 suggested replies (buttons).
Airy’s Inbox supports all [Google’s Rich Cards variants from Rich Cards to Carousels](https://developers.google.com/business-communications/business-messages/guides/build/send).

**Sample request**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
  "message": {
    "fallback": "Hello, world!\n\nReply with \"A\" or \"B\"",
    "richCard": {
      "standaloneCard": {
        "cardContent": {
          "title": "Hello, world!",
          "description": "Sent with Business Messages.",
          "media": {
            "height": "TALL",
            "contentInfo": {
              "altText": "Google logo",
              "fileUrl": "https://picsum.photos/200",
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

**Render Templates for Chat Plugin**

Airy’s Live Chat Plugin supports templates too. The template payload is the same as for Google Rich Cards.
This enables you and your team to interact with your website visitors in a richer way, and also enables chat bots in the templates.

<ButtonBox
icon={<AiryBubbleSVG />}
title='Airy Live Chat Plugin'
description='The Airy Live Chat Plugin enables conversations with website visitors through a web chat plugin'
link='sources/chatplugin/overview'
/>
<br/>

**Sample Rich Card Carousel Message**

<img alt="Rich Card Carousel Example" src={useBaseUrl('img/ui/RichCardCarousel.gif')} />

**Sample request**

```json5
{
  "conversation_id": "a688d36c-a85e-44af-bc02-4248c2c97622",
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

## Search and filter

**Search**

Search makes it easy to find the conversations you are looking for.

The inbox enables you to search by:

- Name
- Tags

<ButtonBox
icon={<PriceTag />}
title='Tags'
description='Tag your conversations for easy filtering, searching & segmenting'
link='ui/tags'
/>
<br/>

**Filter**

Filtering enables you to only show conversations in the inbox according to the
filter currently set.

The inbox can filter by:

- Read/Unread Conversations
- Sources
- Tags

<img alt="Filter Inbox" src={useBaseUrl('img/ui/FilteringInbox.gif')} />
