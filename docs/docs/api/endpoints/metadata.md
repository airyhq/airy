---
title: Metadata
sidebar_label: Metadata
---

Refer to our [metadata design](concepts/metadata.md) document for more information.

## Upsert

This endpoint takes a `data` object and upserts the metadata for the `id`. Arrays may only contain one data type.

`POST /metadata.upsert`

**Sample Request**

```json5
{
  "id": "{String}", // subject namespace identifier
  "subject": "conversation|message|channel", // subject namespace
  "data": {
    "sentFrom": "iPhone"
  }
}
```

The endpoint returns status code `200` if the operation was successful, and `400` if not.
