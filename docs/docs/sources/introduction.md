---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import AiryBubbleSVG from "@site/static/icons/airy-bubble.svg";
import FacebookMessengerSVG from "@site/static/icons/facebook-messenger.svg";
import GoogleSVG from "@site/static/icons/google.svg";
import WhatsAppSVG from "@site/static/icons/whatsapp.svg";
import SmsSVG from "@site/static/icons/sms.svg";

<TLDR>

Airy Core allows you to connect **many different sources**: our Live Chat
Plugin, Facebook Messenger, WhatsApp, your own custom sources.

</TLDR>

One of the crucial features Airy Core provides is the ability to process
conversational data from a variety of sources (like Facebook Messenger, Google
Business Messages, and so on).

## Sources guides

<ButtonBoxList>
<ButtonBox
    icon={() => <AiryBubbleSVG />}
    title='Airy Live Chat Plugin'
    description='The Airy Live Chat Plugin enables conversations with website visitors through a web chat plugin'
    link='/sources/chat-plugin'
/>

<ButtonBox
icon={() => <FacebookMessengerSVG />}
title='Facebook Messenger'
description='Send and receive messages from Facebook Pages'
link='sources/facebook'
/>

<ButtonBox
icon={() => <GoogleSVG />}
title='Google’s Business Messages'
description='Start conversations from Google Maps & Google Search'
link='sources/google'
/>

<ButtonBox
icon={() => <WhatsAppSVG />}
title='WhatsApp Business API'
description='Connect with more than 1.5 billion people on WhatsApp'
link='sources/whatsapp-twilio'
/>

<ButtonBox
icon={() => <SmsSVG />}
title='SMS'
description='Connect Text Messaging to Airy & send and receive SMS'
link='sources/sms-twilio'
/>
</ButtonBoxList>

## How it works

The ingestion platform processes incoming webhook data from different sources.
It then makes sense of the data and reshapes it into source independent
contacts, conversations, and messages (see our
[glossary](/getting-started/glossary.md) for definitions).

Of course, due the very nature of the problem, the code is very specific to the
thirty-party source it deals with. This frees you from dealing with these
integrations yourself.

While sources are all different, their architecture follows a few key
principles:

- The webhook integration ingests payload data as raw as you get it in a source
  specific topic.

- We only extracts metadata from the source data as we translate events into
  conversations and messages, the content is not parsed at ingestion time, we let
  it travel untouched through the system.

These principles allow you to reprocess data from a conversation platform at any
given point time. If the data pipeline has a bug, say the messages are counted
incorrectly, you can reprocess the data and fix a bug for past data as well.
