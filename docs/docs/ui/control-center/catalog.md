---
title: Catalog
sidebar_label: Catalog
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Introduction

The Catalog page of the Control Center lists the available [connectors](/sources/introduction) that can be connected to an Airy Core app. You can choose which connector you want to add and configure it easily (see [Configuration](catalog#configuration) below).

A connector is listed in the [Connectors](connectors) page once it has been successfully connected.

## Example

The screenshots below come from a sample Control Center UI and show that the app is already connected to the [Airy Live Chat](/sources/chatplugin/quickstart), [Facebook Messenger](/sources/facebook), [WhatsApp](/sources/whatsapp-twilio), [Google Business Messages](/sources/google), and [Instagram](/sources/instagram) connectors. The [SMS](/sources/sms-twilio) connector is listed in the Catalog: it hasn't been added to the app yet and is available to connect.
<img alt="Control Center Connectors"src={useBaseUrl('img/ui/controlCenterConnectors.png')} />
<img alt="Control Center Catalog"src={useBaseUrl('img/ui/controlCenterCatalog.png')} />

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
  - Step 1: Find the authToken and accountSid
  - Step 2: Configure the webhook integration
  - Step 3: Connect a Twilio provider to your instance
- [Google](https://airy.co/docs/core/sources/google#configuration)
  - Step 1: Registration
  - Step 2: Editing of the yaml file in Airy Core
  - Step 3: Verification by Google
