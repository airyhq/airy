import {ConversationPayload} from './ConversationPayload';
import {ResponseMetadata} from './ResponseMetadata';

export interface ListConversationsResponsePayload {
  data: ConversationPayload[];
  response_metadata: ResponseMetadata;
}
