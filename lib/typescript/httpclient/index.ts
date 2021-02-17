import {ChannelsPayload} from './payload/ChannelsPayload';
import {channelsMapper} from './mappers/channelsMapper';
import {paginatedPayloadMapper} from './mappers/paginatedPayloadMapper';
import {
  ExploreChannelRequestPayload,
  ConnectChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  ListTagsResponsePayload,
  CreateTagRequestPayload,
  LoginViaEmailRequestPayload,
  SendMessagesRequestPayload,
} from './payload';
import {PaginatedPayload} from './payload/PaginatedPayload';
import {ChannelApiPayload} from './payload/ChannelApiPayload';
import {connectChannelApiMapper} from './mappers/connectChannelApiMapper';
import {channelMapper} from './mappers/channelMapper';
import {disconnectChannelApiMapper} from './mappers/disconnectChannelApiMapper';
import {ConversationPayload} from './payload/ConversationPayload';
import {conversationsMapper} from './mappers/conversationsMapper';
import {ListMessagesRequestPayload} from './payload/ListMessagesRequestPayload';
import {TagConversationRequestPayload} from './payload/TagConversationRequestPayload';
import {UntagConversationRequestPayload} from './payload/UntagConversationRequestPayload';
import {MessagePayload} from './payload/MessagePayload';
import {messageMapperData} from './mappers/messageMapperData';
import {tagsMapper} from './mappers/tagsMapper';
import {TagColor, Tag} from './model';
import {TagPayload} from './payload/TagPayload';
import {userMapper} from './mappers/userMapper';
import {messageMapper} from './mappers/messageMapper';
import {conversationMapper} from './mappers/conversationMapper';

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
      errorResult = JSON.parse(body);
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
    const response: ChannelsPayload = await this.doFetchFromBackend('channels.list');
    return channelsMapper(response);
  }

  public async exploreFacebookChannels(requestPayload: ExploreChannelRequestPayload) {
    const response: ChannelsPayload = await this.doFetchFromBackend('facebook.channels.explore', requestPayload);
    return channelsMapper(response);
  }

  public async connectFacebookChannel(requestPayload: ConnectChannelRequestPayload) {
    const response: ChannelApiPayload = await this.doFetchFromBackend(
      'channels.connect',
      connectChannelApiMapper(requestPayload)
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
}

export * from './mappers';
export * from './model';
export * from './payload';
export * from './messagesForChannels';
