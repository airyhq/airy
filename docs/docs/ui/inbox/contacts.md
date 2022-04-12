---
title: Contacts
sidebar_label: Contacts
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>Airy UI allows you to view and edit contacts for personalized interactions.</TLDR>

:::note

This feature is disabled by default. To enable it you need to set the `integration.contacts.enabled` field in your [airy.yaml config](getting-started/installation/configuration.md) to`true`.

The configuration served by the [client.config endpoint](/api/endpoints/client-config) is used for enabling this feature in the UI. Thus, viewing and editing contacts in the Airy UI is only possible when this feature is enabled in the [airy.yaml configuration file](getting-started/installation/configuration.md).

:::

## Get contact details

Airy's [Inbox UI](introduction) displays conversations' contact details on the right side of the [messenger](messenger).

You also can get a contact's information via the [Contacts info API](api/endpoints/contacts.md#get-contact) or the [List contacts API](api/endpoints/contacts.md#list-contacts).

<img alt="Inbox with contact info" src={useBaseUrl('img/ui/inbox.png')} />

## Edit

When editing contact details, you can change the email, phone number, title, address, city, and organization.

This can also be done via the [Update contacts API](api/endpoints/contacts.md#update-contact).

<img alt="Contacts edit"src={useBaseUrl('img/ui/contactsEdit.gif')} />
