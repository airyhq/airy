---
title: Cognigy AI
sidebar_label: Cognigy AI
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

Cognigy.AI was developed in order to overcome most of the challenges in building conversational AIs. One of the unique aspects of the platform, is the bundling of - conversational AI related resources - in a user-friendly interface.

- From the [Cognigy.AI documentation](https://docs.cognigy.com/ai/platform-overview/)

</TLDR>

:::tip What you will learn

- The required steps to configure your Cognigy.AI agent
- How to connect Cognigy.AI to Airy Core

:::

## Step 1: Create a Cognigy.AI Live Agent

The first step is to create an account on the [Cognigy.AI platform](https://www.cognigy.com/products/cognigy-ai). Next, create a Live Agent: this [guide](https://docs.cognigy.com/ai/resources/agents/agents/) from the Cognigy.AI documentation details the necessary steps.

## Step 2: Create a Cognigy.AI Flow

The second step is to create a Flow on the Cognigy.AI platform: follow this [guide](https://support.cognigy.com/hc/en-us/articles/360014524180-Design-a-Flow-and-add-a-Message#-3-tell-the-va-what-to-say-0-2) from the Cognigy.AI documentation.

Here is a screenshot of a simple Cognigy.AI Flow:

<img alt="Cognigy.AI Flow" src={useBaseUrl('img/integrations/cognigy/flowSample.png')} />

## Step 3: Create a Cognigy.AI REST Endpoint

<TLDR>

The REST Endpoint lets you connect to a Cognigy Flow directly through a REST interface.

- From the [Cognigy.AI documentation](https://docs.cognigy.com/ai/resources/deploy/endpoints)

</TLDR>

On your agent dashboard on the Cognigy.AI platform, select `Endpoints` from the `Build` section of the sidebar menu. Click on the button `+ New Endpoint`: this will trigger a configuration menu to open.

Type a name for this Endpoint, select the Flow you previously created in the `Flow` dropdown, select `REST` from the `Endpoint Type` list (scroll down to find the REST type) and click on the `Save` button to save this configuration.

Note down your REST Endpoint URL, you will need it later on for the [step 6](/integrations/cognigy-ai#step-6-option-1-install-and-configure-cognigyai-to-your-airy-instance-via-api-request).

## Step 4: Create an API key

We now need to create an API key in order to use the [Cognigy.AI API](https://docs.cognigy.com/ai/developer-guides/using-api/#valid-api-key).

Click on the avatar icon on the top right navigation menu and select `My Profile` in the dropdown.
On your profile page, scroll down to the API Keys section and click on the `+` icon to generate a new API Key.

Note down your API key, you will need it in the next step.

## Step 5: Find your Cognigy.AI user ID

One way to get your Cognigy.AI user ID is to use the Cognigy.AI API sending a GET request to `/flows`.

Navigate to the [Cognigy.AI Open API](https://api-trial.cognigy.ai/openapi): this interface enables us to easily use the Cognigy.AI's RESTful web services.

Paste the API Key you generated in the previous step in the Authentication's API Key input (below `Send api_key in query with the given value`).

Then, scroll down to [GET /flows](https://api-trial.cognigy.ai/openapi#get-/v2.0/flows) and click on the `TRY` button.

You should get a `200` Response status along with the Flow's data as the response body. The `createdBy` string is your user ID: note it down, you will need it in the next step.

<SuccessBox>

Congratulations! You are now ready to connect Cognigy.AI to your Airy Core instance 🎉

</SuccessBox>
<br />

Connecting Cognigy.AI to your Airy Core instance can be done through API request or
through the [Airy Control Center UI](/ui/control-center/introduction).

We cover both options in this section: keep reading for connecting Cognigy.AI via
API request, scroll down to the next section for connecting Cognigy.AI via the [Airy Control Center UI](/ui/control-center/introduction).

## Step 6 (option 1): Install and configure Cognigy.AI to your Airy instance via API request

To install Cognigy.AI send a request to the [Components Install endpoint](/api/endpoints/components#install).

The request body should be:

```json
{
  "name": "airy-core/cognigy-connector"
}
```

Once the installation is successful, update the component's configuration with the [Components Update endpoint](/api/endpoints/components#update).

Use the REST Endpoint URL and User ID you got in the previous steps ([step 3](/integrations/cognigy-ai#step-3-create-a-cognigyai-rest-endpoint) and [step 5](/integrations/cognigy-ai#step-5-find-your-cognigyai-user-id)) to compose the request body:

```json
{
  "components": [
    {
      "name": "cognigy-connector",
      "enabled": true,
      "data": {
        "restEndpointUrl": "yourRestEndpointUrl",
        "userId": "yourUserID"
      }
    }
  ]
}
```

The request is considered successful if `cognigy-connector` is returned in the list of configured components and the request status code is `200`.

```json
{
  "components": {
    "cognigy-connector": true
  }
}
```

Cognigy.AI is now installed and configured.

## Step 6 (option 2): Install and configure Cognigy.AI to your Airy instance via the Control Center UI

On the [Airy Control Center UI](/ui/control-center/introduction), navigate to the [Catalog](/ui/control-center/catalog) and select Cognigy.AI. Click on the `Install` button.

Once the installation is completed, navigate to the [Control Center's Connectors page](/ui/control-center/connectors) and select Cognigy.AI: this will open the connector's configuration page.

Paste the `REST Endpoint URL` and `User ID` you got in the previous steps ([step 3](/integrations/cognigy-ai#step-3-create-a-cognigyai-rest-endpoint) and [step 5](/integrations/cognigy-ai#step-5-find-your-cognigyai-user-id))
in the respective fields and save this configuration.

Cognigy.AI is now installed and configured.

## Step 7: Cognigy.AI's connection with Airy

Write a message to one of your channels: Airy Core will
forward it to your Cognigy.AI installation, which will respond according to the Cognigy.AI Flow
using the Airy Core API.

The screenshot below was taken on an instance's [Airy Core Inbox UI](/ui/inbox/introduction). It shows an example where a message sent to Airy Core is automatically responded to according to a [Cognigy.AI Flow](/integrations/cognigy-ai#step-2-create-a-cognigyai-flow) where the Live Agent responds "Hello from Cognigy!👋" to a contact's first message.

<img alt="Cognigy.AI Airy connection" src={useBaseUrl('img/integrations/cognigy/messagingExample.png')} />
