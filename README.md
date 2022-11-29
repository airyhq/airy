<p align="center">
  <img src="https://global-uploads.webflow.com/5e9d5014fb5d85233d05fa23/5ea6ab4327484b79bdb4cea4_airy_primary_rgb.svg" alt="Airy-logo" width="240">
  <div align="center">The open source, fully-featured, production ready</div>
  <div align="center">Data Platform</div>
</p>

# Airy Core

[![Join the chat on Airy community](https://img.shields.io/badge/forum-join%20discussions-brightgreen.svg)](https://airy.co/community/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Documentation Status](https://img.shields.io/badge/docs-stable-brightgreen.svg)](https://docs.airy.co/)
[![CI](https://github.com/airyhq/airy/workflows/CI/badge.svg)](https://github.com/airyhq/airy/actions?query=workflow%3ACI)
[![Commit Frequency](https://img.shields.io/github/commit-activity/m/airyhq/airy)](https://github.com/airyhq/airy/pulse)
[![License](https://img.shields.io/github/license/airyhq/airy)](https://github.com/airyhq/airy/blob/develop/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/airyhq/airy/projects)

---

![Airy_Explainer_Highlevel_Readme](https://airy.co/docs/core/img/getting-started/introduction-light.png)

Airy Core is an is an open-source streaming app framework to train ML models and supply them with historical and real-time data. With Airy you can process data from a variety of
sources:

- **Facebook**
- **WhatsApp**
- **Google's Business Messages**
- **SMS**
- **Website Chat Plugins, like our own open source Live Chat**
- **Twilio**
- **Any source you want with Custom Connectors**

You can then use Airy to:

- **Join historical and real-time data in the stream to create smarter ML and AI applications.**
- **Build real-time data pipelines and make real-time data universally accessible with our open-source streaming app framework.**
- **Standardize complex data ingestion and consume data directly from Kafka. Stream it directly to standard and customized applications, using pre-built, easily configured connectors.**
- **Significantly simplify deployment and reduce development times and increase the robustness of your infrastructure and apps.**

Since Airy's infrastructure is built around Apache Kafka, it can process a large
amount of events simultaneously and stream the relevant
real-time and historical data to wherever you need it.

---

## About Airy

- **What does Airy do? 🚀**
  [Learn more on our Website](https://airy.co/)

- **I'm new to Airy 😄**
  [Get Started with Airy](https://airy.co/docs/core/)

- **I'd like to read the detailed docs 📖**
  [Read The Docs](https://airy.co/docs/core/)

- **I'm ready to install Airy ✨**
  [Installation](https://airy.co/docs/core/getting-started/installation/introduction)

- **I'm ready for the Airy Quickstart 🚀**
  [Quickstart](https://airy.co/docs/core/getting-started/quickstart)

- **I have a question ❓**
  [The Airy Community will help](https://airy.co/community)

---

## Components

![Airy_Explainer_Components_Readme (1)](https://user-images.githubusercontent.com/12533283/112460661-6de3fe80-8d5f-11eb-8274-8446fbfcf5c8.png)

Airy Core comes with all the components you need to stream historical and real-time data.

- 💬 Pre-built and easily configurable [connectors](https://airy.co/docs/core/sources/introduction)

By ingesting all real-time events and continuously processing, aggregating and joining them in the stream, development time can be significantly reduced. Through integrations with pre-built and easily configured connectors, events are consumed from any source, including business systems such as ERP/CRM, conversational sources, third party APIs. Airy also comes with an SDK to build custom connectors to any source.

- ⚡[APIs](https://airy.co/docs/core/api/introduction) to access your data

An [API](https://airy.co/docs/core/api/introduction) to access
data with blazing fast HTTP endpoints.

- 🔌[WebSockets](https://airy.co/docs/core/api/websocket) to power real-time applications

A [WebSocket server](https://airy.co/docs/core/api/websocket) that allows
clients to receive near real-time updates about data flowing through the system.

- 🎣[Webhook](https://airy.co/docs/core/api/webhook) to listen to events and create actionable workflows

A webhook integration server that allows its users to create actionable workflows (the webhook integration
exposes events users can "listen" to and react programmatically.)

- 💎[UI: From a control center to dashboards](https://airy.co/docs/core/apps/ui/introduction)

No-code interfaces to manage and control Airy, your connectors and your streams.

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

To ensure a safe experience and a welcoming community, Airy Core project adheres
to the [contributor convenant](https://www.contributor-covenant.org/) [code of
conduct](/code_of_conduct.md).
