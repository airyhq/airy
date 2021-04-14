export interface ConversationFilter {
  readOnly?: boolean;
  unreadOnly?: boolean;
  displayName?: string;
  createdAt?: string;
  byTags?: Array<string>;
  byChannels?: Array<string>;
  bySources?: Array<string>;
}
