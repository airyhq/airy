export interface ConversationFilter {
    readOnly?: boolean;   
    unreadOnly?: boolean;   
    displayName?: string;
    createdAt?: string;
    byTags?: Array<string>;
    byChannel?: Array<string>;
    bySource?: Array<string>
  }
  