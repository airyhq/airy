---
title: HTTP Client
sidebar_label: HTTP Client
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

The [@airyhq/http-client](https://www.npmjs.com/package/@airyhq/http-client) package contains a client for making requests to [Airy Core API's HTTP endpoints](/api/endpoints/introduction).

The client works both in the browser and Node.js.

</TLDR>

## Installation

Install the npm package via npm or yarn.

```
npm install --save @airyhq/http-client
```

or

```
yarn add @airyhq/http-client
```

## Initialize the client

The library exports an `HttpClient` class with public methods that make requests to the Airy Core API.

To get started, instantiate the `HttpClient` class with an Airy Core API URL:

```
const client = new HttpClient("http://airy.core");
```

## Call a method

Each method makes an HTTP request to the Airy Core API and returns a Promise, which resolves with the response data, or rejects with an error.

Some methods require a request payload object passed as an argument: refer to [HTTP endpoints' documentation](/api/endpoints/introduction) to learn more.

```
client.listChannels().then(channels => console.debug("channels", channels));
```
