# Airy Core Platform

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) contains all the
code and tooling required to run the Airy Core Platform.

- [Airy Core Platform](#airy-core-platform)
  - [What's the Airy Core Platform?](#whats-the-airy-core-platform)
  - [Getting started](#getting-started)
    - [Debug the local installation](#debug-the-local-installation)
    - [Delete the local installation](#delete-the-local-installation)
  - [Design principles of the Airy Core Platform](#design-principles-of-the-airy-core-platform)
  - [How to contribute](#how-to-contribute)
  - [Code of Conduct](#code-of-conduct)

## What's the Airy Core Platform?

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows its user to process messaging data from a variety of sources (like
facebook messenger or google business messages). The core platform contains the
following components:

- A ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](/docs/glossary.md) for formal definitions).

- A [React](https://reactjs.org/) UI component library which we showcase at
  [components.airy.co]

- An [API](/docs/api.md) to manage the data sets the platform
  handles.

- A webhook integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integrations
  exposes messages events so users can "listen" to those events and react
  programmatically.)

- A WebSocket server that allows clients to receive near real-time updates about
  data flowing through the system.

Here is a quick overview of how the repository is organized:

- `backend`

  This directory contains the code of the ingestion platform (in the
  subdirectory `backend/sources`), the code of the webhook server (in the
  subdirectory `backend/webhook`), and the code of the API endpoints (in the
  subdirectory `backend/api`).

- `frontend`

  This directory contains the code of the "inbox", "admin" applications, and the
  frontend libraries used by both modules.

- `infrastructure`

  This directory contains the code that creates the infrastructure (we rely
  heavily on Kubernetes as a runtime for our applications).

- `tools`

  This directory contains the tooling we wrote to support our
  [bazel](https://bazel.build) builds. Furthermore, it contains some support
  tooling for our infrastructure.

- `scripts`

  This directory contains a variety of utility scripts.

If you wish to learn more about a specific project, please refer to the
`README.md` in the corresponding subdirectory.

## Getting started

To get the Airy Core Platform up and running on your local computer, execute the following commands.
The script will check if you have Vagrant and try to install it for you. 
If it fails, you will need to install [Vagrant](https://www.vagrantup.com/downloads) by yourself, 
otherwise your system is not currently supported to run the Airy Core Platform.
```sh
$ git clone https://github.com/airyhq/core
$ cd core
$ ./scripts/bootstrap.sh
```


### Debug the local installation

You can ssh inside the Airy Core Platform box for testing and debugging purposes like so:

```sh
$ cd infrastructure
$ vagrant ssh
$ kubectl get pods
```

### Delete the local installation 

You can remove the Airy Core Platform Box from your machine completely running the following commands:

```sh
$ cd infrastructure
$ vagrant destroy
```

## Design principles of the Airy Core Platform

The Airy Core Platform is built using a few guiding principles. An introduction
to these principles is essential to navigate the code base with ease. You can
read more about it [here](/docs/design.md)

## How to contribute

We welcome (and love) every form of contribution! Good entry points to the
project are:

- Our [contributing guidelines](/CONTRIBUTING.md)
- Our [developers' manual](/docs/developers-manual.md)
- Issues with the tag
  [gardening](https://github.com/airyhq/core/issues?q=is%3Aissue+is%3Aopen+label%3Agardening)
- Issues with the tag [good first
  patch](https://github.com/airyhq/core/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+patch%22)

If you're still not sure where to start, please open a [new
issue](https://github.com/airyhq/core/issues/new) and we'll gladly help you get
started.

## Code of Conduct

To ensure a safe experience and a welcoming community, the Airy Core Platform
project adheres to the [contributor
convenant](https://www.contributor-covenant.org/) [code of
conduct](/code_of_conduct.md).
