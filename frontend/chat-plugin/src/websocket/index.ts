import {Client, messageCallbackType, IFrame} from '@stomp/stompjs';
import 'regenerator-runtime/runtime';
import {start, getResumeToken, sendMessage} from '../api';
import {SuggestionResponse, TextContent} from 'render/providers/chatplugin/chatPluginModel';
import {Message} from 'httpclient';
import {resetStorage} from '../storage';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

declare const window: {
  airy: {
    h: string;
    cid: string;
    no_tls: boolean;
  };
};

const API_HOST = window.airy ? window.airy.h : 'chatplugin.airy';
// https: -> wss: and http: -> ws:
const protocol = location.protocol.replace('http', 'ws');

class WebSocket {
  client: Client;
  channelId: string;
  token: string;
  resumeToken: string;
  setInitialMessages: (messages: Array<Message>) => void;
  onReceive: messageCallbackType;

  constructor(
    channelId: string,
    onReceive: messageCallbackType,
    setInitialMessages: (messages: Array<Message>) => void,
    resumeToken?: string
  ) {
    this.channelId = channelId;
    this.onReceive = onReceive;
    this.resumeToken = resumeToken;
    this.setInitialMessages = setInitialMessages;
  }

  connect = (token: string) => {
    this.token = token;

    this.client = new Client({
      brokerURL: `${protocol}//${API_HOST}/ws.chatplugin`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
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

  onSend = (message: TextContent | SuggestionResponse) => sendMessage(message, this.token);

  start = async () => {
    const response = await start(this.channelId, this.resumeToken);
    if (response.token && response.messages) {
      this.connect(response.token);
      this.setInitialMessages(
        response.messages.map(message => ({
          ...camelcaseKeys(message, {deep: true, stopPaths: ['content']}),
          sentAt: new Date(message.sent_at),
        }))
      );
      if (!this.resumeToken) {
        await getResumeToken(this.channelId, this.token);
      }
    } else {
      resetStorage(this.channelId);
    }
  };

  onConnect = () => {
    this.client.subscribe('/user/queue/message', this.onReceive);
  };
}

export default WebSocket;
