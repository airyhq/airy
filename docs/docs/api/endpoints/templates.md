---
title: Templates
sidebar_label: Templates
---

Refer to our [template](getting-started/glossary.md#template) definition
for more information.

## Create

`POST /templates.create`

**Sample request**

```json5
{
  "name": "my template name",
  "source": "chatplugin",
  "content": {
    "message": {
      "text": "[[salutation]]!"
    }
  }
}
```

**Sample response**

```json5
{
  id: "TEMPLATE-UUID"
}
```

## List

`POST /templates.list`

**Filtering**

This endpoint allows you to query templates, filtering by name.

**Sample request**

Find templates whose name contains "Ada":

```json5
{
  "source": "chatplugin",
  "name": "Ada" // optional
}
```

**Sample response**

```json5
{
  "data": [
    {
      "id": "TEMPLATE-UUID",
      "name": "Template for Ada Lovelance day",
      "source": "chatplugin",
      "content": {
        "message": {
          "text": "[[salutation]]!"
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
  "source": "chatplugin",
  "content": {
    "message": {
      "text": "[[salutation]]!"
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
  "source_type": "chatplugin",
  "content": {
    "message": {
      "text": "[[salutation]]!"
    }
  }
}
```

**Sample Response**

This endpoint returns 200 if successful.

## Delete

`POST /templates.delete`

```json5
{
  "id": "TEMPLATE-UUID"
}
```

**Sample Response**

This endpoint returns 200 if successful.
