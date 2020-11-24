# Airy Core Platform

The Airy Core Platform is an open source, fully-featured, production ready
messaging platform to process conversational data from a variety of sources
(like Facebook Messenger, Google Business Messages, Website Live Chat, and
more).

- [Getting Started](#getting-started)
- [Components](#components)
- [Organization of this Repo](#organization-of-the-repository)
- [Design Principles](#design-principles)
- [How to contribute](#how-to-contribute)
- [Code of Conduct](#code-of-conduct)


## Getting started

You can run the Airy Core Platform locally by running the following commands:

```sh
$ git clone https://github.com/airyhq/airy
$ cd airy
$ AIRY_VERSION=beta ./scripts/bootstrap.sh
```

The bootstrap installation requires
[Vagrant](https://www.vagrantup.com/downloads) and
[VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not
found, the script will attempt to install them for you.  Check out our [user
guide](/docs/docs/user-guide.md) for detailed information.


## Components

The Airy Core Platform contains the following components:

- An ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](/docs/docs/glossary.md) for formal definitions).

- An [API](/docs/docs/api.md) to manage the data sets the platform
  handles.

- A webhook integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integration
  exposes events users can "listen" to and react programmatically.)

- A WebSocket server that allows clients to receive near real-time updates about
  data flowing through the system.


## Organization of the Repository

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) contains all the
code and tooling required to run the Airy Core Platform.

Here is a quick overview of how the repository is organized:

- `backend`

  This directory contains the code of the ingestion platform (in the
  subdirectory `backend/sources`), the code of the webhook server (in the
  subdirectory `backend/webhook`), and the code of the API endpoints (in the
  subdirectory `backend/api`).

- `frontend`

  This directory contains the code of a demo epplication which showcases
  the feature of the platform.

- `infrastructure`

  This directory contains the code that creates the infrastructure (we rely
  heavily on [Kubernetes](https://kubernetes.io/) as a runtime for our
  applications).

- `tools`

  This directory contains the tooling we wrote to support our
  [Bazel](https://bazel.build) builds. Furthermore, it contains some support
  tooling for our infrastructure.

- `scripts`

  This directory contains a variety of utility scripts.

If you wish to learn more about a specific project, refer to the
`README.md` in the corresponding subdirectory.


## Design Principles

The Airy Core Platform is built using a few guiding principles. An introduction
to these principles is essential to navigate the code base with ease. You can
read more about it [here](/docs/docs/guidelines/design-principles.md)


## How to contribute

We welcome (and love) every form of contribution! Good entry points to the
project are:

- Our [contributing guidelines](/docs/guidelines/contributing.md)
- Issues with the tag
  [gardening](https://github.com/airyhq/airy/issues?q=is%3Aissue+is%3Aopen+label%3Agardening)
- Issues with the tag [good first
  patch](https://github.com/airyhq/airy/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+patch%22)

If you're still not sure where to start, open a [new
issue](https://github.com/airyhq/airy/issues/new) and we'll gladly help you get
started.


## Code of Conduct

To ensure a safe experience and a welcoming community, the Airy Core Platform
project adheres to the [contributor
convenant](https://www.contributor-covenant.org/) [code of
conduct](/code_of_conduct.md).
