import React, {useEffect, createRef} from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';

import {Message} from 'httpclient';

import {StateModel} from '../../../../reducers';
import {MessageById} from '../../../../reducers/data/messages';

import MessageListItem from '../MessengerListItem';

import {listMessages} from '../../../../actions/messages';
import {allConversationSelector} from '../../../../selectors/conversations';

import styles from './index.module.scss';

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
  const {listMessages, messages} = props;
  const conversationIdParams = useParams();
  const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];

  const messageListRef = createRef<HTMLDivElement>();

  useEffect(() => {
    currentConversationId && listMessages(currentConversationId);
    scrollBottom();
  }, [currentConversationId]);

  const scrollBottom = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  return (
    <div className={styles.messageList} ref={messageListRef}>
      {messages.map((message: Message) => {
        return (
          <MessageListItem
            key={message.id}
            messageText={message.content[0].text}
            messageSenderType={message.senderType}
            messageDate={message.sentAt}
            message={message}
          />
        );
      })}
    </div>
  );
};

export default connector(MessageList);
