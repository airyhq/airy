import {isFromContact, Message, Contact} from 'httpclient';
import {formatTime} from 'dates';
import {DefaultMessageRenderingProps} from './components';

export interface Command {
  type: string;
}

export interface SuggestedReplyCommand extends Command {
  type: 'suggestedReply';
  payload: {
    text: string;
    postbackData: string;
  };
}

export type CommandUnion = SuggestedReplyCommand;

export interface MessageRenderProps {
  message: Message;
  source: string;
  contact?: Contact;
  lastInGroup: boolean;
  invertSides?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}

export const getDefaultMessageRenderingProps = (props: MessageRenderProps): DefaultMessageRenderingProps => {
  const fromContact = isFromContact(props.message);
  return {
    fromContact,
    contact: props.contact,
    commandCallback: props.commandCallback,
    sentAt: props.lastInGroup ? formatTime(props.message.sentAt) : null,
  };
};
