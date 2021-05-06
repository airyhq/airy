---
title: Tags
sidebar_label: Tags
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>Tags are words, or combinations of words, you can use to add more context to conversations and contacts.</TLDR>

Tags provide you with an unlimited amount of flexibility to manage and customize your conversational workflow.

Here are the ways you can create and use tags:

- Use the Tag API to create them programmatically
- Your users can create them manually directly in conversations
- They can be created in the Tag Manager

## Create

When you create a tag you can choose a color to visually identify it better in the inbox.
This can also be done via the [Create Tags API](api/endpoints/tags.md#create).

<img alt="Create Tags"src={useBaseUrl('img/ui/create_tags.gif')} />

## Edit

When editing tags you can change the name and the color of each tag.
This can also be done via the [Edit Tags API](api/endpoints/tags.md#update).

<img alt="Edit Tags"src={useBaseUrl('img/ui/edit_tags.gif')} />

## Delete

Deleting tags deletes them completely.
This can also be done via the [Delete Tags API](api/endpoints/tags.md#delete).

<img alt="Delete Tags"src={useBaseUrl('img/ui/delete_tags.gif')} />
