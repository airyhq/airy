---
title: Components
sidebar_label: Components
---

#### The core platform contains the following components:

- An ingestion platform that heavily relies on Apache Kafka to process incoming webhook data from different sources. We make sense of the data and reshape it into source independent contacts, conversations, and messages (see our glossary for formal definitions).

* An HTTP API that allows you to manage the data sets the platform handles.

- A webhook integration server that allows you to programmatically participate in conversations by sending messages. The webhook integration exposes events you can "listen" to and react programmatically.

* A WebSocket server that allows you to receive near real-time updates about the data flowing through the system.
