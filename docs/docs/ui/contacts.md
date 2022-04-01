---
title: Contacts
sidebar_label: Contacts
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>Airy UI allows you to get and edit contacts' information for personnalized interactions.</TLDR>

## Get contact details

Airy UI displays a conversation's contact details on the right side of the [Inbox](inbox).

You also can get contact information via the [Contact info API](api/endpoints/contacts#get-contact) or the [List contacts API](api/endpoints/contacts#list-contacts).

<img alt="Contacts" src={useBaseUrl('img/ui/contacts.png')} />

## Edit

When editing a contact's details, you can change the email, phone number, address, city, title, and organization.

This can also be done via the [Update contact API](api/endpoints/contacts.md#update-contact).

<img alt="Contacts edit"src={useBaseUrl('img/ui/contactsEdit.png')} />
