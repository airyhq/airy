import {Message, Conversation, isFromContact} from 'httpclient';
import {formatTime} from 'dates';

export interface MessageRenderProps  {
    message: Message;
    conversation: Conversation;
    prevWasContact: boolean;
    nextIsSameUser: boolean;
}

export interface SharedComponentProps  {
    fromContact: boolean;
    conversation: Conversation;
    showAvatar: boolean;
    sentAt?: string;
}

export const getSharedComponentProps = (props: MessageRenderProps): SharedComponentProps => {
    const fromContact = isFromContact(props.message);
    return {
        fromContact,
        conversation: props.conversation,
        showAvatar: !props.prevWasContact && isFromContact(props.message),
        sentAt: props.nextIsSameUser ? null : formatTime(props.message.sentAt)
    }
}
