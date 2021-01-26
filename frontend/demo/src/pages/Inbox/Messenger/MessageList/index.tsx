import React, {useEffect, createRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';

import {Conversation, Message, SenderType} from 'httpclient';

import {StateModel} from '../../../../reducers';
import {MessageById} from '../../../../reducers/data/messages';

import MessageListItem from '../MessengerListItem';

import {listMessages} from '../../../../actions/messages';

import styles from './index.module.scss';
import {formatDateOfMessage} from '../../../../services/format/date';

type MessageListProps = {conversation: Conversation} & ConnectedProps<typeof connector>;

const messagesMapToArray = (
  messageInfo: {[conversationId: string]: MessageById},
  conversationId: string
): Message[] => {
  const messageById = messageInfo[conversationId];
  if (messageById) {
    return Object.keys(messageById).map((cId: string) => ({...messageById[cId]}));
  }
  return [];
};

const mapStateToProps = (state: StateModel, ownProps: {conversation: Conversation}) => {
  return {
    messages: messagesMapToArray(state.data.messages.all, ownProps.conversation && ownProps.conversation.id),
  };
};

const mapDispatchToProps = {
  listMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessageList = (props: MessageListProps) => {
  const {listMessages, messages, conversation} = props;
  const messageListRef = createRef<HTMLDivElement>();

  useEffect(() => {
    conversation && listMessages(conversation.id);
    scrollBottom();
  }, [conversation && conversation.id]);

  const scrollBottom = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  const isContact = (message: Message) => message.senderType !== SenderType.appUser;

  const hasDateChanged = (prevMessage: Message, message: Message) => {
    if (prevMessage == null) {
      return true;
    }

    return !isSameDay(prevMessage.sentAt, message.sentAt);
  };

  const isSameDay = (firstDate: Date, secondDate: Date) => {
    return new Date(firstDate).setHours(0, 0, 0, 0) === new Date(secondDate).setHours(0, 0, 0, 0);
  };

  return (
    <div className={styles.messageList} ref={messageListRef}>
      {messages.map((message: Message, index: number) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];
        const prevWasContact = prevMessage ? isContact(prevMessage) : false;
        const nextIsSameUser = nextMessage ? isContact(message) == isContact(nextMessage) : false;

        return (
          <div key={message.id}>
            {hasDateChanged(prevMessage, message) && (
              <div key={`date-${message.id}`} className={styles.dateHeader}>
                {formatDateOfMessage(message)}
              </div>
            )}
            <MessageListItem
              conversation={conversation}
              message={message}
              showAvatar={!prevWasContact && isContact(message)}
              showSentAt={!nextIsSameUser}
            />
          </div>
        );
      })}
    </div>
  );
};

export default connector(MessageList);
