import {Conversation} from 'httpclient';

export interface DefaultMessageRenderingProps {
  fromContact: boolean;
  conversation: Conversation;
  showAvatar: boolean;
  sentAt?: string;
}
