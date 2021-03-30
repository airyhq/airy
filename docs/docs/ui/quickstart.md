---
title: Quickstart
sidebar_label: Quickstart
---

import SuccessBox from "@site/src/components/SuccessBox";
import useBaseUrl from '@docusaurus/useBaseUrl';
import ButtonBox from "@site/src/components/ButtonBox";
import TLDR from "@site/src/components/TLDR";
import PrototypeSVG from "@site/static/icons/prototype.svg";

<TLDR>

In this Quickstart we are **creating a user** and using its credentials to **log
in to the UI**

</TLDR>

The easiest way to see the Airy Core UI in action is to launch the [minikube
provider](getting-started/installation/minikube.md) and then follow these three
steps:

- [Step 1: Registration](#step-1-registration)
- [Step 2: Open the UI](#step-2-open-the-ui)
- [Step 3: Login](#step-3-login)

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

Run this [CLI command](cli/reference.md#ui):

```bash
airy ui
```

## Step 3: Login

Now enter your credentials on the login page and click **Login**.

<img alt="login" src={useBaseUrl('img/ui/login.gif')} />

<SuccessBox>

:tada: **SUCCESS!**

**You are now in the UI!**

</SuccessBox>

###

<ButtonBox
icon={<PrototypeSVG />}
iconInvertible={true}
title='Next Step: Discover the Inbox'
description='Now that you can access the UI it is time to discover the Inbox and its features '
link='ui/inbox'
/>
