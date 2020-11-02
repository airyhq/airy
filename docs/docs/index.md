---
id: index
title: Home
slug: /
---

The Airy Core Platform is a fully-featured, production ready messaging platform
that allows its user to process messaging data from a variety of sources (like
facebook messenger or google business messages). The core platform contains the
following components:

- A ingestion platform that heavily relies on [Apache
  Kafka](https://kafka.apache.org) to process incoming webhook data from
  different sources. We make sense of the data and reshape it into source
  independent contacts, conversations, and messages (see our
  [glossary](/docs/docs/glossary.md) for formal definitions).

- A [React](https://reactjs.org/) UI component library which we showcase at
  [components.airy.co](https://components.airy.co)

- An [API](/docs/docs/api.md) to manage the data sets the platform
  handles.

- A webhook integration server that allows its users to programmatically
  participate in conversations by sending messages (the webhook integration
  exposes events users can "listen" to and react programmatically.)

- A WebSocket server that allows clients to receive near real-time updates about
  data flowing through the system.

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
found, the script will attempt to install them for you. Check out our [user
guide](/docs/docs/user-guide.md) for detailed information.
