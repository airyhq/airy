import {ConversationPayload} from './ConversationPayload';
import {ResponseMetadataPayload} from './ResponseMetadataPayload';

export interface ListConversationsResponsePayload {
  data: ConversationPayload[];
  response_metadata: ResponseMetadataPayload;
}
