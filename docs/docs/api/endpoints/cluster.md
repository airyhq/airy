---
title: Cluster
sidebar_label: Cluster
---

The `cluster.*` API controls the system-wide configuration of the `Airy` Cluster, which is independent of the individual components.

## Update

Update the configuration of a list of components.

`POST /cluster.update`

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
