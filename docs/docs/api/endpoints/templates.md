---
title: Templates
sidebar_label: Templates
---

Refer to our [template](getting-started/glossary.md#template) definition
for more information.

## Create

`POST /templates.create`

**Sample request**

```json
{
  "name": "my template name",
  "content": "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}",
  "variables": {
    "en": {
      "salutation": "%s"
    }
  }
}
```

**Sample response**

```json5
{
  "id": "TEMPLATE-UUID"
}
```

## List

`POST /templates.list`

This is a [paginated](/api/endpoints/introduction.md#pagination) endpoint.

**Filtering**

This endpoint allows you to query templates using the human readable [Lucene
Query Syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html).

**Sample request**

Find templates whose name ends with "NASA":

```json5
{
  "filters": "name:*NASA", // optional
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Sample response**

```json5
{
  "data": [
    {
      "id": "TEMPLATE-UUID",
      "name": "Template for NASA",
      "content": '{"blueprint":"text","payload":"[[salutation]]!"}',
      "variables": {
        "en": {
          "salutation": "%s"
        }
      }
    }
  ]
}
```

## Info

`POST /templates.info`

```json5
{
  "id": "TEMPLATE-UUID"
}
```

**Sample response**

```json5
{
  "id": "TEMPLATE-UUID",
  "name": "{String}",
  "content": "{String}",
  "variables": {
    "en": {
      "salutation": "%s"
    }
  }
}
```

## Update

`POST /templates.update`

```json5
{
  "id": "template id",
  "name": "my template name",
  "content": '{"blueprint":"text","payload":"[[salutation]]!"}',
  "variables": {
    "en": {
      "salutation": "%s"
    }
  }
}
```

**Sample Response**

This endpoint returns _200_ if successful.

## Delete

`POST /templates.delete`

```json5
{
  "id": "TEMPLATE-UUID"
}
```

**Sample Response**

This endpoint returns _200_ if successful.
