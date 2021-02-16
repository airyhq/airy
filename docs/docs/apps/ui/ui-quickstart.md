---
title: Quickstart
sidebar_label: Quickstart
---

import SuccessBox from "@site/src/components/SuccessBox";
import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>

In this Quickstart we are **creating a user** and using its credentials to **log
in to the UI**

</TLDR>

- [Introduction](#introduction)
- [Step 1: Registration](#step-1-registration)
- [Step 2: Open the UI](#step-2-open-the-ui)
- [Step 3: Login](#step-3-login)

## Introduction

The easiest way to see the Airy Core UI in action is to launch the
[Vagrant Box](getting-started/deployment/vagrant.md) and then follow these three
simple steps.

## Step 1: Registration

To register a new user in the Airy Core you can use the **users.signup**
[endpoint](api/endpoints/users.md#signup).

Alternatively you can run the
following [CLI command](cli/reference.md#api-signup) to create a default user.
You can also pass your own email and password as parameters. Otherwise these default
credentials will be used:

```
username: grace@example.com
password: the_answer_is_42
```

```bash
airy api signup
```

## Step 2: Open the UI

Either go to [ui.airy/login](http://ui.airy/login) in your browser or execute
this [CLI command](cli/reference.md#api-login):

```bash
airy ui
```

## Step 3: Login

Now enter your credentials on the login page and click **Login**.

<img alt="channels_connect" src={useBaseUrl('img/apps/ui/login.gif')} />

<SuccessBox>

:tada: **Congratulations!**

**You are now in the UI!** Next step: Make
yourself familiar with the [Inbox](/apps/ui/inbox.md)

</SuccessBox>
