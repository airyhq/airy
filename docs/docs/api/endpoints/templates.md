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
  name: "my template name",
  content: {
    message: {
      text: "[[salutation]]!"
    }
  },
  // source specific message content
  variables: {
    en: {
      salutation: "%s"
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

Find templates whose name contains "NASA":

```json5
{
  name: "NASA" // optional
}
```

**Sample response**

```json5
{
  data: [
    {
      id: "TEMPLATE-UUID",
      name: "Template for NASA",
      content: {
        message: {
          text: "[[salutation]]!"
        }
      },
      // source specific message content
      variables: {
        en: {
          salutation: "%s"
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
  id: "TEMPLATE-UUID"
}
```

**Sample response**

```json5
{
  id: "TEMPLATE-UUID",
  name: "{String}",
  content: {
    message: {
      text: "[[salutation]]!"
    }
  },
  // source specific message content
  variables: {
    en: {
      salutation: "%s"
    }
  }
}
```

## Update

`POST /templates.update`

```json5
{
  id: "template id",
  name: "my template name",
  content: {
    message: {
      text: "[[salutation]]!"
    }
  },
  // source specific message content
  variables: {
    en: {
      salutation: "%s"
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
  id: "TEMPLATE-UUID"
}
```

**Sample Response**

This endpoint returns _200_ if successful.
