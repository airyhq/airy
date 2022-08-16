---
title: Contributing Components
sidebar_label: Contributing Components
---

:::warning

This functionality does not yet exist and is under development. With these docs, we aim to elicit feedback from our community (you!) and focus our development efforts. Currently, we do not offer support for 3rd party components, but we are working toward supporting this.

:::

## Components

import ComponentDefinition from '../getting-started/componentDefinition.mdx'

<ComponentDefinition/>

With every [installation of Airy](../getting-started/installation/introduction.md) we bundle a default components to get you started:

1. airy-controller
2. api-admin
3. api-communication
4. api-websocket
5. frontend-inbox
6. frontend-control-center

Airy also provides a marketplace of _plug and play_ components that extend the functionality of your Airy instance. You can install them through our catalog in the Control Center UI of your Airy Instance.

In the following, we will explain how to create, update and store components.

The Helm package and information on each component (except core components) are stored in an external repository managed by Airy called [airy-components](https://github.com/airyhq/airy-/airy-components). This repository is made up of directories where each directory contains a component's Helm package its description.

## The Component File Structure

Below is a model of the file structure of a single component inside the [`airy-components`](https://github.com/airyhq/airy-components) repository.

```
airy-components/
└── [COMPONENT_NAME]/
    ├── description.yaml
    └── helm/
        └── [HELM CHART]
```

The `helm` directory contains all the files that make up the Helm package.

The `description.yaml` is the source-of-truth for every component. It includes a description of its functionality, pricing, availability, and version. This file is written by the component maintainer and rendered into the UI of the Control Center.

:::note

Since all components are maintained by Airy, the versioning of every component is tied to the version of Airy. However, once we support 3rd party components, we will revisit our versioning system.

::::

## Developing your own Components

A step-by-step guide to creating your component!

## Publishing your Component to the Airy Marketplace

A step-by-step guide to make your component available to the world!
