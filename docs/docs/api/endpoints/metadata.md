---
title: Metadata
sidebar_label: Metadata
---

Refer to our [metadata](getting-started/glossary.md#metadata) definition for
more information.

## Set

`POST /metadata.set`

```json
{
  "conversation_id": "conversation-id",
  "key": "ad.id",
  "value": "Grace"
}
```

The endpoint returns status code `200` if the operation was successful, and
`400` if not.

## Remove

`POST /metadata.remove`

```json
{
  "conversation_id": "conversation-id",
  "key": "ad.id"
}
```

This endpoint returns status code `200` if the operation was successful, and
`500` if not.
