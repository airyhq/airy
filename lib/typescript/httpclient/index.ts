import {ChannelsPayload} from './payload/ChannelsPayload';
import {channelsMapper} from './mappers/channelsMapper';
import {
  ExploreChannelRequestPayload,
  ConnectChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ListConversationsRequestPayload,
  ListTagsResponsePayload,
  CreateTagRequestPayload,
  LoginViaEmailRequestPayload,
} from './payload';
import {SendMessagesRequestPayload} from './payload/SendMessagesRequestPayload';
import {ChannelApiPayload} from './payload/ChannelApiPayload';
import {connectChannelApiMapper} from './mappers/connectChannelApiMapper';
import {channelMapper} from './mappers/channelMapper';
import {disconnectChannelApiMapper} from './mappers/disconnectChannelApiMapper';
import {ConversationPayload} from './payload/ConversationPayload';
import {PaginatedPayload} from './payload/PaginatedPayload';
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

export async function parseBody(response: Response): Promise<any> {
  if (response.ok) {
    try {
      return await response.json();
    } catch {
      // NOP
    }
  }

  let body = await response.text();

  if (body.length > 0) {
    body = JSON.parse(body);
  }

  const errorResponse = {
    status: response.status,
    body: body,
  };

  throw errorResponse;
}

export function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

export class HttpClient {
  public readonly token?: string;
  public readonly apiUrlConfig?: string;

  constructor(token?: string, apiUrlConfig?: string) {
    this.token = token;
    this.apiUrlConfig = apiUrlConfig || 'http://api.airy';
  }

  private async doFetchFromBackend(url: string, body?: Object): Promise<any> {
    if (this.token) {
      headers['Authorization'] = this.token;
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

    return parseBody(response);
  }

  public async listChannels() {
    try {
      const response: ChannelsPayload = await this.doFetchFromBackend('channels.list');
      return channelsMapper(response);
    } catch (error) {
      return error;
    }
  }

  public async exploreChannels(requestPayload: ExploreChannelRequestPayload) {
    try {
      const response: ChannelsPayload = await this.doFetchFromBackend('channels.explore', requestPayload);
      return channelsMapper(response, requestPayload.source);
    } catch (error) {
      return error;
    }
  }

  public async connectChannel(requestPayload: ConnectChannelRequestPayload) {
    try {
      const response: ChannelApiPayload = await this.doFetchFromBackend(
        'channels.connect',
        connectChannelApiMapper(requestPayload)
      );
      return channelMapper(response);
    } catch (error) {
      return error;
    }
  }

  public async disconnectChannel(requestPayload: DisconnectChannelRequestPayload) {
    try {
      const response: ChannelsPayload = await this.doFetchFromBackend(
        'channels.disconnect',
        disconnectChannelApiMapper(requestPayload)
      );
      return channelsMapper(response);
    } catch (error) {
      return error;
    }
  }

  public async listConversations(conversationListRequest: ListConversationsRequestPayload) {
    conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;
    try {
      const response: PaginatedPayload<ConversationPayload> = await this.doFetchFromBackend(
        'conversations.list',
        conversationListRequest
      );
      const {response_metadata} = response;
      return {data: conversationsMapper(response.data), metadata: response_metadata};
    } catch (error) {
      return error;
    }
  }

  public async getConversationInfo(conversationId: string) {
    const conversation: ConversationPayload = await this.doFetchFromBackend('conversations.info', {
      conversation_id: conversationId,
    });
    return Promise.resolve(conversationMapper(conversation));
  }

  public async readConversations(conversationId: string) {
    await this.doFetchFromBackend('conversations.read', {conversation_id: conversationId});
    return Promise.resolve(true);
  }

  public async listMessages(conversationListRequest: ListMessagesRequestPayload) {
    conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
    conversationListRequest.cursor = conversationListRequest.cursor ?? null;

    try {
      const response: PaginatedPayload<MessagePayload> = await this.doFetchFromBackend('messages.list', {
        conversation_id: conversationListRequest.conversationId,
        cursor: conversationListRequest.cursor,
        page_size: conversationListRequest.pageSize,
      });
      const {response_metadata} = response;
      return {data: messageMapperData(response), metadata: response_metadata};
    } catch (error) {
      return error;
    }
  }

  public async listTags() {
    try {
      const response: ListTagsResponsePayload = await this.doFetchFromBackend('tags.list');
      return tagsMapper(response.data);
    } catch (error) {
      return error;
    }
  }

  public async createTag(requestPayload: CreateTagRequestPayload) {
    try {
      const response: TagPayload = await this.doFetchFromBackend('tags.create', requestPayload);
      return {
        id: response.id,
        name: requestPayload.name,
        color: requestPayload.color as TagColor,
      };
    } catch (error) {
      return error;
    }
  }

  public async updateTag(tag: Tag) {
    try {
      await this.doFetchFromBackend('tags.update', {...tag});
      return Promise.resolve(true);
    } catch (error) {
      return error;
    }
  }

  public async deleteTag(id: string) {
    try {
      await this.doFetchFromBackend('tags.delete', {id});
      return Promise.resolve(true);
    } catch (error) {
      return error;
    }
  }

  public async loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
    try {
      const response = await this.doFetchFromBackend('users.login', requestPayload);
      return userMapper(response);
    } catch (error) {
      return error;
    }
  }

  public async tagConversation(requestPayload: TagConversationRequestPayload) {
    try {
      await this.doFetchFromBackend('conversations.tag', {
        conversation_id: requestPayload.conversationId,
        tag_id: requestPayload.tagId,
      });
      return Promise.resolve(true);
    } catch (error) {
      return error;
    }
  }

  public async untagConversation(requestPayload: UntagConversationRequestPayload) {
    try {
      await this.doFetchFromBackend('conversations.untag', {
        conversation_id: requestPayload.conversationId,
        tag_id: requestPayload.tagId,
      });
      return Promise.resolve(true);
    } catch (error) {
      return error;
    }
  }

  public async sendMessages(requestPayload: SendMessagesRequestPayload) {
    try {
      const response: MessagePayload = await this.doFetchFromBackend('messages.send', {
        conversation_id: requestPayload.conversationId,
        message: requestPayload.message,
      });
      return messageMapper(response);
    } catch (error) {
      return error;
    }
  }
}

export * from './model';
export * from './payload';
export * from './messagesForChannels';
