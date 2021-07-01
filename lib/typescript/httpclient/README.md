### HttpClient Library

The HttpClient Library includes a HTTP client for making requests to [Airy](https://airy.co/docs/core/)'s API.

The library exports a HttpClient class with public methods that make requests to Airy's API.

To use the library, you need to instantiate the class with an Airy Core API URL.

## Install

```bash
npm install --save @airyhq/http-client
```

or

```bash
yarn add @airyhq/http-client
```

## Usage

```typescript
import {HttpClient} from "@airyhq/httpclient";

const client = new HttpClient("http://airy.core");
client.listChannels().then(channels => console.debug("channels", channels));
```

## License

Apache 2.0 © [Airy, Inc.](https://airy.co)
