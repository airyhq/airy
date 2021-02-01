---
title: Channels
sidebar_label: Channels
---

Refer to our [channel](getting-started/glossary.md#channel) definition
for more information.

## List

`POST /channels.list`

**Sample response**

```json5
{
  "data": [
    {
      "id": "channel-uuid-1",
      "name": "my page 1",
      "source": "facebook",
      "source_channel_id": "fb-page-id-1",
      "image_url": "http://example.org/avatar.jpeg" // optional
    },
    {
      "id": "channel-uuid-2",
      "name": "my page 2",
      "source": "facebook",
      "source_channel_id": "fb-page-id-2"
    }
  ]
}
```
