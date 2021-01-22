import React, {useEffect, useState, createRef, useRef} from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {debounce} from 'lodash-es';

import {Message, SenderType} from 'httpclient';

import {StateModel} from '../../../../reducers';
import {MessageById} from '../../../../reducers/data/messages';

import MessageListItem from '../MessengerListItem';

import {listMessages, listPreviousMessages} from '../../../../actions/messages';
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
    item: state.data.conversations.all.items[ownProps.conversationId],
  };
};

const mapDispatchToProps = {
  listMessages,
  listPreviousMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MessageList = (props: MessageListProps) => {
  const {conversations, listMessages, messages} = props;

  const conversationIdParams = useParams();
  const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];
  const [currentConversation, setCurrentConversation] = useState(null);
  const [stickBottom, setStickBottom] = useState(true);

  const prevMessages = usePrevious(messages);
  //const prevLastLoadedMessageId = usePrevious(lastLoadedMessageId);
  const prevCurrentConversationId = usePrevious(currentConversationId);


  const messageListRef = createRef<HTMLDivElement>();
 
  useEffect(() => {
    currentConversationId && listMessages(currentConversationId);
    scrollBottom();
  }, [currentConversationId]);

  useEffect(() => {
    setCurrentConversation(conversations.find(item => item && item.id === currentConversationId));
  }, [currentConversationId, conversations]);

  useEffect(() => {
    if (stickBottom) {
      scrollBottom();
    }
  }, [stickBottom]);


  useEffect(() => {
    if (!scrollbarVisible() && !isLoadingConversation() && messages && messages.length > 0) {
      handleScroll()
    }
  }, [props.item, messages]);


  useEffect(() => {
    if (prevMessages && messages && prevMessages.length < messages.length) {
  
      if (
        prevCurrentConversationId === currentConversationId &&
        prevMessages[0] &&
        prevMessages[0].id !== messages[0].id
      ) {
        scrollToMessage(prevMessages[0].id);
      } else {
        scrollBottom();
      }
    }
  }, [messages, currentConversationId]);


  const scrollBottom = () => {
    if(messageListRef){
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
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

  const isLoadingConversation = () => {
    return props.item && props.item.metadata && props.item.metadata.loading;
  };

  const hasPreviousMessages = () => {
    return !!(props.item && props.item.metadata && props.item.metadata.nextCursor);
  };

  const scrollbarVisible = () => {
    return messageListRef.current.scrollHeight > messageListRef.current.clientHeight;
  };

  const scrollToMessage = id => {
    const element = document.querySelector<HTMLElement>(`#message-item-${id}`);

    if (element && messageListRef) {
      messageListRef.current.scrollTop = element.offsetTop - messageListRef.current.offsetTop;
    }
  };

  const debouncedListPreviousMessages = debounce((currentConversationId) => {
    listPreviousMessages(currentConversationId);
  }, 200);


  const handleScroll = debounce(
    () => {
      if (messageListRef) {

        if (hasPreviousMessages() && messageListRef.current.scrollTop === 0 && !isLoadingConversation()) {
          debouncedListPreviousMessages(currentConversationId);
        }

        const entireHeightScrolled =
        messageListRef.current.scrollHeight - 1 <= messageListRef.current.clientHeight + messageListRef.current.scrollTop;

        if (stickBottom !== entireHeightScrolled) {
          setStickBottom(entireHeightScrolled);
        }
      }
    },
    100,
    {leading: true}
  );


   return (
    <div className={styles.messageList} ref={messageListRef} onScroll={handleScroll}>
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
              <MessageListItem
                key={message.id}
                conversation={currentConversation}
                message={message}
                showAvatar={!prevWasContact && isContact(message)}
                showSentAt={!nextIsSameUser}
              />
            </>
          );
        })}
    </div>
  );
};

export default connector(MessageList);
