---
title: IBM Watson Assistant
sidebar_label: IBM Watson Assistant
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";

<TLDR>

The IBM Watson™ Assistant service combines machine learning, natural language understanding, and an integrated dialog editor to create conversation flows between your apps and your users.

- From the [IBM Watson Assistant documentation](https://cloud.ibm.com/apidocs/assistant/assistant-v2#introduction)

</TLDR>

Integrating [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) with your Airy Core instance enables you to leverage its conversational AI capabilities on all your instance's [channels](getting-started/glossary.md#channel). When [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) is integrated with an Airy Core instance, Airy Core will forward the messages to the [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) installation, which will respond to the Airy Core API according to its conversation flow.

Airy Core includes an internal IBM Watson Assistant [connector](/concepts/architecture#components) that you can install on your Airy Core instance: this page will guide through the installation and configuration process.

:::tip What you will learn

- Finding your credentials on your IBM Cloud dashboard
- How to connect your IBM Watson Assistant's installation to your Airy Core instance through Airy Core's IBM Watson Assistant connector

:::

:::note Prerequisites

- A running Airy Core installation (refer to the [Get
  Started section](getting-started/installation/introduction.md))
- An [IBM Cloud](https://www.ibm.com/cloud) account with a running [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) product

:::

## Step 1: Find your credentials on your IBM Cloud dashbaord

Once that you have an [IBM Cloud](https://www.ibm.com/cloud) account with a running [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) (see prerequisites), you need to find your assistant's credentials. Connecting the [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) to Airy Core requires 3 configuration values: your IBM Watson Assistant instance's `URL`, `apiKey` and `Assistant ID`.

- Find your [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) instance's `URL` and `apiKey` on the IBM Watson Assistant service page. To access this service page: select `ressource list` from your dashboard, select the `AI / Machine Learning` category, and then select your assistant. Note down these credentials.

<center><img alt="Airy connection with IBM Watson Assistant " src={useBaseUrl('img/conversational-ai-connectors/ibmWatsonAssistant/credentialsibmwatson.jpg')} /></center>
<br />

- Next, on your IBM Watson Assistant service page, click on the button `Launch Assistant`: this opens the assistant page. On your assistant page, click on the `settings` button on the left sidebar, at the bottom. This opens the settings page, and under the section `Environments` you can choose between the draft and live `Environment ID` / `Assistant ID`.

<center><img alt="Airy connection with IBM Watson Assistant " src={useBaseUrl('img/conversational-ai-connectors/ibmWatsonAssistant/enviromentsibmwatson.jpg')} /></center>
<br />

<SuccessBox>

Congratulations! You are now ready to connect IBM Watson Assistant to your Airy Core instance 🎉

</SuccessBox>
<br />

import InstallationOptions from './installation-options.mdx'

<InstallationOptions />

## Step 2 (option 1): Installation and configuration via API request

First, you need to install the component on your instance: send an API request to the [Components Install](/api/endpoints/components#install) endpoint to install the [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) on your Airy instance.

The request body should be:

```json
{
  "name": "ibm-watson-assistant-connector"
}
```

Once the installation is successful (indicated by a 200 response status code), you can configure the component using the [Components Update](/api/endpoints/components#update) endpoint.

Use the `URL`, `apiKey`, and `Assistant ID` you noted in the previous step to compose the request body:

```json
{
  "components": [
    {
      "name": "ibm-watson-assistant-connector",
      "enabled": true,
      "data": {
        "ibmWatsonAssistantURL": "yourURL",
        "ibmWatsonAssistantApiKey": "yourApiKey",
        "ibmWatsonAssistantAssistantId": "yourAssistantId"
      }
    }
  ]
}
```

The request is considered successful if the component's name (in this case:`ibm-watson-assistant-connector`) is returned in the response.

```json
{
  "components": {
    "ibm-watson-assistant-connector": true
  }
}
```

The [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) is now installed and configured on your Airy Core instance.

## Step 2 (option 2): Installation and configuration via the Airy Control Center UI

On the [Airy Control Center UI](/ui/control-center/introduction), navigate to the [Catalog](/ui/control-center/catalog) and select `IBM Watson Assistant`. Click on the `Install` button.

Once the installation is completed, navigate to the [Control Center's Connectors page](/ui/control-center/connectors) and select `IBM Watson Assistant`: this will open the connector's configuration page.

Paste the `URL`, `apiKey`, and `Assistant ID` you noted in the previous step in the respective fields and save this configuration.

The [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) is now installed and configured on your Airy Core instance.

## Step 3: IBM Watson Assistant's connection with Airy

To test the connection, write a message to one of your channels: Airy Core will
forward it to your [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) installation, which will respond to the Airy Core API according to its conversation flow.

The screenshot below displays an [Airy Live Chat Plugin](/connectors/sources/chatplugin/overview) from an instance connected to the [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) through Airy Core's IBM Watson Assistant [connector](/concepts/architecture#components). It shows an example where a message sent to Airy Core is responded to by an [IBM Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) installation where the assistant was programmed to respond "Hello from IBM Watson Assistant".

<center><img alt="Airy connection with IBM Watson Assistant " src={useBaseUrl('img/conversational-ai-connectors/ibmWatsonAssistant/messagingExample.png')} /></center>
