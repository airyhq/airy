import React, {useEffect, useState, createRef} from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';

import {Message, SenderType} from 'httpclient';
import RenderLibrary from 'renderLibrary';

import {StateModel} from '../../../../reducers';
import {MessageById} from '../../../../reducers/data/messages';

import {listMessages} from '../../../../actions/messages';
import {allConversationSelector} from '../../../../selectors/conversations';

import styles from './index.module.scss';
import {formatDateOfMessage} from '../../../../services/format/date';

type MessageListProps = {conversationId: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<{conversationId: string}>;

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

const mapStateToProps = (state: StateModel, ownProps: {conversationId: string}) => {
  return {
    conversations: allConversationSelector(state),
    messages: messagesMapToArray(state.data.messages.all, ownProps.conversationId),
  };
};

const mapDispatchToProps = {
  listMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessageList = (props: MessageListProps) => {
  const {conversations, listMessages, messages} = props;
  const conversationIdParams = useParams();
  const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentSource, setCurrentSource] = useState('');

  const messageListRef = createRef<HTMLDivElement>();

  useEffect(() => {
    currentConversationId && listMessages(currentConversationId);
    scrollBottom();
  }, [currentConversationId]);

  useEffect(() => {
    setCurrentConversation(conversations.find(item => item && item.id === currentConversationId));
    currentConversation && setCurrentSource(currentConversation.channel.source)
  }, [currentConversationId, conversations]);

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
          <>
            {hasDateChanged(prevMessage, message) && (
              <div className={styles.dateHeader}>{formatDateOfMessage(message)}</div>
            )}
            <RenderLibrary
              message={message}
              source={currentSource}
              currentConversation={currentConversation}
              prevWasContact={prevWasContact}
              nextIsSameUser={nextIsSameUser}
              isContact={isContact(message)}
            />
          </>
        );
      })}
    </div>
  );
};

export default connector(MessageList);
