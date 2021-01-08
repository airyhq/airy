import React, {useEffect, useRef} from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {StateModel} from '../../../../reducers';
import styles from './index.module.scss';
import MessageListItem from '../MessengerListItem';
import {Message} from '../../../../model/Message';
import {fetchMessages} from '../../../../actions/messages';
import {allConversationSelector} from '../../../../selectors/conversations';
import {MessageMap} from '../../../../reducers/data/messages';
import { createRef } from 'react';

type MessageListProps = {conversationId: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<{conversationId: string}>;

const messagesMapToArray = (messageInfo: {[conversationId: string]: MessageMap}, conversationId: string): Message[] => {
  const messageMap = messageInfo[conversationId];
  if (messageMap) {
    return Object.keys(messageMap).map((cId: string) => ({...messageMap[cId]}));
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
  fetchMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessageList = (props: MessageListProps) => {
  const {fetchMessages, messages} = props;
  const conversationIdParams = useParams();
  const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];

  const messageListRef = createRef<HTMLDivElement>();


  useEffect(() => {
    currentConversationId && fetchMessages(currentConversationId);
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
