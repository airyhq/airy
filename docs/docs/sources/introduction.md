---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Airy Core allows you to connect **many different sources**: our Live Chat
Plugin, Facebook Messenger, WhatsApp, your own custom sources.

</TLDR>

One of the crucial features Airy Core provides is the ability to process
conversational data from a variety of sources (like Facebook Messenger, Google
Business Messages, and so on).

The ingestion platform processes incoming webhook data from different sources.
It then makes sense of the data and reshapes it into source independent
contacts, conversations, and messages (see our [glossary](/getting-started/glossary.md) for definitions).

Of course, due the very nature of the problem, the code is very specific to the
thirty-party source it deals with. This frees you from dealing with these
integrations yourself.

While sources are all different, their architecture follows a few key
principles:

- The webhook integration ingests payload data as raw as you get it in a source
  specific topic.

- We only extracts metadata from the source data as we translate events into
  conversations and messages, the content is not parsed at ingestion time, we let
  it travel untouched through the system.

These principles allow you to reprocess data from a conversation platform at any
given point time. If the data pipeline has a bug, say the messages are counted
incorrectly, you can reprocess the data and fix a bug for past data as well.
