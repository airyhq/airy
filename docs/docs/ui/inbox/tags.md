---
title: Tags
sidebar_label: Tags
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>Tags are words, or combinations of words, that you can use to add more context to conversations and contacts.</TLDR>

Tags provide an unlimited amount of flexibility to manage and customize conversational workflow.

Here are the ways you can create tags:

- Use the Tag API to create them programmatically
- Your users can create them manually directly in conversations
- They can be created in the Tag Manager

The tags configuration served by the [client.config endpoint](/api/endpoints/client-config) is used for the tags' default styling.

## Create

When you create a tag, you can choose a color to visually identify it in the Inbox.
This can also be done via the [Create Tags API](api/endpoints/tags.md#create).

<img alt="Create Tags"src={useBaseUrl('img/ui/tagsCreate.png')} />

## Edit

When editing tags, you can change the name and the color of each tag.
This can also be done via the [Edit Tags API](api/endpoints/tags.md#update).

<img alt="Edit Tags"src={useBaseUrl('img/ui/tagsEdit.png')} />

## Delete

Deleting a tag means removing it from all corresponding contacts. A tag can not be used once it has been deleted.
This can also be done via the [Delete Tags API](api/endpoints/tags.md#delete).

<img alt="Delete Tags"src={useBaseUrl('img/ui/tagsDelete.png')} />
