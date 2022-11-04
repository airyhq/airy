---
title: Suggested replies with Rasa
sidebar_label: Rasa Suggested Replies
---

import useBaseUrl from '@docusaurus/useBaseUrl';

:::note Prerequisites

This guide assumes that you completed the [Rasa Chat assistant guide](/conversational-ai-connectors/integrations/rasa-assistant.md), which means you have:

- a running Airy Core instance
- a Rasa setup connected to that instance with a custom channel (see the [demo repository](https://github.com/airyhq/rasa-demo))

:::

## How it works

<img alt="see suggested replies in the Airy inbox when receiving a contact greeting"
src={useBaseUrl('img/integrations/rasa/suggested-replies.gif')} />

Chatbots can serve a wide variety of use cases like answering frequently asked questions or booking flows.
Customer support however often requires a human agent to serve user questions with a high degree of quality. With Airy
Core you can get the best of both worlds by using NLP frameworks like Rasa to suggest a set of replies to the agent.
This way agents can handle the vast majority of use cases with the click of a button (see screenshot).

## Configuring Rasa

- [Step 1: Add a custom response type](#step-1-add-a-custom-response-type)
- [Step 2: Update the user stories](#step-2-update-the-user-stories)
- [Step 3: Extend the Airy connector](#step-3-extend-the-airy-connector)
- [Step 4: Retrain and restart](#step-4-consume-directly-from-apache-kafka)

### Step 1: Add a custom response type

The easiest way to instruct Rasa to suggest replies for user messages is by adding them as a [custom response type](https://rasa.com/docs/rasa/responses/#custom-output-payloads). To do this we add the following block to the `responses` section in our `domain.yaml`:

```yaml
responses:
  utter_suggest_greet:
    - custom:
        suggest-informal:
          content:
            text: "Hey, what's up?"
        suggest-formal:
          content:
            text: "Hi, what can I help you with?"
```

### Step 2: Update the user stories

Now we can use this new response type in our `stories.yaml` to let the bot know when to suggest replies:

```yaml
stories:
  - story: happy path
    steps:
      - intent: greet
      - action: utter_suggest_greet
      - intent: mood_great
      - action: utter_happy
```

### Step 3: Extend the Airy connector

Now we need to update our [custom Rasa connector](https://rasa.com/docs/rasa/connectors/custom-connectors/) for Airy Core to this response type. For
this we extend the [send_response method](https://github.com/airyhq/rasa-demo/blob/4f2fdd6063385cea805f2d70755733de347e8792/channels/airy.py#L32) in the Airy connector so that it calls the [suggest replies API](/api/endpoints/messages#suggested-replies) whenever
it encounters a custom response payload:

```python
async def send_response(self, recipient_id: Text, message: Dict[Text, Any]) -> None:
    headers = {
        "Authorization": self.system_token
    }
    if message.get("custom"):
        body = {
            "message_id": self.last_message_id,
            "suggestions": message.get("custom")
        }
        requests.post("{}/messages.suggestReplies".format(self.api_host), headers=headers, json=body)
    elif message.get("text"):
        body = {
            "conversation_id": recipient_id,
            "message": {
                "text": message.get("text")
            }
        }
        requests.post("{}/messages.send".format(self.api_host), headers=headers, json=body)
```

### Step 4: Retrain and restart

Now we need to stop the server and retrain the model:

```shell script
rasa train
```

Finally, we start the Rasa server, open the Airy Inbox (at `http://localhost` for local deployments), where we should
see the suggested replies whenever a contact greets us (see gif above).
