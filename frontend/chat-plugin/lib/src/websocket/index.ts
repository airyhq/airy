import {Client, messageCallbackType, IFrame} from '@stomp/stompjs';
import 'regenerator-runtime/runtime';
import {authenticate, getResumeToken, sendMessage} from '../api';
import {
  QuickReplyCommand,
  SimpleAttachmentPayload,
  SuggestionResponse,
  TextContent,
} from 'render/providers/chatplugin/chatPluginModel';
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
  reconnectIntervalHandle: number;
  isConnected: boolean;
  onConnectionChange: (state: ConnectionState) => void;

  constructor(
    apiHost: string,
    channelId: string,
    onReceive: messageCallbackType,
    setInitialMessages: (messages: Array<Message>) => void,
    onConnectionChange: (state: ConnectionState) => void
  ) {
    this.apiHost = new URL(apiHost).host;
    this.channelId = channelId;
    this.onReceive = onReceive;
    this.setInitialMessages = setInitialMessages;
    this.isConnected = false;
    this.onConnectionChange = onConnectionChange;
  }

  connect = (token: string) => {
    this.token = token;

    if (this.client) {
      this.client.deactivate();
    }

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

    this.client.onStompError = (frame: IFrame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);      
      if (frame.headers['message'].includes('401')) {
        this.client.deactivate();
        this.start();
      } else {
        authenticate(this.channelId);
      }
    };
    this.client.activate();
  };

  onSend = (message: TextContent | SimpleAttachmentPayload | SuggestionResponse | QuickReplyCommand) =>
    sendMessage(message, this.token);

  start = async () => {
    const resumeToken = getResumeTokenFromStorage(this.channelId);
    const response = await authenticate(this.channelId, resumeToken);

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
    clearTimeout(this.reconnectIntervalHandle);
    this.onConnectionChange(ConnectionState.Connected);
  };

  tryReconnect = () => {
    this.reconnectIntervalHandle = window.setTimeout(this.reconnect, 5000);
  };

  reconnect = () => {
    if (!this.isConnected) {
      this.connect(this.token);
    }
  };

  onWebSocketClose = () => {
    this.isConnected = false;
    this.onConnectionChange(ConnectionState.Disconnected);
    this.tryReconnect();
  };
}

export default WebSocket;
