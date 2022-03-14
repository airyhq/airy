import {Tag, Message, Channel, Conversation, Config, Template} from 'model';
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
  ConnectChannelGoogleRequestPayload,
  UpdateChannelRequestPayload,
  ListTemplatesRequestPayload,
  PaginatedResponse,
  MetadataUpsertRequestPayload,
  SetStateConversationRequestPayload,
  UpdateContactRequestPayload,
  ConnectChannelInstagramRequestPayload,
  UploadFileRequestPayload,
  ResendMessageRequestPayload,
  ListContactsRequestPayload,
  GetContactsInfoRequestPayload,
  UpdateContactInfoRequestPayload
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
  metadataUpsertDef,
  setStateConversationDef,
  updateContactDef,
  uploadFileDef,
<<<<<<< HEAD
  resendMessageDef,
=======
  listContactsDef,
<<<<<<< HEAD
  getContactsInfoDef
>>>>>>> 4bfaf200 (contacts wip)
=======
  getContactsInfoDef, 
  updateContactInfoDef
>>>>>>> 5c907529 (contacts wip)
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

  public updateContact = this.getRequest<UpdateContactRequestPayload>(updateContactDef);

  public uploadFile = this.getRequest<UploadFileRequestPayload>(uploadFileDef);

  public listContacts = this.getRequest<ListContactsRequestPayload>(listContactsDef);

  //rename getContactInfo
  public getContactsInfo = this.getRequest<GetContactsInfoRequestPayload>(getContactsInfoDef);

  public updateContactInfo = this.getRequest<UpdateContactInfoRequestPayload>(updateContactInfoDef);

  private getRequest<K, V = void>({endpoint, mapRequest, mapResponse}: EndpointDefinition<K, V>): ApiRequest<K, V> {
    return async (requestPayload: K) => {
      endpoint = typeof endpoint === 'string' ? endpoint : endpoint(requestPayload);
      requestPayload = mapRequest ? mapRequest(requestPayload) : requestPayload;
      const response = await this.doFetchFromBackend(endpoint, requestPayload);
      return mapResponse ? mapResponse(response) : response;
    };
  }
}
