### WebSocketClient Library

The WebSocketClient Library includes a WebSocket client for Airy's WebSocket API.

The library exports a WebSocketClient class. To use the library, you need to instantiate the class with a callback map and your api url.

For example:

```typescript
import {WebSocketClient} from "websocketclient";

const client = new WebSocketClient(apiUrl, {onMessage: (conversationId, channelId, message) => console.log(message)});
```
