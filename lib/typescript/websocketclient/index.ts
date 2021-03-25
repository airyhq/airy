import {StompWrapper} from './stompWrapper';
import {Message, Channel, MetadataEvent} from 'httpclient';
import {EventPayloadUnion} from './payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

type CallbackMap = {
  onMessage?: (conversationId: string, channelId: string, message: Message) => void;
  onMetadata?: (metadataEvent: MetadataEvent) => void;
  onChannel?: (channel: Channel) => void;
  onError?: () => void;
};

// https: -> wss: and http: -> ws:
const protocol = location.protocol.replace('http', 'ws');

export class WebSocketClient {
  public readonly token?: string;
  public readonly apiUrlConfig?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(apiUrl: string, token: string, callbackMap: CallbackMap = {}) {
    this.token = token;
    this.callbackMap = callbackMap;
    this.apiUrlConfig = `${protocol}//${new URL(apiUrl).host}/ws.communication`;

    this.stompWrapper = new StompWrapper(
      this.apiUrlConfig,
      {
        '/events': item => {
          this.onEvent(item.body);
        },
      },
      this.token,
      this.onError
    );
    this.stompWrapper.initConnection();
  }

  destroyConnection = () => {
    this.stompWrapper.destroyConnection();
  };

  onEvent = (body: string) => {
    const json: EventPayloadUnion = JSON.parse(body) as any;
    switch (json.type) {
      case 'channel':
        this.callbackMap.onChannel?.(camelcaseKeys(json.payload, {deep: true, stopPaths: ['metadata.user_data']}));
        break;
      case 'message':
        this.callbackMap.onMessage?.(json.payload.conversation_id, json.payload.channel_id, {
          ...camelcaseKeys(json.payload.message, {deep: true, stopPaths: ['content']}),
          sentAt: new Date(json.payload.message.sent_at),
        });
        break;
      case 'metadata':
        this.callbackMap.onMetadata?.(json.payload);
        break;
      default:
        console.error('Unknown /events payload', json);
    }
  };

  onError = () => {
    this.callbackMap.onError && this.callbackMap.onError();
  };
}
