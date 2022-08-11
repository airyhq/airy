---
title: Contributing Components
sidebar_label: Contributing Components
---

:::warning

This functionality is under development. With these docs, we aim to elicit feedback from our community (you!) and focus our development efforts. Currently, we do not offer support for 3rd party components, but we are working toward supporting this.

:::

`Airy Core` is fundamentally a collection of components. When you [install `Airy Core`](../getting-started/installation/introduction.md), you install a set of _core_ components which create the minimum infrastructure to install other components and begin using the platform.

These core components are:

1. airy-controller
2. api-admin
3. api-communication
4. api-websocket
5. frontend-inbox
6. frontend-control-center

Airy's real value comes from the additional components you install through our marketplace in the Control Center UI of your Airy Instance. This documentation is on the processes we follow to create, update and store our components.

## A Component

Airy is designed to support a plug-and-play architecture. Components once installed are be added as pods your cluster. Components can provide four kinds of functionality:

1. Connector - i.e Rasa, DialogFlow - that [DEFINE]
2. Source - i.e., Facebook, WhatsApp, SMS -
3. API - i.e
4. User Interface - i.e

As a technical artifact, a component is a containerized application (we use Docker) that is packaged and installed using Helm.

The Helm charts and details about all components (except "Core" components) are stored in an external repository managed by Airy called [airy-components](https://github.com/airyhq/airy-/airy-components). This repository is made up directories, where each directory represents a component.

## Component File Structure

Below is a model of the file stucture of a single component inside the `airy-components` repository.

```
/airy-components
	/[COMPONENT_NAME]
		information.yaml
		/helm
```

The `helm` directory contains the `values.yaml` file and all other templates/files needed to make up the Helm package.

The `information.yaml` is the source-of-truth for every component. It includes a description of its functionality, pricing, availability, and version. This file is written by the component maintainer and rendered into the UI of the Control Center.

:::note

Since all components are maintained by Airy, the versioning of every component is tied to the version of Airy. However, once we support 3rd party components, we will revisit our versioning system.

::::

## Developing your own Components

A step-by-step guide to creating your component!

## Publishing your Component to the Airy Marketplace

A step-by-step guide to make your component available to the world!
