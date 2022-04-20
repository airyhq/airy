---
title: Client Config
sidebar_label: Client Config
---

The `config.client` endpoint responds with the configuration for an instance’s services, user profile, and tags.

The `services` property in the response gives the status of the instance’s components and reflects the [airy.yaml configuration file](/getting-started/installation/configuration). For example, [contacts](contacts) is an optional feature that can be enabled in the [airy.yaml configuration file](/getting-started/installation/configuration). If [contacts](contacts) is enabled (i.e. the `integration.contacts.enabled` field is marked as `true` in the [airy.yaml configuration file](/getting-started/installation/configuration)), the `config.client` endpoint will mark the component `api-contacts` as `enabled` in its response.

[Authentication is disabled by default in Airy Core](/api/introduction), thus the `user_profile` property in the response is by default `null`. If the instance features authentification, the `user_profile` property will include information about the user that is currently logged in.

The `tag_config` property in the response represents the configuration for [tags](/ui/tags). The [UI](/ui/introduction) uses these settings for the [tags](/ui/tags)' default styling.

`POST /client.config`

**Sample request**

```json5
{}
```

**Sample Response**

```json5
{
  "cluster_version": "0.42.0",
  "services": {
    "frontend-ui": {
      "enabled": true,
      "healthy": true,
      "component": "frontend-ui"
    },
    "source-api": {
      "enabled": true,
      "healthy": true,
      "component": "integration-source-api"
    },
    "sources-google-connector": {
      "enabled": true,
      "healthy": true,
      "component": "sources-google"
    },
    "sources-viber-connector": {
      "enabled": false,
      "healthy": false,
      "component": "sources-viber"
    },
    "webhook-publisher": {
      "enabled": true,
      "healthy": true,
      "component": "integration-webhook"
    },
    "api-contacts": {
      "enabled": true,
      "healthy": true,
      "component": "api-contacts"
    },
    "sources-google-events-router": {
      "enabled": true,
      "healthy": false,
      "component": "sources-google"
    },
    "sources-viber-events-router": {
      "enabled": false,
      "healthy": false,
      "component": "sources-viber"
    },
    "api-communication": {
      "enabled": true,
      "healthy": true,
      "component": "api-communication"
    },
    "sources-facebook-events-router": {
      "enabled": true,
      "healthy": false,
      "component": "sources-facebook"
    },
    "media-resolver": {
      "enabled": true,
      "healthy": true,
      "component": "media-resolver"
    },
    "webhook-consumer": {
      "enabled": true,
      "healthy": true,
      "component": "integration-webhook"
    },
    "sources-twilio-connector": {
      "enabled": true,
      "healthy": true,
      "component": "sources-twilio"
    },
    "sources-chatplugin": {
      "enabled": true,
      "healthy": true,
      "component": "sources-chat-plugin"
    },
    "sources-twilio-events-router": {
      "enabled": true,
      "healthy": false,
      "component": "sources-twilio"
    },
    "api-admin": {
      "enabled": true,
      "healthy": false,
      "component": "api-admin"
    },
    "api-websocket": {
      "enabled": true,
      "healthy": true,
      "component": "api-websocket"
    },
    "frontend-chat-plugin": {
      "enabled": true,
      "healthy": true,
      "component": "sources-chat-plugin"
    },
    "sources-facebook-connector": {
      "enabled": true,
      "healthy": true,
      "component": "sources-facebook"
    }
  },
  "user_profile": null,
  "tag_config": {
    "colors": {
      "tag-green": {
        "default": "0E764F",
        "background": "F5FFFB",
        "font": "0E764F",
        "position": 3,
        "border": "0E764F"
      },
      "tag-blue": {
        "default": "1578D4",
        "background": "F5FFFB",
        "font": "1578D4",
        "position": 1,
        "border": "1578D4"
      },
      "tag-red": {
        "default": "E0243A",
        "background": "FFF7F9",
        "font": "E0243A",
        "position": 2,
        "border": "E0243A"
      },
      "tag-purple": {
        "default": "730A80",
        "background": "FEF7FF",
        "font": "730A80",
        "position": 4,
        "border": "730A80"
      }
    }
  }
}
```
