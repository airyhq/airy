# Airy Core Platform

This [monorepository](https://en.wikipedia.org/wiki/Monorepo) contains all the
code and tooling required to run the Airy Core Platform.

- [Airy Core Platform](#airy-core-platform)
  - [What's the Airy Core Platform?](#whats-the-airy-core-platform)
  - [Getting started](#getting-started)
  - [Design principles of the Airy Core Platform](#design-principles-of-the-airy-core-platform)
  - [Running the Airy Core Platform in production](#running-the-airy-core-platform-in-production)
  - [How to contribute](#how-to-contribute)
  - [Code of Conduct](#code-of-conduct)

## What's the Airy Core Platform?

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows its user to process messaging data from a variety of sources (like facebook messenger or google business messages). The core platform contains the following modules:

- A ingestion platform that relies heavily on Apache Kafka and the Kafka Streams
  library to process incoming webhook data from different sources. We make sense of the data and reshape it into an Airy Data Model representing contacts, conversations, and messages.
- Two UI modules:
  - An "inbox" UI to manage incoming messages (the UI is connected to the core
    platform via websocket server so the incoming data appears in a
    near-realtime manner)
  - An "admin" UI to manage channels of communication, webhook integrations, and teams for the inbox UI.
- An API, also used by the UI modules, to manage the data sets the platform
  handles.
- A webhook integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integrations
  exposes messages events so users can "listen" to those events and react
  programmatically.)

Being a monorepository, the whole codebase of the above mentioned projects is in
the same repository. Here is a quick overview of how the repository is
organized:

- `backend`
  This directory contains the code of the ingestion platform (in the subdirectory `backend/sources`), the code of the webhook server (in the subdirectory `backend/webhook`), and the code of the API endpoints (in the subdirectory `backend/api`).
- `frontend`
  This directory contains the code of the "inbox", "admin" applications, and the frontend libraries used by both modules.
- `infrastructure`
  This directory contains the code that creates the infrastructure (we rely heavily on Kubernetes as a runtime for our applications).
- `tools`
  This directory contains the tooling we wrote to support our [bazel](https://bazel.build) builds. Furthermore, it contains some support tooling for our infrastructure.
- `scripts`
  This directory contains a variety of utility scripts.

If you wish to learn more about a specific project, please refer to the
`README.md` in the corresponding subdirectory.

## Getting started

```sh
$ git clone https://github.com/airyhq/core
$ cd core
$ ./scripts/bootstrap.sh
```

## Design principles of the Airy Core Platform

The Airy Core Platform is built using a few guiding principles. An introduction
to these principles is essential to navigate the code base with ease. You can
read more about it [here](/docs/design.md)

## Running the Airy Core Platform in production

## How to contribute

We welcome (and love) every form of contribution! Good entry points to the project are:

- Our [contributing guidelines](/CONTRIBUTING.md)
- Our [developers' manual](/docs/developers-manual.md)
- Issues with the tag
  [gardening](https://github.com/airyhq/core/issues?q=is%3Aissue+is%3Aopen+label%3Agardening)
- Issues with the tag [good first
  patch](https://github.com/airyhq/core/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+patch%22)

If you're still not sure where to start, please open a [new
issue](https://github.com/airyhq/core/issues/new) and we'll gladly
help you get started.

## Code of Conduct

To ensure a safe experience and a welcoming community, the Airy Core Platform project adheres to the [contributor convenant](https://www.contributor-covenant.org/) [code of conduct](/code_of_conduct.md).
