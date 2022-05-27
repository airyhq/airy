---
title: Cluster
sidebar_label: Cluster
---

The `cluster.*` API is about controlling the general configuration of the `Airy Core` Cluster, which is independent of the individual components. Currently the only supported argument is

## Update

Update the configuration of a list of components.

`POST /components.update`

**Sample request**

```json
{
  "cluster_config": {
    "security": {
      "system_token": "token",
      "allowed_origins": "*",
      "jwt_secret": "secret",
      "oidc": null
    }
  }
}
```

**Sample response**

A list of the applied cluster configuration categories and if it has been applied correctly is returned.

```json5
{
  "cluster_config": {
    "security": true
  }
}
```
