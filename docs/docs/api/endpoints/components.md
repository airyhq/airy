---
title: Components
sidebar_label: Components
---

The `components.*` API is about controlling the individual components which are running inside `Airy Core`.

## Get

Retrieve the configuration of the components currently started in `Airy Core`.

`POST /components.get`

The list of the currently configured components is returned.

**Sample response**

```json5
{
  "components": {
    "sources": {
      "facebook": {
        "appId": "id",
        "appSecret": "secret",
        "webhookSecret": "secret"
      },
      "google": {
        "partnerKey": "key",
        "saFile": "file"
      }
    }
  }
}
```

## Update

Update the configuration of a list of components.

`POST /components.update`

**Sample request**

```json
{
  "components": [
    {
      "name": "sources-facebook",
      "enabled": true,
      "data": {
        "appId": "id",
        "appSecret": "secret",
        "webhookSecret": "secret"
      }
    },
    {
      "name": "sources-google",
      "enabled": true,
      "data": {
        "partnerKey": "key",
        "saFile": "file"
      }
    },
    {
      "name": "integration-webhook",
      "enabled": true,
      "data": {
        "name": "webhookname"
      }
    }
  ]
}
```

**Sample response**

The list of configured components and if the configuration has been applied correctly is returned.

```json5
{
  "components": {
    "integration-webhook": true,
    "sources-facebook": true,
    "sources-google": true
  }
}
```

## Delete

Delete a list of component which are currently deployed.

`POST /components.delete`

**Sample request**

```json
{
  "components": ["sources-facebook", "sources-google"]
}
```

**Sample response**

The list of the deleted components is returned.

```json5
{
  "components": {
    "sources-facebook": true,
    "sources-google": true
  }
}
```
