import {
  ExploreChannelRequestPayload,
  ConnectChannelFacebookRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  CreateTagRequestPayload,
  LoginViaEmailRequestPayload,
  SendMessagesRequestPayload,
  TagConversationRequestPayload,
  UntagConversationRequestPayload,
  ListMessagesRequestPayload,
  ConnectChatPluginRequestPayload,
  ConnectTwilioSmsRequestPayload,
  ConnectTwilioWhatsappRequestPayload,
  UpdateChannelRequestPayload,
  ListTemplatesRequestPayload,
  PaginatedResponse,
} from './payload';

import {Tag, Message, Channel, User, Conversation, Config, Template} from './model';
import fetch from 'node-fetch';

export function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

type FetchOptions = {
  ignoreAuthToken?: boolean;
};

interface ApiRequest<T, K = void> {
  (requestPaylod: T): Promise<K>;
}
export class HttpClient {
  public readonly apiUrlConfig?: string;
  public token?: string;
  private unauthorizedErrorCallback?: (body: any) => void;

  constructor(apiUrlConfig: string, token?: string, unauthorizedErrorCallback?: (body: any) => void) {
    this.token = token;
    this.apiUrlConfig = apiUrlConfig;
    this.unauthorizedErrorCallback = unauthorizedErrorCallback;
  }

  private async parseBody(response: Response): Promise<any> {
    if (response.ok) {
      try {
        return await response.json();
      } catch {
        // NOP
      }
    }

    const body: string = await response.text();
    let errorResult: any;

    if (body.length > 0) {
      errorResult = JSON.parse(body) as any;
    }

    if (response.status == 403 && this.unauthorizedErrorCallback) {
      this.unauthorizedErrorCallback(errorResult);
    }

    throw {
      status: response.status,
      body: errorResult,
    };
  }

  private async doFetchFromBackend(url: string, body?: Object, options?: FetchOptions): Promise<any> {
    const headers = {
      Accept: 'application/json',
    };

    if (options?.ignoreAuthToken != true && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    if (!(body instanceof FormData)) {
      if (!isString(body)) {
        body = JSON.stringify(body);
      }
      headers['Content-Type'] = 'application/json';
    }

    const response: Response = await fetch(`${this.apiUrlConfig}/${url}`, {
      method: 'POST',
      headers: headers,
      body: body as BodyInit,
    });

    return this.parseBody(response);
  }

  public listChannels: ApiRequest<void, Channel[]>;

  public exploreFacebookChannels: ApiRequest<ExploreChannelRequestPayload, Channel[]>;

  public connectFacebookChannel: ApiRequest<ConnectChannelFacebookRequestPayload, Channel>;

  public connectChatPluginChannel: ApiRequest<ConnectChatPluginRequestPayload, Channel>;

  public connectTwilioSmsChannel: ApiRequest<ConnectTwilioSmsRequestPayload, Channel>;

  public connectTwilioWhatsappChannel: ApiRequest<ConnectTwilioWhatsappRequestPayload, Channel>;

  public updateChannel: ApiRequest<UpdateChannelRequestPayload, Channel>;

  public disconnectChannel: ApiRequest<DisconnectChannelRequestPayload>;

  public listConversations: ApiRequest<ListConversationsRequestPayload, PaginatedResponse<Conversation>>;

  public getConversationInfo: ApiRequest<string, Conversation>;

  public readConversations: ApiRequest<string>;

  public listMessages: ApiRequest<ListMessagesRequestPayload, PaginatedResponse<Message>>;

  public listTags: ApiRequest<void, Tag[]>;

  public createTag: ApiRequest<CreateTagRequestPayload, Tag>;

  public updateTag: ApiRequest<Tag>;

  public deleteTag: ApiRequest<string>;

  public loginViaEmail: ApiRequest<LoginViaEmailRequestPayload, User>;

  public tagConversation: ApiRequest<TagConversationRequestPayload>;

  public untagConversation: ApiRequest<UntagConversationRequestPayload>;

  public sendMessages: ApiRequest<SendMessagesRequestPayload, Message>;

  public getConfig: ApiRequest<void, Config>;

  public listTemplates: ApiRequest<ListTemplatesRequestPayload, Template[]>;
}
