---
title: Contributing Components
sidebar_label: Contributing Components
---

:::warning

This functionality is under development. With these docs, we aim to elicit feedback from our community (you!) and focus our development efforts. Currently, we do not offer support for 3rd party components, but we are working toward supporting this.

:::

`Airy` is fundamentally a collection of components. When you [install `Airy`](../getting-started/installation/introduction.md), you get a few components out-of-the-box which form the infrastructure to install other components and begin using the platform.

These core components are:

1. airy-controller
2. api-admin
3. api-communication
4. api-websocket
5. frontend-inbox
6. frontend-control-center

Airy's real value comes from the additional components you install through our marketplace in the Control Center UI of your Airy Instance. This documentation is on the processes we follow to create, update and store our components.

## Components

import ComponentDefinition from '../getting-started/componentDefinition.mdx'

<ComponentDefinition/>

The Helm package and information on each components (except core components) are stored in an external repository managed by Airy called [airy-components](https://github.com/airyhq/airy-/airy-components). This repository is made up directories where each one contains the component's Helm package and information on it.

## The Component File Structure

Below is a model of the file stucture of a single component inside the [`airy-components`](https://github.com/airyhq/airy-/airy-components) repository.

```
airy-components/
└── [COMPONENT_NAME]/
    ├── information.yaml
    └── helm/
        └── [HELM CHART]
```

The `helm` directory contains all the files that make up the Helm package.

The `information.yaml` is the source-of-truth for every component. It includes a description of its functionality, pricing, availability, and version. This file is written by the component maintainer and rendered into the UI of the Control Center.

:::note

Since all components are maintained by Airy, the versioning of every component is tied to the version of Airy. However, once we support 3rd party components, we will revisit our versioning system.

::::

## Developing your own Components

A step-by-step guide to creating your component!

## Publishing your Component to the Airy Marketplace

A step-by-step guide to make your component available to the world!
