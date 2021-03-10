---
title: Authentication
sidebar_label: Authentication
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

To start using the API, you need to **authenticate first**.

</TLDR>

In order to communicate with the Airy Core API, you need a valid
[JWT Token](https://jwt.io/) token. The login endpoint [login](#login) returns such a short-lived
token which can be used to authenticate with endpoints via the [Bearer Authorization header](https://tools.ietf.org/html/rfc6750#section-2.1).

## Login

As the purpose of this endpoint is to obtain valid JWT tokens, it
does not require a valid token to be present in the headers.

`POST /users.login`

**Sample request**

```json5
{
  "email": "grace@example.com",
  "password": "avalidpassword"
}
```

**Sample response**

```json
{
  "id": "424242-4242-42-4242-4242",
  "first_name": "Grace",
  "last_name": "Hopper",
  "token": "JWT_TOKEN"
}
```
