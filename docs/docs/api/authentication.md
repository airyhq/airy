---
title: Authentication
sidebar_label: Authentication
---

By default, authentication is disabled. To protect your API endpoints you need to set the `security.systemToken`
[cluster configuration](getting-started/installation/configuration.md) value in your `airy.yaml` and apply it.

Once that is done you authenticate by setting the token as a value on the [Bearer Authorization header](https://tools.ietf.org/html/rfc6750#section-2.1) when making requests.
