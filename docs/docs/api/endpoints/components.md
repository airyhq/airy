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

Update the configuration of a list of components. The `data` section is optional

`POST /components.update`

**Sample request**

```json
{
  "components": [
    {
      "name": "sources-facebook",
      "enabled": true,
      "data": {
        "app_id": "id",
        "app_secret": "secret",
        "webhook_secret": "secret"
      }
    },
    {
      "name": "sources-google",
      "enabled": true,
      "data": {
        "partner_key": "key",
        "sa_file": "file"
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

## List

List all the components, both installed and not installed.

`POST /components.list`

**Sample request**

```json
{
  "repository": "airy-core" // optional
}
```

**Sample response**

```json5
{
  "components": [
    {
      "name": "sources-facebook",
      "repository": "airy-core",
      "installed": true
    },
    {
      "name": "sources-google",
      "repository": "airy-core",
      "installed": false
    }
  ]
}
```

## Install

Install a new component.

`POST /components.install`

**Sample request**

```json
{
  "name": "sources-chat-plugin"
}
```

**Sample response**

The response includes the name of the component that was installed with an indication of the process was completed successfully (true) or not (false).

```json5
{
  "sources-chat-plugin": true
}
```

## Uninstall

Install an existing component.

`POST /components.uninstall`

**Sample request**

```json
{
  "name": "sources-chat-plugin"
}
```

**Sample response**

The response includes the name of the component that was uninstalled with an indication of the process was completed successfully (true) or not (false).

```json5
{
  "sources-chat-plugin": true
}
```
