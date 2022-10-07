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

Cognigy.AI's integration with Airy Core enables you to view, interact, and manage
your conversation with your Cognigy.AI agent within the [Airy UI Inbox]().

:::tip What you will learn

- The required steps to configure your Cognigy.AI agent
- How to connect Cognigy.AI to Airy Core

:::

## Step 1: Create a Cognigy.AI Live Agent

The first step is to create an account on the [Cognigy.AI platform]().

Then, create a Live Agent on the Cognigy.AI platform: you can find a detailed step-by-step guide
from the Cognigy.AI documentation [here](https://docs.cognigy.com/ai/resources/agents/agents/).

## Step 2: Create a Cognigy.AI Flow

The second step is to create a Flow on the Cognigy.AI platform: you can find a detailed step-by-step guide
from the Cognigy.AI documentation [here](https://support.cognigy.com/hc/en-us/articles/360014524180-Design-a-Flow-and-add-a-Message#-3-tell-the-va-what-to-say-0-2).

Here is a sample screenshot of a simple Cognigy.AI Flow:

## Step 3: Create a Cognigy.AI REST Endpoint

Next, create a Cognigy.AI REST Endpoint: `The REST Endpoint lets you connect to a Cognigy Flow directly through a REST interface.` according to the [Cognigy.AI documentation](https://docs.cognigy.com/ai/resources/deploy/endpoints).

On your agent dashboard on the Cognigy.AI platform, select `Endpoints` from the `Build` section of the left sidebar menu. Click on the button `+ New Endpoint`: this will trigger a configuration menu to open.

Type a name for this Endpoint, select the Flow you previously created in the `Flow` dropdown, select `Rest`from the list in the `Endpoint Type`list (scroll down to find the Rest type) and click on the `Save` button to save this configuration.

Note down your REST Endpoint URL, you will need it later on.

## Step 4: Create an API key

We now need to create an API key in order to use [Cognigy.AI API](https://docs.cognigy.com/ai/developer-guides/using-api/).

Click on the avatar icon on the top right navigation menu and select `My Profile` in the dropdown.
On your profile page, scroll down to the API Keys section and click on the `+`icon to generate a new API Key.

Note down your API key, you will need it in the next step.

## Step 5: Find your Cognigy.AI user ID

One way to get your Cognigy.AI user ID is to use the Cognigy.AI API sending a GET request to `/flows`.

Navigate to the [Cognigy.AI Open API](https://api-trial.cognigy.ai/openapi): this interface enables us to easily use the Cognigy.AI's RESTful web services.

Paste the API Key you generated in the previous step in the Authentication's API Key input.

<img alt="Authentication with API Key " src={useBaseUrl('img/ui/controlCenterConnectors.png')} />

Then, scroll down to the [`GET /flows` request section](https://api-trial.cognigy.ai/openapi#get-/v2.0/flows) and click on the `TRY` button.

You should get a `200` Response status along with the Flow's data as the response body.
The `createdBy` string is your user ID: note it down, you will need it in the next step.

<img alt="Cognigy.AI Flow info response body" src={useBaseUrl('img/ui/controlCenterConnectors.png')} />
<br />

<SuccessBox>

Congratulations! You are now ready to connect Cognigy.AI to your Airy Core instance 🎉

</SuccessBox>

Connecting Cognigy.AI to your Airy Core instance can be done through API request or
through the [Airy Control Center UI](/ui/control-center/introduction).

We cover both options in this section: keep reading for connecting Cognigy.AI via
API request, scroll down to the next section for connecting Cognigy.AI via the [Airy Control Center UI](/ui/control-center/introduction).

## Install and Configure Cognigy.AI to your Airy instance via API request

To install Cognigy.AI on your instance, send a API request to the [Components Install endpoint](/api/endpoints/components#install).

The request body should be:

```json
{
  "name": "airy-core/cognigy"
}
```

Once the installation is successful (which is specified by a 200 Request status), update the component's configuration with the [Components Update endpoint](api/endpoints/components#update).

Use the REST Endpoint URL and User ID you got in the previous steps (step 3 and step 5) to compose the request body:

```json
{
  "components": [
    {
      "name": "cognigy",
      "enabled": true,
      "data": {
        "restEndpointUrl": "yourRestEndpointUrl",
        "userId": "yourUserID"
      }
    }
  ]
}
```

The request is considered successful if `cognigy` is returned in the list of configured components
and the request status code is `200`.

```json
{
  "components": {
    "cognigy": true
  }
}
```

Cognigy.AI is now installed and configured. Sroll down for the next step: interacting
with your cognigy.AI conversation.

## Install and Configure Cognigy.AI to your Airy instance via the Control Center UI

On the [Airy Control Center UI](/ui/control-center/introduction), navigate to the Catalog and select Cognigy.AI. Click on the `Install` button.

Once the installation is completed, navigate to the [Control Center's Connectors page](/ui/control-center/connectors) and select Cognigy.AI: this will open the connectors' configuration page.

Paste the REST Endpoint URL and User ID you got in the previous steps (step 3 and step 5)
in the respective fields and save this configuration.

Cognigy.AI is now installed and configured: the next step is interacting with your cognigy.AI conversation.

## Interact with your Cognigy.AI conversation
