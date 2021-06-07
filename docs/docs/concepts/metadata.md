---
title: Metadata
sidebar_label: Metadata
---

We address the main use case of a messaging platform with conversations, channels and messages. However, this
is not enough for users to address the wide variety of messaging workflows that exist such as automating and
suggesting replies, attaching contact information etc.

For this reason we introduced an extension to the data model that we call metadata. Metadata in the context
of the Airy Core platform is an optional document you can attach to a subject, which consists of a
namespace i.e. "conversation" and an identifier within that namespace i.e. the conversation ID.

Our [HTTP APIs](/api/endpoints/introduction.md) expose this metadata, see for instance the
`conversation.metadata` field, and it can be streamed via the [websocket](/api/websocket.md) and [webhook](/api/webhook.md).

### Subject

A metadata subject consists of a namespace, such as `conversation`, and a namespace identifier, which is
the identifier that uniquely identifies the entity the metadata is bound to within the namespace.

Therefore, the subject of a conversation with ID `123` would be `conversation:123`.

### Document

The document model can be seen as a series of Key-Value update pairs. Doing so makes it possible for clients
to update metadata without necessarily having access to the full document, which is a useful constraint
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

Currently, this design introduces two limitations on the structure of metadata:

- We do not allow JSON arrays, as there is no standard way of encoding atomic list updates on the key
- When inserting metadata all values need to be strings

For the second limitation we have introduced implicit mappings that allow you to write strings
but return other data types when accessing them on the API:

- We attempt to parse the value of keys ending with `count` to numbers and to return a string if that fails
- We attempt to parse the value keys ending with `content` to a JSON node and to return a string if that fails
