import { Client, messageCallbackType, IFrame } from "@stomp/stompjs";
import "regenerator-runtime/runtime";

// @ts-ignore
// Default to hostname set by local environment
const API_HOST = window.airy.h || "chatplugin.api";

class Websocket {
  client: Client;
  channel_id: string;
  onReceive: messageCallbackType;

  constructor(channel_id: string, onReceive: messageCallbackType) {
    this.channel_id = channel_id;
    this.onReceive = onReceive;
  }

  connect = (token: string) => {
    this.client = new Client({
      brokerURL: `wss://${API_HOST}/ws.chatplugin`,
      connectHeaders: {
        Authorization: token
      },
      debug: function(str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = this.onConnect;

    this.client.onStompError = function(frame: IFrame) {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };

    this.client.activate();
  };

  onConnect = () => {
    this.client.subscribe("/user/queue/message", this.onReceive);
  };

  onSend = (message: string) => {
    return fetch(`https://${API_HOST}/chatplugin.send`, {
      method: "POST",
      body: message,
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  async start() {
    try {
      const response = await fetch(
        `https://${API_HOST}/chatplugin.authenticate`,
        {
          method: "POST",
          body: JSON.stringify({
            channel_id: this.channel_id
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const jsonResponse = await response.json();
      this.connect(jsonResponse.token);
    } catch (e) {
      return Promise.reject(
        new Error(
          "Widget authorization failed. Please check your installation."
        )
      );
    }
  }
}

export default Websocket;
