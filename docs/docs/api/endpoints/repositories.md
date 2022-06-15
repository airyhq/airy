---
title: Repositories
sidebar_label: Repositories
---

The `repositories.*` API is about controlling the repositories from where the individual components are installed.

## List

Retrieve a list of repositories.

`POST /repositories.list`

The list of the currently configured components is returned.

**Sample response**

```json5
{
  "repositories": [
    {
      "name": "airy-core",
      "url": "https://github.com/airyhq/airy/tree/develop/infrastructure/helm-chart/charts/components/charts"
    },
    {
      "name": "airy-enterprise",
      "url": "enterprise-url"
    },
    {
      "name": "airy-tools",
      "url": "https://github.com/airyhq/airy/tree/develop/infrastructure/helm-chart/charts/tools/charts"
    },
    {
      "name": "my-custom-airy-repo",
      "url": "my-custom-url"
    }
  ]
}
```
