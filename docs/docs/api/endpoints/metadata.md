---
title: Metadata
sidebar_label: Metadata
---

Refer to our [metadata](getting-started/glossary.md#metadata) definition for
more information.

## Upsert

This endpoint takes a `data` object and upserts the metadata for the `id`.

`POST /metadata.upsert`

**Sample Request**

```json5
{
  "id": "{String}", //id of the subject
  "subject": "conversation|message|channel",
  "data": {
    "sentFrom": "iPhone"
  }
}
```

The endpoint returns status code `200` if the operation was successful, and
`400` if not.
