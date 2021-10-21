---
title: Attachments
sidebar_label: Attachments
---

Many sources allow for sending and receiving attachments such as files, videos, images or audio recordings. In order
to persist media you need to enable the media service by providing a storage option in your [airy.yaml config](getting-started/installation/configuration.md).

## Upload a file

`POST /media.upload`

Expects a multi-part form upload including the original filename

**Sample curl**

```shell script
curl http://airy.core/media.upload \
-X POST \
-H "Content-Type: multipart/form-data" \
--form file=@test_image.jpg
```

**Sample response**

```json5
{
  "media_url": "http://your-storage-provider.com/path/uuid.jpg"
}
```
