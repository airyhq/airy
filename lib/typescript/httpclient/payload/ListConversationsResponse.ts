import {ConversationPayload} from './ConversationPayload';
import {ResponseMetadata} from './ResponseMetadata';

export interface ListConversationsResponse {
  data: ConversationPayload[];
  response_metadata: ResponseMetadata;
}
