import {ConversationPayload} from './ConversationPayload';
import {ResponseMetadata} from './ResponseMetadata';

export interface FetchConversationsResponse {
  data: ConversationPayload[];
  response_metadata: ResponseMetadata;
}
