### WebSocketClient Library

The WebSocketClient Library includes a WebSocket client for Airy's WebSocket API.

The library exports a WebsocketClient class. To use the library, you need to instantiate the class with the authentication token, the callback map and your api url.

For example:

```
import { WebSocketClient} from 'websocketclient';

const myInstance = new WebSocketClient(apiUrl, authToken, {onMessage: (conversationId, channelId, message) => console.log(message)});

```
