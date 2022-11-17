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

Update the configuration of a list of components. The endpoint can accept configuration for multiple components at once. In a case when the configuration for a particular component cannot be applied (for example the component is not fully installed), that component will be omitted and the request will still return a `200`. This component will also not be in the response. The `data` section is optional.

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

**Sample response**

```json5
{
  "components": [
    {
      "availableFor": "Open-source, Enterprise, Managed cloud",
      "category": "Conversation Source",
      "configurationValues": "{ \"saFile\": \"string\", \"partnerKey\": \"string\"}",
      "description": "<div>...</div>",
      "displayName": "Google Business Messages",
      "docs": "https://airy.co/docs/core/sources/google",
      "installationStatus": "uninstalled|pending|installed",
      "isChannel": "true",
      "name": "sources-google",
      "price": "Free",
      "repository": "airy-core",
      "source": "google"
    },
    {
      "availableFor": "Open-source, Enterprise, Managed cloud",
      "category": "Conversation Source",
      "configurationValues": "{ \"appId\": \"string\", \"appSecret\": \"string\", \"webhookSecret\": \"string\"}",
      "description": "<div>...</div>",
      "displayName": "Facebook Messenger",
      "docs": "https://airy.co/docs/core/sources/facebook",
      "installationStatus": "uninstalled|pending|installed",
      "isChannel": "true",
      "name": "sources-facebook",
      "price": "Free",
      "repository": "airy-core",
      "source": "facebook"
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
  "name": "sources-chatplugin"
}
```

**(202) Success Response Payload**

## Uninstall

Uninstall an existing component.

`POST /components.uninstall`

**Sample request**

```json
{
  "name": "enterprise-dialogflow-connector"
}
```

**(202) Success Response Payload**

```

```
