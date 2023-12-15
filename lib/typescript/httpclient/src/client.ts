import {Tag, Message, Channel, Conversation, Config, Template, Contact, Components, Webhook, Stream} from 'model';
import {
  ExploreChannelRequestPayload,
  ConnectChannelFacebookRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  CreateTagRequestPayload,
  SendMessagesRequestPayload,
  TagConversationRequestPayload,
  UntagConversationRequestPayload,
  ListMessagesRequestPayload,
  ConnectChatPluginRequestPayload,
  ConnectTwilioSmsRequestPayload,
  ConnectTwilioWhatsappRequestPayload,
  ConnectWhatsappRequestPayload,
  ConnectChannelGoogleRequestPayload,
  UpdateChannelRequestPayload,
  ListTemplatesRequestPayload,
  PaginatedResponse,
  MetadataUpsertRequestPayload,
  SetStateConversationRequestPayload,
  UpdateConversationContactInfoRequestPayload,
  ConnectChannelInstagramRequestPayload,
  UploadFileRequestPayload,
  ResendMessageRequestPayload,
  GetContactDetailsRequestPayload,
  UpdateContactDetailsRequestPayload,
  UnsubscribeWebhookRequestPayload,
  SubscribeWebhookRequestPayload,
  UpdateWebhookRequestPayload,
  ListContactsRequestPayload,
  EnableDisableComponentRequestPayload,
  UpdateComponentConfigurationRequestPayload,
  InstallUninstallComponentRequestPayload,
  ConnectViberRequestPayload,
  CreateTopicPayload,
  GetStreamInfoPayload,
  DeleteStreamPayload,
  CreateStreamPayload,
  LLMConsumersListPayload,
  LLMInfoPayload,
  LLMSStatsPayload,
  LLMConsumersCreateRequestPayload,
  LLMConsumersCreateResponsePayload,
  LLMConsumersDeletePayload,
  LLMQueryRequestPayload,
  LLMQueryResponsePayload,
} from './payload';
import {
  listChannelsDef,
  listConversationsDef,
  exploreFacebookChannelsDef,
  connectFacebookChannelDef,
  connectInstagramChannelDef,
  connectChatPluginChannelDef,
  connectTwilioSmsChannelDef,
  connectTwilioWhatsappChannelDef,
  connectWhatsappChannelDef,
  connectGoogleChannelDef,
  updateChannelDef,
  disconnectChannelDef,
  getConversationInfoDef,
  readConversationsDef,
  listMessagesDef,
  listTagsDef,
  createTagDef,
  updateTagDef,
  deleteTagDef,
  tagConversationDef,
  untagConversationDef,
  sendMessagesDef,
  getConfigDef,
  listTemplatesDef,
  listWebhooksDef,
  metadataUpsertDef,
  setStateConversationDef,
  updateConversationContactInfoDef,
  uploadFileDef,
  resendMessageDef,
  getContactDetailsDef,
  updateContactDetailsDef,
  unsubscribeWebhookDef,
  subscribeWebhookDef,
  updateWebhookDef,
  listContactsDef,
  deleteContactDef,
  enableDisableComponentDef,
  updateComponentConfigurationDef,
  getComponentsDef,
  installComponentDef,
  uninstallComponentDef,
  componentsListDef,
  connectViberChannelDef,
  createTopicDef,
  getStreamsDef,
  getStreamInfoDef,
  deleteStreamDef,
  createStreamDef,
  llmConsumersListDef,
  llmInfoDef,
  llmStatsDef,
  llmConsumersCreateDef,
  llmConsumersDeleteDef,
  llmQueryDef,
} from './endpoints';
import 'isomorphic-fetch';
import FormData from 'form-data';

function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

interface ApiRequest<T, K = void> {
  (requestPayload: T): Promise<K>;
}

interface EndpointDefinition<T, K = void> {
  endpoint: string | ((requestPayload: T) => string);
  mapRequest?: (requestPayload: T) => any;
  mapResponse?: (any) => K;
}

export class HttpClient {
  public readonly apiUrl?: string;
  public readonly loginUrl?: string;
  private readonly unauthorizedErrorCallback?: (body: any, loginUrl: string) => void;

