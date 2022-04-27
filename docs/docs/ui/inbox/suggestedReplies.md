---
title: Suggested Replies
sidebar_label: Suggested Replies
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import BoltSVG from "@site/static/icons/bolt.svg";
import RasaSVG from "@site/static/icons/rasa.svg";

<TLDR> Suggested Replies allow you to add predefined responses to conversation messages, thus improving the response time and the overall communication experience.</TLDR>

Suggested Replies are text replies that you can add to any message via the HTTP API. The suggested replies of the last 5 messages of a given conversation are considered for suggestion.

As soon as suggested replies have been successfully added to a message (i.e. the API request returned a 200 response), a Suggestions button appears at the top left of the input in the messages list of the conversation's UI, enabling the user to choose a suggested reply as an answer.

The screenshot below shows a sample conversation in the UI of an Airy Core instance: two suggested replies have been added to the contact's last message ('Great that it worked. Is there anything else you need?' and 'Have a nice day!'). The user clicks on the Suggestions button at the top left of the conversation's input and selects the suggested reply 'Have a nice day!'.

<img alt="suggestedReplies" src={useBaseUrl('img/ui/suggested-replies.gif')}/>

## API request to add suggested replies

<ButtonBox
icon={<BoltSVG />}
title='Suggest replies endpoint'
description='Send suggested replies to your Airy Core instance through the messages.suggestReplies endpoint'
link='api/endpoints/messages#suggest-replies'
/>

<br />

import SuggestReplies from '../../api/endpoints/suggest-replies.mdx'

<SuggestReplies />

## Integration with Rasa for further message automation

You can integrate the open-source machine learning framework Rasa to automate sending messages on your Airy Core instance.

<ButtonBox
icon={<RasaSVG />}
title='Rasa integration'
description='Configure Rasa to receive and reply to messages using Airy'
link='integrations/rasa-assistant'
/>
