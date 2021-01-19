import {ConversationStateEnum} from '../model/ConversationFilter';

export interface ConversationFilter {
  fb_page_ids?: Array<String>;
  contact_tag_ids?: Array<String>;
  state?: ConversationStateEnum;
  min_unread_message_count?: number;
  display_name?: string;
}
