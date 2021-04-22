export interface ConversationFilter {
  readOnly?: boolean;
  unreadOnly?: boolean;
  displayName?: string;
  createdAt?: string;
  byTags?: string[];
  byChannels?: string[];
  bySources?: string[];
  isStateOpen?: boolean;
}
