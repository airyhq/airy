import {StompWrapper} from './stompWrapper';
import {Message, Channel, MetadataEvent, Tag} from 'model';
import {EventPayload} from './payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

type CallbackMap = {
  onMessage?: (conversationId: string, channelId: string, message: Message) => void;
  onMetadata?: (metadataEvent: MetadataEvent) => void;
  onChannel?: (channel: Channel) => void;
  onTag?: (tag: Tag) => void;
  onError?: () => void;
};

// https: -> wss: and http: -> ws:
const protocol = location.protocol.replace('http', 'ws');

export class WebSocketClient {
  public readonly apiUrlConfig?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(apiUrl: string, callbackMap: CallbackMap = {}) {
    this.callbackMap = callbackMap;
    this.apiUrlConfig = `${protocol}//${new URL(apiUrl).host}/ws.communication`;

    this.stompWrapper = new StompWrapper(
      this.apiUrlConfig,
      {
        '/events': item => {
          this.onEvent(item.body);
        },
      },
      this.onError
    );
    this.stompWrapper.initConnection();
  }

  destroyConnection = () => this.stompWrapper.destroyConnection();

  onEvent = (body: string) => {
    const json = JSON.parse(body) as EventPayload;
    switch (json.type) {
      case 'channel.updated':
        this.callbackMap.onChannel?.(camelcaseKeys(json.payload, {deep: true, stopPaths: ['metadata.user_data']}));
        break;
      case 'message.created':
        this.callbackMap.onMessage?.(json.payload.conversation_id, json.payload.channel_id, {
          ...camelcaseKeys(json.payload.message, {deep: true, stopPaths: ['content']}),
          sentAt: new Date(json.payload.message.sent_at),
        });
        break;
      case 'metadata.updated':
        this.callbackMap.onMetadata?.(json.payload);
        break;
      case 'tag.updated':
        this.callbackMap.onTag?.(json.payload);
        break;
      default:
        console.error('Unknown /events payload', json);
    }
  };

  onError = () => this.callbackMap.onError && this.callbackMap.onError();
}
