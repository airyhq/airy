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

```json5
{
}
```

**Sample response**

```json5
[{
  "name": "my template name",
  "content": "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}",
  "variables": {
    "en": {
      "salutation": "%s"
    }
  }
}]
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
  "content": "{String}"
}
```

## Update

`POST /templates.update`

```json5

{
  "id": "template id",
  "name": "my template name",
  "content": "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}",
  "variables": {
    "en": {
      "salutation": "%s"
    }
  }
}
```

## Delete

`POST /templates.delete`

```json5
{
  "id": "TEMPLATE-UUID"
}
```

