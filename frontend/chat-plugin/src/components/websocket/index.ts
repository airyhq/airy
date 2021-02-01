import {Client, messageCallbackType, IFrame} from '@stomp/stompjs';
import 'regenerator-runtime/runtime';
import {start, getResumeToken, sendMessage} from '../api';
import {Text} from 'types';
import {MessagePayload} from 'httpclient';

declare const window: {
  airy: {
    h: string;
    cid: string;
    no_tls: boolean;
  };
};

const API_HOST = window.airy ? window.airy.h : 'chatplugin.airy';
const TLS_PREFIX = window.airy ? (window.airy.no_tls === true ? '' : 's') : '';

class WebSocket {
  client: Client;
  channel_id: string;
  token: string;
  resume_token: string;
  setInitialMessages: (messages: Array<MessagePayload>) => void;
  onReceive: messageCallbackType;

  constructor(
    channel_id: string,
    onReceive: messageCallbackType,
    setInitialMessages: (messages: Array<MessagePayload>) => void,
    resume_token?: string
  ) {
    this.channel_id = channel_id;
    this.onReceive = onReceive;
    this.resume_token = resume_token;
    this.setInitialMessages = setInitialMessages;
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

  onSend = (message: Text) => sendMessage(message, this.token);

  start = async () => {
    const response = await start(this.channel_id, this.resume_token);
    if (response.token && response.messages) {
      this.connect(response.token);
      this.setInitialMessages(response.messages);
      if (!this.resume_token) {
        await getResumeToken(this.token);
      }
    } else {
      localStorage.clear();
    }
  };

  onConnect = () => {
    this.client.subscribe('/user/queue/message', this.onReceive);
  };
}

export default WebSocket;
