---
title: Catalog
sidebar_label: Catalog
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The Catalog page of the [Control Center](/ui/control-center/introduction) lists both the [connectors](/sources/introduction) that have been installed and not installed.

In the Catalog 'Not Installed' list, you can choose which connector you want to add and configure it easily (see [Configuration](catalog#configuration) below).

A connector is listed in the [Connectors](connectors) page once it has been successfully connected.

## Example

The screenshots below come from a sample Airy Core app's Control Center UI.

The Catalog shows that the app is already connected to the [Airy Live Chat](/sources/chatplugin/quickstart), [Facebook Messenger](/sources/facebook), [WhatsApp](/sources/whatsapp-twilio), [Google Business Messages](/sources/google), and [Instagram](/sources/instagram) connectors. The [SMS](/sources/sms-twilio) connector hasn't been installed yet and is available to connect.

<img alt="Control Center Catalog Example"src={useBaseUrl('img/ui/controlCenterCatalog.png')} />

## Configuration

- [Airy Live Chat](https://airy.co/docs/core/sources/chatplugin/quickstart)
  - Step 1: Sign up and log in
  - Step 2: Set up first source
  - Step 3: Send messages via the Chat Plugin
  - Step 4: Use the HTTP API to list conversations
  - Step 5: Consume directly from Apache Kafka
- [Facebook](https://airy.co/docs/core/sources/facebook#configuration)
  - Step 1: Find the App ID and Secret
  - Step 2: Configure the webhook integration
  - Step 3: Obtain the page token
  - Step 4: Connect Facebook page to your instance
- [Instagram](https://airy.co/docs/core/sources/instagram#configuration)
  - Step 1: Find the App ID and Secret
  - Step 2: Configure the webhook integration
  - Step 3: Enable the Instagram Graph API
  - Step 4: Obtain the Page token
  - Step 5: Get the Instagram account ID
  - Step 6: Connect an Instagram channel via API request
  - Step 7: Send a message to Instagram
- [Twilio SMS](https://airy.co/docs/core/sources/sms-twilio#configuration) & [Twilio Whatsapp](https://airy.co/docs/core/sources/whatsapp-twilio#configuration)
  - Step 1: Configure the webhook integration
  - Step 2: Connect a Twilio provider to your instance
  - Step 3: Send and receive messages with the Inbox UI
- [Google](https://airy.co/docs/core/sources/google#configuration)
  - Step 1: Registration
  - Step 2: Editing of the yaml file in Airy Core
  - Step 3: Verification by Google
