import {Client, messageCallbackType, IFrame} from '@stomp/stompjs';
import 'regenerator-runtime/runtime';
import {start, getResumeToken, sendMessage} from '../api';
import {QuickReplyCommand, SuggestionResponse, TextContent} from 'render/providers/chatplugin/chatPluginModel';
import {Message} from 'model';
import {getResumeTokenFromStorage, resetStorage} from '../storage';

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

// https: -> wss: and http: -> ws:
const protocol = location.protocol.replace('http', 'ws');

export enum ConnectionState {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
}

class WebSocket {
  client: Client;
  apiHost: string;
  channelId: string;
  token: string;
  setInitialMessages: (messages: Array<Message>) => void;
  onReceive: messageCallbackType;
  reconnectTimeout: number;
  isConnected: boolean;
  updateConnectionState: (state: ConnectionState) => void;

  constructor(
    apiHost: string,
    channelId: string,
    onReceive: messageCallbackType,
    setInitialMessages: (messages: Array<Message>) => void,
    updateConnectionState: (state: ConnectionState) => void
  ) {
    this.apiHost = new URL(apiHost).host;
    this.channelId = channelId;
    this.onReceive = onReceive;
    this.setInitialMessages = setInitialMessages;
    this.isConnected = false;
    this.updateConnectionState = updateConnectionState;
  }

  connect = (token: string) => {
    this.token = token;

    this.client = new Client({
      brokerURL: `${protocol}//${this.apiHost}/ws.chatplugin`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.onConnect;
    this.client.onWebSocketClose = this.onWebSocketClose;

    this.client.onStompError = function (frame: IFrame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  };

  onSend = (message: TextContent | SuggestionResponse | QuickReplyCommand) => sendMessage(message, this.token);

  start = async () => {
    const resumeToken = getResumeTokenFromStorage(this.channelId);
    const response = await start(this.channelId, resumeToken);
    if (response.token && response.messages) {
      this.connect(response.token);
      this.setInitialMessages(
        response.messages.map(message => ({
          ...camelcaseKeys(message, {deep: true, stopPaths: ['content']}),
          sentAt: new Date(message.sent_at),
        }))
      );
      if (!resumeToken) {
        await getResumeToken(this.channelId, this.token);
      }
    } else {
      resetStorage(this.channelId);
    }
  };

  onConnect = () => {
    this.client.subscribe('/user/queue/message', this.onReceive);
    this.isConnected = true;
    clearTimeout(this.reconnectTimeout);
    this.updateConnectionState(ConnectionState.Connected);
  };

  tryReconnect = () => {
    this.reconnectTimeout = window.setTimeout(this.reconnect, 5000);
  };

  reconnect = () => {
    if (!this.isConnected) {
      this.start();
    }
  };

  onWebSocketClose = () => {
    this.isConnected = false;
    this.updateConnectionState(ConnectionState.Disconnected);
    this.tryReconnect();
  };
}

export default WebSocket;
