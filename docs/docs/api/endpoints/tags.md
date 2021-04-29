---
title: Tags
sidebar_label: Tags
---

Refer to our [tag](getting-started/glossary.md#tag) definition for more
information.

## Create

`POST /tags.create`

**Sample request**

```json5
{
  "name": "Urgent",
  "color": "tag-red" // one of tag-red | tag-blue | tag-green | tag-purple
}
```

If the tag is successfully created, the request returns status code `201`
(created) with the tag ID in the response body.

**Sample response**

```json5
{
  "id": "TAG-UUID",
  "name": "Urgent",
  "color": "tag-red"
}
```

## Update

`POST /tags.update`

**Sample request**

```json
{
  "id": "TAG-ID",
  "name": "Urgent",
  "color": "tag-blue" // one of tag-red | tag-blue | tag-green | tag-purple
}
```

**Empty response (204)**

## Delete

`POST /tags.delete`

**Sample request**

```json
{
  "id": "ID-OF-THE-TAG"
}
```

**Empty response (204)**

## List

`POST /tags.list`

**Sample response**

```json5
{
  "tags": [
    {
      "id": "TAG-ID",
      "name": "name of the tag",
      "color": "tag-red"
    }
  ]
}
```
