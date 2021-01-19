export interface ConversationFilter {
  channelIds?: Array<String>;
  contactTagIds?: Array<String>;
  state?: ConversationStateEnum;
  minUnreadMessageCount?: number;
  maxUnreadMessageCount?: number;
  displayName?: string;
}

export enum ConversationStateEnum {
  open = 'OPEN',
  closed = 'CLOSED',
}
