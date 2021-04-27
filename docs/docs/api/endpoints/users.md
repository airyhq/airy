---
title: Users
sidebar_label: Users
---

## Get Profile

`POST /users.getProfile`

Returns the profile of the currently authenticated user. If there is no authentication configured or
the request was made using a system token the response will be empty. Refer to the [authentication docs](api/authentication.md) for more information.

**Sample response**

```json5
{
  "name": "Grace Hopper",
  "avatar_url": "http://example.org/avatar.jpg" // optional
}
```