  constructor(apiUrl: string, unauthorizedErrorCallback?: (body: any, loginUrl: string) => void) {
    this.apiUrl = apiUrl;
    this.loginUrl = `${apiUrl}/login`;
    this.unauthorizedErrorCallback = unauthorizedErrorCallback;
  }

  private async doFetchFromBackend(url: string, body?: any): Promise<any> {
    const headers = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (!(body instanceof FormData)) {
      if (!isString(body)) {
        body = JSON.stringify(body);
      }
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.apiUrl}/${url}`, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      credentials: 'include',
      body: body,
    });

    return this.parseBody(response);
  }

  private async doFetchFromBackendForKafkaTopics(url: string, body?: any): Promise<any> {
    const headers = {};

    if (!(body instanceof FormData)) {
      if (!isString(body)) {
        body = JSON.stringify(body);
      }
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.apiUrl}/${url}`, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      credentials: 'include',
      body: body,
    });

    return this.parseBody(response);
  }

  private async parseBody(response: Response): Promise<any> {
    if (this.isAuthRedirect(response)) {
      const err = new Error('Unauthorized');
      this.onAuthError(err);
      return Promise.reject(err);
    }

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
      try {
        errorResult = JSON.parse(body) as any;
      } catch (e) {
        errorResult = body;
      }
    }

    if (response.status === 403) {
      this.onAuthError(errorResult);
    }

    throw {
      status: response.status,
      body: errorResult,
    };
  }

  private isAuthRedirect(response: Response): boolean {
    return response.redirected === true && response.url === this.loginUrl;
  }

  private onAuthError(err) {
    if (this.unauthorizedErrorCallback) {
      this.unauthorizedErrorCallback(err, this.loginUrl);
    }
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

  public connectWhatsappChannel = this.getRequest<ConnectWhatsappRequestPayload, Channel>(connectWhatsappChannelDef);

  public connectViberChannel = this.getRequest<ConnectViberRequestPayload, Channel>(connectViberChannelDef);

  public connectGoogleChannel = this.getRequest<ConnectChannelGoogleRequestPayload, Channel>(connectGoogleChannelDef);

  public connectInstagramChannel = this.getRequest<ConnectChannelInstagramRequestPayload, Channel>(
    connectInstagramChannelDef
  );

  public updateChannel = this.getRequest<UpdateChannelRequestPayload, Channel>(updateChannelDef);

  public disconnectChannel = this.getRequest<DisconnectChannelRequestPayload>(disconnectChannelDef);

  public listConversations: ApiRequest<ListConversationsRequestPayload, PaginatedResponse<Conversation>> =
    this.getRequest(listConversationsDef);

  public getConversationInfo = this.getRequest<string, Conversation>(getConversationInfoDef);

  public readConversations = this.getRequest<string>(readConversationsDef);

  public listMessages = this.getRequest<ListMessagesRequestPayload, PaginatedResponse<Message>>(listMessagesDef);

  public resendMessage = this.getRequest<ResendMessageRequestPayload>(resendMessageDef);

  public listTags = this.getRequest<void, Tag[]>(listTagsDef);

  public createTag = this.getRequest<CreateTagRequestPayload, Tag>(createTagDef);

  public updateTag = this.getRequest<Tag>(updateTagDef);

  public deleteTag = this.getRequest<string>(deleteTagDef);

  public tagConversation = this.getRequest<TagConversationRequestPayload>(tagConversationDef);

  public untagConversation = this.getRequest<UntagConversationRequestPayload>(untagConversationDef);

  public sendMessages = this.getRequest<SendMessagesRequestPayload, Message>(sendMessagesDef);

  public getConfig = this.getRequest<void, Config>(getConfigDef);

  public listTemplates = this.getRequest<ListTemplatesRequestPayload, Template[]>(listTemplatesDef);

  public metadataUpsert = this.getRequest<MetadataUpsertRequestPayload>(metadataUpsertDef);

  public setStateConversation = this.getRequest<SetStateConversationRequestPayload>(setStateConversationDef);

  public updateConversationContactInfo = this.getRequest<UpdateConversationContactInfoRequestPayload>(
    updateConversationContactInfoDef
  );

  public uploadFile = this.getRequest<UploadFileRequestPayload>(uploadFileDef);

  public getContactDetails = this.getRequest<GetContactDetailsRequestPayload, Contact>(getContactDetailsDef);

  public updateContactDetails = this.getRequest<UpdateContactDetailsRequestPayload>(updateContactDetailsDef);

  public listWebhooks = this.getRequest<void, Webhook[]>(listWebhooksDef);

  public subscribeWebhook = this.getRequest<SubscribeWebhookRequestPayload, Webhook>(subscribeWebhookDef);

  public unsubscribeWebhook = this.getRequest<UnsubscribeWebhookRequestPayload, Webhook>(unsubscribeWebhookDef);

  public updateWebhook = this.getRequest<UpdateWebhookRequestPayload, Webhook>(updateWebhookDef);

  public listContacts = this.getRequest<ListContactsRequestPayload, PaginatedResponse<Contact>>(listContactsDef);

  public deleteContact = this.getRequest<string>(deleteContactDef);

  public enableDisableComponent = this.getRequest<EnableDisableComponentRequestPayload>(enableDisableComponentDef);

  public getComponents = this.getRequest<void, Components>(getComponentsDef);

  public updateComponentConfiguration = this.getRequest<UpdateComponentConfigurationRequestPayload>(
    updateComponentConfigurationDef
  );

  public installComponent = this.getRequest<InstallUninstallComponentRequestPayload>(installComponentDef);

  public uninstallComponent = this.getRequest<InstallUninstallComponentRequestPayload>(uninstallComponentDef);

  public listComponents = this.getRequest<void, Components>(componentsListDef);

  public createTopic = this.getRequestForKafkaTopicsEndpoints<CreateTopicPayload>(createTopicDef);

  public getStreams = this.getRequest<void, Stream[]>(getStreamsDef);

  public getStreamInfo = this.getRequest<GetStreamInfoPayload>(getStreamInfoDef);

  public deleteStream = this.getRequest<DeleteStreamPayload>(deleteStreamDef);

  public createStream = this.getRequest<CreateStreamPayload>(createStreamDef);

  public getLLMInfo = this.getRequest<void, LLMInfoPayload>(llmInfoDef);

  public getLLMStats = this.getRequest<void, LLMSStatsPayload>(llmStatsDef);

  public listLLMConsumers = this.getRequest<void, LLMConsumersListPayload>(llmConsumersListDef);

  public deleteLLMConsumer = this.getRequest<LLMConsumersDeletePayload>(llmConsumersDeleteDef);

  public createLLMConsumer = this.getRequest<LLMConsumersCreateRequestPayload, LLMConsumersCreateResponsePayload>(
    llmConsumersCreateDef
  );

  public llmQuery = this.getRequest<LLMQueryRequestPayload, LLMQueryResponsePayload>(llmQueryDef);

  private getRequest<K, V = void>({endpoint, mapRequest, mapResponse}: EndpointDefinition<K, V>): ApiRequest<K, V> {
    return async (requestPayload: K) => {
      endpoint = typeof endpoint === 'string' ? endpoint : endpoint(requestPayload);
      requestPayload = mapRequest ? mapRequest(requestPayload) : requestPayload;
      const response = await this.doFetchFromBackend(endpoint, requestPayload);
      return mapResponse ? mapResponse(response) : response;
    };
  }

  private getRequestForKafkaTopicsEndpoints<K, V = void>({
    endpoint,
    mapRequest,
    mapResponse,
  }: EndpointDefinition<K, V>): ApiRequest<K, V> {
    return async (requestPayload: K) => {
      endpoint = typeof endpoint === 'string' ? endpoint : endpoint(requestPayload);
      requestPayload = mapRequest ? mapRequest(requestPayload) : requestPayload;
      const response = await this.doFetchFromBackendForKafkaTopics(
        endpoint + `/${requestPayload['topicName']}`,
        requestPayload['payload']
      );
      return mapResponse ? mapResponse(response) : response;
    };
  }
}
