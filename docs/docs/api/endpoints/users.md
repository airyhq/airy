---
title: Users
sidebar_label: Users
---

:::note

Different from contacts. See [glossary](getting-started/glossary.md#Contact).

:::

Users are not directly managed by Airy. Instead, users are managed by an [authentication](getting-started/installation/security.md) 
provider and whenever a user interacts with Airy their profile is presented in this API.  

## List

This is a [paginated](/api/endpoints/introduction.md#pagination) endpoint.

`POST /users.list`

**Sample request**

```json5
{
  "cursor": "next-cursor",
  "page_size": 2
}
```

**Sample Response**

```json5
{
  "data": [
    {
      "id": "user-id",
      "first_seen_at": "2022-01-11T16:07:23.602Z",
      "last_seen_at": "2022-01-12T16:07:23.602Z",
      "name": "Barbara Liskov", // optional
      "avatar_url": "http://example.org/profile.jpg" // optional
    },
    {
      "id": "user-id",
      "first_seen_at": "2022-01-11T16:07:23.602Z",
      "last_seen_at": "2022-01-12T16:07:23.602Z",
      "name": "Ada Lovelace"
    }
  ],
  "pagination_data": {
    "previous_cursor": null,
    "next_cursor": "2",
    "total": 104
  }
}
```
