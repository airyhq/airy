---
title: Contributing Components
sidebar_label: Contributing Components
---

:::warning

While you can already contribute components exposing them to users via the catalog is still under development.

:::

## Components

import ComponentDefinition from '../getting-started/componentDefinition.mdx'

<ComponentDefinition/>

With every [installation of Airy](../getting-started/installation/introduction.md) we bundle a set of default components to get you started:

1. airy-controller
2. api-admin
3. api-communication
4. api-websocket
5. frontend-inbox
6. frontend-control-center

Airy also provides a marketplace of _plug and play_ components that extend the functionality of your Airy instance.
You can install them through the catalog page in the Control Center UI of your Airy Instance or by using the [install endpoint](../api/endpoints/components.md#install).

In the following, we will explain how to create, update and store components.

The Helm package and information on each component (except core components) are stored in an external repository managed by Airy called [catalog](https://github.com/airyhq/catalog).
This repository is made up of directories where each directory contains a component's metadata.

## The Component File Structure

Below is a model of the file structure of a single component inside the [`catalog`](https://github.com/airyhq/catalog) repository.

```
catalog/
└── [COMPONENT_NAME]/
    └── description.yaml
```

The `description.yaml` completely defines a component so that it can be installed and displayed in the UI catalog.

It contains a description of its functionality, availability, version, and importantly the url of the helm chart used for installation.
This file is written by the component maintainer and rendered into the UI of the Control Center.

:::note

Since all components are maintained by Airy, the versioning of every component is tied to the version of Airy.
However, once we support 3rd party components, we will revisit our versioning system.

::::

## Developing your own Components

A step-by-step guide to creating your component!

## Publishing your Component to the Airy Marketplace

A step-by-step guide to make your component available to the world!
