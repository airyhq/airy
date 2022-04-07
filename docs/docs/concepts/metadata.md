---
title: Metadata
sidebar_label: Metadata
---

We address the main use case of a messaging platform with conversations, channels and messages. However, this
is not enough for users to address the wide variety of messaging workflows that exist such as automating and
suggesting replies, attaching contact information etc.

For this reason we introduced an extension to the data model that we call metadata. Metadata in the context
of the Airy Core platform is an optional document you can attach to a subject, which consists of a
namespace i.e. "conversation" and an identifier within that namespace i.e. the conversation id.

Our [HTTP APIs](/api/endpoints/introduction.md) expose this metadata, see for instance the
`conversation.metadata` field, and it can be streamed via the [websocket](/api/websocket.md) and [webhook](/api/webhook.md).

### Subject

A metadata subject consists of a namespace, such as `conversation`, and a namespace identifier, which is
the identifier that uniquely identifies the entity that the metadata is bound to within the namespace.

Therefore, the **subject** of a conversation with id `123` would be `conversation:123`.

### Document

The document model can be seen as a series of Key-Value update pairs. Doing so makes it possible for clients
to update metadata without necessarily having access to the full document, which is a useful property
in distributed streaming systems.

Therefore, we store each metadata document internally as a series of metadata records, where the key uses
JSON dot notation to reflect nested data. Take for instance the following series of metadata records
for a conversation:

| Key                | Value  |
| ------------------ | ------ |
| contact.first_name | Grace  |
| contact.last_name  | Hopper |
| state              | open   |

The API payloads expose this list as the following metadata document:

```json5
{
  "contact": {
    "first_name": "Grace",
    "last_name": "Hopper"
  },
  "state": "open"
}
```

### Limitations

We don't aim to perfectly map granular JSON updates to this data model, so here are a few limitations to be aware of when
developing against airy metadata:

- JSON arrays are stored as a single value. So concurrent writes to the same key will overwrite each other.
- All numbers are parsed back with Java Double precision
