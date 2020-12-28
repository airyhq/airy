import {Client, messageCallbackType, IFrame} from '@stomp/stompjs';
import 'regenerator-runtime/runtime';

// Default to hostname set by local environment

const API_HOST = window.airy.h || 'chatplugin.api';

// Allow turning off ssl (unsafe!) for local development
const TLS_PREFIX = window.airy.no_tls === true ? '' : 's';

class Websocket {
  client: Client;
  channel_id: string;
  token: string;
  onReceive: messageCallbackType;

  constructor(channel_id: string, onReceive: messageCallbackType) {
    this.channel_id = channel_id;
    this.onReceive = onReceive;
  }

  connect = (token: string) => {
    this.token = token;

    this.client = new Client({
      brokerURL: `ws${TLS_PREFIX}://${API_HOST}/ws.chatplugin`,
      connectHeaders: {
        Authorization: token,
      },
      debug: function(str) {
        console.info(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.onConnect;

    this.client.onStompError = function(frame: IFrame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  };

  onConnect = () => {
    this.client.subscribe('/user/queue/message', this.onReceive);
  };

  onSend = (message: string) => {
    return fetch(`http${TLS_PREFIX}://${API_HOST}/chatplugin.send`, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
    });
  };

  async start() {
    try {
      const response = await fetch(`http${TLS_PREFIX}://${API_HOST}/chatplugin.authenticate`, {
        method: 'POST',
        body: JSON.stringify({
          channel_id: this.channel_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const jsonResponse = await response.json();
      this.connect(jsonResponse.token);
    } catch (e) {
      return Promise.reject(new Error('Widget authorization failed. Please check your installation.'));
    }
  }
}

export default Websocket;
