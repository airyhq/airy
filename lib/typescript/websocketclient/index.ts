import {StompWrapper} from './stompWrapper';
import {Message, Channel} from 'httpclient';
import {messageMapper} from 'httpclient/mappers/messageMapper';
import {channelMapper} from 'httpclient/mappers/channelMapper';

type CallbackMap = {
  onMessage?: (conversationId: string, channelId: string, message: Message) => void;
  onUnreadCountUpdated?: (conversationId: string, unreadMessageCount: number) => void;
  onChannelConnected?: (channel: Channel) => void;
  onChannelDisconnected?: (channel: Channel) => void;
  onError?: () => void;
};

export class WebSocketClient {
  public readonly token?: string;
  public readonly apiUrlConfig?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(token: string, callbackMap: CallbackMap, baseUrl: string) {
    this.token = token;
    this.callbackMap = callbackMap;
    this.apiUrlConfig = `ws://${baseUrl}/ws.communication`;

    this.stompWrapper = new StompWrapper(
      this.apiUrlConfig,
      {
        '/queue/message': item => {
          this.parseMessageBody(item.body);
        },
        '/queue/unread-count': item => {
          this.parseUnreadBody(item.body);
        },
        '/queue/channel/connected': item => {
          this.parseChannelConnected(item.body);
        },
        '/queue/channel/disconnected': item => {
          this.parseChannelDisconnected(item.body);
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

  parseMessageBody = (body: string) => {
    if (this.callbackMap && this.callbackMap.onMessage) {
      const json = JSON.parse(body);
      const message = messageMapper(json.message);
      this.callbackMap.onMessage(json.conversation_id, json.channel_id, message);
    }
  };

  parseUnreadBody = (body: string) => {
    if (this.callbackMap && this.callbackMap.onUnreadCountUpdated) {
      const json = JSON.parse(body);
      this.callbackMap.onUnreadCountUpdated(json.conversation_id, json.unread_message_count);
    }
  };

  parseChannelConnected = (body: string) => {
    if (this.callbackMap && this.callbackMap.onChannelConnected) {
      const json = JSON.parse(body);
      this.callbackMap.onChannelConnected(channelMapper(json));
    }
  };

  parseChannelDisconnected = (body: string) => {
    if (this.callbackMap && this.callbackMap.onChannelDisconnected) {
      const json = JSON.parse(body);
      this.callbackMap.onChannelDisconnected(channelMapper(json));
    }
  };

  onError = () => {
    this.callbackMap && this.callbackMap.onError && this.callbackMap.onError();
  };
}
