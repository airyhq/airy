import {
  ExploreChannelRequestPayload,
  ConnectChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  ListTagsResponsePayload,
  CreateTagRequestPayload,
  LoginViaEmailRequestPayload,
  SendMessagesRequestPayload,
  TagConversationRequestPayload,
  UntagConversationRequestPayload,
  MessagePayload,
  TagPayload,
  ListMessagesRequestPayload,
  PaginatedPayload,
  ConversationPayload,
  ChannelPayload,
  ChannelsPayload,
  ConfigPayload,
} from './payload';
import {
  connectChannelMapper,
  channelMapper,
  channelsMapper,
  disconnectChannelApiMapper,
  conversationsMapper,
  messageMapperData,
  tagsMapper,
  userMapper,
  paginatedPayloadMapper,
  messageMapper,
  conversationMapper,
} from './mappers';
import {TagColor, Tag} from './model';

const headers = {
  Accept: 'application/json',
};

export function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

export class HttpClient {
  public readonly apiUrlConfig?: string;
  public token?: string;
  private unauthorizedErrorCallback?: (body: any) => void;

  constructor(token?: string, apiUrlConfig?: string, unauthorizedErrorCallback?: (body: any) => void) {
    this.token = token;
    this.apiUrlConfig = apiUrlConfig || 'http://api.airy';
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

  private async doFetchFromBackend(url: string, body?: Object): Promise<any> {
    if (this.token) {
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

  public async listChannels() {
    const response: ChannelsPayload = await this.doFetchFromBackend('channels.list', {});
    return channelsMapper(response);
  }

  public async exploreFacebookChannels(requestPayload: ExploreChannelRequestPayload) {
    const response: ChannelsPayload = await this.doFetchFromBackend('facebook.channels.explore', requestPayload);
    return channelsMapper(response);
  }

  public async connectChannel(source: string, requestPayload: ConnectChannelRequestPayload) {
    const response: ChannelPayload = await this.doFetchFromBackend(
      `channels.${source}.connect`,
      connectChannelMapper(requestPayload)
    );
    return channelMapper(response);
  }

  public async disconnectChannel(source: string, requestPayload: DisconnectChannelRequestPayload) {
    const response: ChannelsPayload = await this.doFetchFromBackend(
      `channels.${source}.disconnect`,
      disconnectChannelApiMapper(requestPayload)
    );
    return channelsMapper(response);
  }

  public async listConversations(conversationListRequest: ListConversationsRequestPayload) {
    conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;
    const response: PaginatedPayload<ConversationPayload> = await this.doFetchFromBackend(
      'conversations.list',
      conversationListRequest
    );
    const {pagination_data} = response;

    return paginatedPayloadMapper({data: conversationsMapper(response.data), pagination_data: pagination_data});
  }

  public async getConversationInfo(conversationId: string) {
    return this.doFetchFromBackend('conversations.info', {
      conversation_id: conversationId,
    }).then(conversationMapper);
  }

  public async readConversations(conversationId: string) {
    await this.doFetchFromBackend('conversations.read', {conversation_id: conversationId});
    return Promise.resolve(true);
  }

  public async listMessages(conversationListRequest: ListMessagesRequestPayload) {
    conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;

    const response: PaginatedPayload<MessagePayload> = await this.doFetchFromBackend('messages.list', {
      conversation_id: conversationListRequest.conversationId,
      cursor: conversationListRequest.cursor,
      page_size: conversationListRequest.pageSize,
    });
    const {pagination_data} = response;

    return paginatedPayloadMapper({data: messageMapperData(response), pagination_data: pagination_data});
  }

  public async listTags() {
    const response: ListTagsResponsePayload = await this.doFetchFromBackend('tags.list');
    return tagsMapper(response.data);
  }

  public async createTag(requestPayload: CreateTagRequestPayload) {
    const response: TagPayload = await this.doFetchFromBackend('tags.create', requestPayload);
    return {
      id: response.id,
      name: requestPayload.name,
      color: requestPayload.color as TagColor,
    };
  }

  public async updateTag(tag: Tag) {
    await this.doFetchFromBackend('tags.update', {...tag});
    return Promise.resolve(true);
  }

  public async deleteTag(id: string) {
    await this.doFetchFromBackend('tags.delete', {id});
    return Promise.resolve(true);
  }

  public async loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
    const response = await this.doFetchFromBackend('users.login', requestPayload);
    return userMapper(response);
  }

  public async tagConversation(requestPayload: TagConversationRequestPayload) {
    await this.doFetchFromBackend('conversations.tag', {
      conversation_id: requestPayload.conversationId,
      tag_id: requestPayload.tagId,
    });
    return Promise.resolve(true);
  }

  public async untagConversation(requestPayload: UntagConversationRequestPayload) {
    await this.doFetchFromBackend('conversations.untag', {
      conversation_id: requestPayload.conversationId,
      tag_id: requestPayload.tagId,
    });
    return Promise.resolve(true);
  }

  public async sendMessages(requestPayload: SendMessagesRequestPayload) {
    const response: MessagePayload = await this.doFetchFromBackend('messages.send', {
      conversation_id: requestPayload.conversationId,
      message: requestPayload.message,
    });
    return messageMapper(response);
  }

  public async getConfig() {
    const response: ConfigPayload = await this.doFetchFromBackend('client.config');
    return response;
  }
}

export * from './mappers';
export * from './model';
export * from './payload';
export * from './messagesForChannels';
