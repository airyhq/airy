<p align="center">
  <img src="https://global-uploads.webflow.com/5e9d5014fb5d85233d05fa23/5ea6ab4327484b79bdb4cea4_airy_primary_rgb.svg" alt="Airy-logo" width="240">


  <div align="center">The open source, fully-featured, production ready</div>
  <div align="center">Messaging platform</div>
</p>



# Airy Core Platform

[![Join the chat on Airy community](https://img.shields.io/badge/forum-join%20discussions-brightgreen.svg)](https://airy.co/community/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Documentation Status](https://img.shields.io/badge/docs-stable-brightgreen.svg)](https://docs.airy.co/)
[![CI](https://github.com/airyhq/airy/workflows/CI/badge.svg)](https://github.com/airyhq/airy/actions?query=workflow%3ACI)
[![Commit Frequency](https://img.shields.io/github/commit-activity/m/airyhq/airy)](https://docs.airy.co/)
[![License](https://img.shields.io/github/license/airyhq/airy)](https://docs.airy.co/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/airyhq/airy/projects)


The Airy Core Platform is an open source, fully-featured, production ready
messaging platform.
With Airy you can process conversational data from a variety of sources:

 - **Facebook**
 - **WhatsApp**
 - **Google's Business Messages**
 - **SMS**
 - **Website Chat Plugins**
 - **Twilio**
 - **Your own conversational channels**

You can then use Airy to:

 - **Unify your messaging channels**
 - **Stream your conversational data wherever you want**
 - **Integrate with different NLP frameworks**
 - **Mediate open requests with Agents via our messaging UI**
 - **Analyze your conversations**

Since Airy's infrastructure is built around Apache Kafka, it can process a
large amount of conversations and messages simultaneously and stream the
relevant conversational data to wherever you need it.

Learn more about what we open-sourced in the
[announcement blog post](https://airy.co/blog/what-we-open-sourced).

## About Airy

- **What does Airy do? 🚀**
  [Learn more on our Website](https://airy.co/developers)

- **I'm new to Airy 😄**
  [Get Started with Airy](https://docs.airy.co/)

- **I'd like to read the detailed docs 📖**
  [Read The Docs](https://docs.airy.co/)

- **I'm ready to install Airy ✨**
  [Installation](https://docs.airy.co/)

- **I have a question ❓**
  [The Airy Community will help](https://airy.co/community)

- **Or continue reading the Read Me**

  - [Getting started](#getting-started)
  - [Components](#components)
  - [Organization of the Repository](#organization-of-the-repository)
  - [Design Principles](#design-principles)
  - [How to contribute](#how-to-contribute)
  - [Code of Conduct](#code-of-conduct)

## Getting started

You can run the Airy Core Platform locally by running the following commands:

```sh
$ git clone https://github.com/airyhq/airy
$ cd airy
$ ./scripts/bootstrap.sh
```

The bootstrap installation requires
[Vagrant](https://www.vagrantup.com/downloads) and
[VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not
found, the script will attempt to install them for you. Check out our [test
deployment guide](/docs/docs/guides/airy-core-in-test-env.md) for detailed information.

## Components

The Airy Core Platform contains the following components:

- An ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](/docs/docs/glossary.md) for formal definitions).

- An [API](/docs/docs/api/http.md) to manage the data sets the platform
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

- Our [contributing guide](/docs/docs/guides/contributing.md)
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
