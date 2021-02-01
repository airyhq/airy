---
title: Users
sidebar_label: Users
---

Refer to our [user](getting-started/glossary.md#user) definition for more
information.

## Signup

`POST /users.signup`

**Sample request**

```json
{
  "first_name": "Grace",
  "last_name": "Hopper",
  "password": "the_answer_is_42",
  "email": "grace@example.com"
}
```

The password **must** be at least 6 characters long.

**Sample response**

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "token": "JWT_TOKEN"
}
```

This endpoint returns the same response as `POST /login`.
