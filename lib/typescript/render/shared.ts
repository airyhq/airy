import {isFromContact, Message, Contact} from 'httpclient';
import {formatTime} from 'dates';
import {DefaultMessageRenderingProps} from './components';

export interface MessageRenderProps {
  message: Message;
  source: string;
  contact?: Contact;
  lastInGroup: boolean;
}

export const getDefaultMessageRenderingProps = (props: MessageRenderProps): DefaultMessageRenderingProps => {
  const fromContact = isFromContact(props.message);
  return {
    fromContact,
    contact: props.contact,
    sentAt: props.lastInGroup ? formatTime(props.message.sentAt) : null,
  };
};
