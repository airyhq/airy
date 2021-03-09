### WebSocketClient Library

The WebSocketClient Library includes a WebSocket client for Airy's WebSocket API.

The library exports a WebsocketClient class. To use the library, you need to instantiate the class with the authentification token, the callback map and your api url. The api url is optional (the default api url is "api.airy").

For each message that is delivered through the WebSocket, a method is called.

For example:

```
import { WebSocketClient} from 'websocketclient';

const myInstance = new WebSocketClient(authtoken, {onMessage: (conversationId, channelId, message) => console.log(message)});

```
