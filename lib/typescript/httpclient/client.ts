import {
  ExploreChannelRequestPayload,
  ConnectChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  CreateTagRequestPayload,
  LoginViaEmailRequestPayload,
  SendMessagesRequestPayload,
  TagConversationRequestPayload,
  UntagConversationRequestPayload,
  MessagePayload,
  ListMessagesRequestPayload,
  ConnectChatPluginRequestPayload,
  UpdateChannelRequestPayload,
  ListTemplatesRequestPayload,
} from './payload';

import {Tag, Message} from './model';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

type FetchOptions = {
  ignoreAuthToken?: boolean;
};

export class HttpClient {
  public readonly apiUrlConfig?: string;
  public token?: string;
  private unauthorizedErrorCallback?: (body: any) => void;

  constructor(token?: string, apiUrlConfig?: string, unauthorizedErrorCallback?: (body: any) => void) {
    this.token = token;
    this.apiUrlConfig = apiUrlConfig || 'http://airy.core';
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

  private mapMessage = (payload: MessagePayload): Message => {
    return {...camelcaseKeys(payload, {deep: true, stopPaths: ['content']}), sentAt: new Date(payload.sent_at)};
  };

  public listChannels: () => Promise<any>;

  public exploreFacebookChannels: (requestPayload: ExploreChannelRequestPayload) => Promise<any>;

  public connectFacebookChannel: (requestPayload: ConnectChannelRequestPayload) => Promise<any>;

  public connectChatPluginChannel: (requestPayload: ConnectChatPluginRequestPayload) => Promise<any>;

  public updateChannel: (requestPayload: UpdateChannelRequestPayload) => Promise<any>;

  public disconnectChannel: (source: string, requestPayload: DisconnectChannelRequestPayload) => Promise<any>;

  public listConversations: (conversationListRequest: ListConversationsRequestPayload) => Promise<any>;

  public getConversationInfo: (conversationId: string) => Promise<any>;

  public readConversations: (conversationId: string) => Promise<any>;

  public listMessages: (conversationListRequest: ListMessagesRequestPayload) => Promise<any>;

  public listTags: () => Promise<any>;

  public createTag: (requestPayload: CreateTagRequestPayload) => Promise<any>;

  public updateTag: (tag: Tag) => Promise<any>;

  public deleteTag: (id: string) => Promise<any>;

  public loginViaEmail: (requestPayload: LoginViaEmailRequestPayload) => Promise<any>;

  public tagConversation: (requestPayload: TagConversationRequestPayload) => Promise<any>;

  public untagConversation: (requestPayload: UntagConversationRequestPayload) => Promise<any>;

  public sendMessages: (requestPayload: SendMessagesRequestPayload) => Promise<any>;

  public getConfig: () => Promise<any>;

  public listTemplates: (requestPayload: ListTemplatesRequestPayload) => Promise<any>;
}
