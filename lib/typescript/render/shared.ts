import {Conversation, isFromContact, Message} from 'httpclient';
import {formatTime} from 'dates';
import {DefaultMessageRenderingProps} from './components';

export interface MessageRenderProps {
  message: Message;
  conversation: Conversation;
  prevWasContact: boolean;
  nextIsSameUser: boolean;
}

export const getDefaultMessageRenderingProps = (props: MessageRenderProps): DefaultMessageRenderingProps => {
  const fromContact = isFromContact(props.message);
  return {
    fromContact,
    conversation: props.conversation,
    showAvatar: !props.prevWasContact && isFromContact(props.message),
    sentAt: props.nextIsSameUser ? null : formatTime(props.message.sentAt),
  };
};
