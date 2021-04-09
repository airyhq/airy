import {Tag, Message, Channel, User, Conversation, Config, Template} from 'model';
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
import {
  listChannelsDef,
  listConversationsDef,
  exploreFacebookChannelsDef,
  connectFacebookChannelDef,
  connectChatPluginChannelDef,
  connectTwilioSmsChannelDef,
  connectTwilioWhatsappChannelDef,
  updateChannelDef,
  disconnectChannelDef,
  getConversationInfoDef,
  readConversationsDef,
  listMessagesDef,
  listTagsDef,
  createTagDef,
  loginViaEmailDef,
  updateTagDef,
  deleteTagDef,
  tagConversationDef,
  untagConversationDef,
  sendMessagesDef,
  getConfigDef,
  listTemplatesDef,
} from './endpoints';

function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

type FetchOptions = {
  ignoreAuthToken?: boolean;
};

interface ApiRequest<T, K = void> {
  (requestPayload: T): Promise<K>;
}

interface EndpointDefinition<T, K = void> {
  endpoint: string | ((requestPayload: T) => string);
  mapRequest?: (requestPayload: T) => any;
  mapResponse?: (any) => K;
  opts?: FetchOptions;
}

export class HttpClient {
  public readonly apiUrlConfig?: string;
  public token?: string;
  private readonly unauthorizedErrorCallback?: (body: any) => void;

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
        return;
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

  private async doFetchFromBackend(url: string, body?: any, options?: FetchOptions): Promise<any> {
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

  public listChannels = this.getRequest<void, Channel[]>(listChannelsDef);

  public exploreFacebookChannels = this.getRequest<ExploreChannelRequestPayload, Channel[]>(exploreFacebookChannelsDef);

  public connectFacebookChannel = this.getRequest<ConnectChannelFacebookRequestPayload, Channel>(
    connectFacebookChannelDef
  );

  public connectChatPluginChannel = this.getRequest<ConnectChatPluginRequestPayload, Channel>(
    connectChatPluginChannelDef
  );

  public connectTwilioSmsChannel = this.getRequest<ConnectTwilioSmsRequestPayload, Channel>(connectTwilioSmsChannelDef);

  public connectTwilioWhatsappChannel = this.getRequest<ConnectTwilioWhatsappRequestPayload, Channel>(
    connectTwilioWhatsappChannelDef
  );

  public updateChannel = this.getRequest<UpdateChannelRequestPayload, Channel>(updateChannelDef);

  public disconnectChannel = this.getRequest<DisconnectChannelRequestPayload>(disconnectChannelDef);

  public listConversations: ApiRequest<
    ListConversationsRequestPayload,
    PaginatedResponse<Conversation>
  > = this.getRequest(listConversationsDef);

  public getConversationInfo = this.getRequest<string, Conversation>(getConversationInfoDef);

  public readConversations = this.getRequest<string>(readConversationsDef);

  public listMessages = this.getRequest<ListMessagesRequestPayload, PaginatedResponse<Message>>(listMessagesDef);

  public listTags = this.getRequest<void, Tag[]>(listTagsDef);

  public createTag = this.getRequest<CreateTagRequestPayload, Tag>(createTagDef);

  public updateTag = this.getRequest<Tag>(updateTagDef);

  public deleteTag = this.getRequest<string>(deleteTagDef);

  public loginViaEmail = this.getRequest<LoginViaEmailRequestPayload, User>(loginViaEmailDef);

  public tagConversation = this.getRequest<TagConversationRequestPayload>(tagConversationDef);

  public untagConversation = this.getRequest<UntagConversationRequestPayload>(untagConversationDef);

  public sendMessages = this.getRequest<SendMessagesRequestPayload, Message>(sendMessagesDef);

  public getConfig = this.getRequest<void, Config>(getConfigDef);

  public listTemplates = this.getRequest<ListTemplatesRequestPayload, Template[]>(listTemplatesDef);

  private getRequest<K, V = void>({
    endpoint,
    mapRequest,
    mapResponse,
    opts,
  }: EndpointDefinition<K, V>): ApiRequest<K, V> {
    return async (requestPayload: K) => {
      endpoint = typeof endpoint === 'string' ? endpoint : endpoint(requestPayload);
      requestPayload = !!mapRequest ? mapRequest(requestPayload) : requestPayload;
      const response = await this.doFetchFromBackend(endpoint, requestPayload, opts);
      return !!mapResponse ? mapResponse(response) : response;
    };
  }
}
