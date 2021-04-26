### HttpClient Library

The HttpClient Library includes a HTTP client for making requests to Airy's API.

The library exports a HttpClient class with public methods that make requests to
Airy's API.

To use the library, you need to instantiate the class with an Airy Core API URL.

For example:

```typescript
import {HttpClient} from "httpclient";

const client = new HttpClient("http://airy.core");
client.listChannels().then(channels => console.debug("channels", channels));
```
