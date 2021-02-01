---
title: Authentication
sidebar_label: Authentication
---

In order to communicate with the Airy Core API, you need a valid
[JWT](https://jwt.io/) token. Get a valid token by sending a request to the
login endpoint [login](#login). It returns a short-lived JWT token you can use
for HTTP requests.

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
