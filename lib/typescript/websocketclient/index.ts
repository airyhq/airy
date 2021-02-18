import {StompWrapper} from './stompWrapper';
import {Message, Channel, messageMapper, MetadataEvent} from 'httpclient';
import {EventPayloadUnion} from './payload';
import {channelMapper} from '../httpclient/mappers';

type CallbackMap = {
  onMessage?: (conversationId: string, channelId: string, message: Message) => void;
  onMetadata?: (metadataEvent: MetadataEvent) => void;
  onChannel?: (channel: Channel) => void;
  onError?: () => void;
};

export class WebSocketClient {
  public readonly token?: string;
  public readonly apiUrlConfig?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(token: string, callbackMap: CallbackMap = {}, baseUrl: string) {
    this.token = token;
    this.callbackMap = callbackMap;
    this.apiUrlConfig = `ws://${baseUrl}/ws.events`;

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
    const json: EventPayloadUnion = JSON.parse(body);
    switch (json.type) {
      case 'channel':
        this.callbackMap.onChannel?.(channelMapper(json.payload));
        break;
      case 'message':
        this.callbackMap.onMessage?.(
          json.payload.conversation_id,
          json.payload.channel_id,
          messageMapper(json.payload.message)
        );
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
