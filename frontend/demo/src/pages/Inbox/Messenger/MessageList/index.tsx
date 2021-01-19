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

  const [loadedMessages, setLoadedMessages] = useState(null);
  const [lastLoadedMessageId, setLastLoadedMessageId] = useState('');
  const prevLoadedMessages = usePrevious(loadedMessages);
  const prevMessages = usePrevious(messages);
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
    if (currentConversationId) {
      if (messages.length > 10) {
        const latestMessages = messages.slice(-10);
        setLastLoadedMessageId(latestMessages[0].id);
        setLoadedMessages(latestMessages);
      } else {
        setLoadedMessages(messages);
      }
    }
  }, [currentConversationId, messages]);

  useEffect(() => {
    if (prevMessages && messages.length > prevMessages.length) {
      debouncedLoadPreviousMessages();
    }
  }, [messages, loadedMessages, lastLoadedMessageId]);

  useEffect(() => {
    if (loadedMessages && prevLoadedMessages !== null && prevLoadedMessages.length < loadedMessages.length) {
      if (prevCurrentConversationId === currentConversationId && prevLoadedMessages[0].id !== loadedMessages[0].id) {
        scrollToMessage(prevLoadedMessages[0].id);
      } else {
        scrollBottom();
      }
    }
  }, [loadedMessages, currentConversationId]);

  useEffect(() => {
    if (!scrollbarVisible()) {
      if (
        hasPreviousMessages() &&
        loadedMessages &&
        loadedMessages.length === messages.length &&
        !isLoadingConversation()
      ) {
        debouncedListPreviousMessages();
      } else if (loadedMessages && loadedMessages.length < messages.length && !isLoadingConversation()) {
        debouncedLoadPreviousMessages();
      }
    }
  }, [props.item, loadedMessages, messages, lastLoadedMessageId]);

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

  const loadPreviousMessages = () => {
    if (loadedMessages && lastLoadedMessageId) {
      const findLastLoadedMessageIdx = message => message.id === lastLoadedMessageId;
      const lastLoadedMessageIdx = messages.findIndex(findLastLoadedMessageIdx);
      let previousMessages;

      if (messages[lastLoadedMessageIdx - 10]) {
        previousMessages = messages.slice(lastLoadedMessageIdx - 10, lastLoadedMessageIdx);
        setLastLoadedMessageId(previousMessages[0].id);
      } else {
        previousMessages = messages.slice(0, lastLoadedMessageIdx);
        setLastLoadedMessageId(previousMessages[0].id);
      }

      setLoadedMessages([...previousMessages, ...loadedMessages]);
    }
  };

  const debouncedLoadPreviousMessages = debounce(() => {
    loadPreviousMessages();
  }, 200);

  const debouncedListPreviousMessages = debounce(() => {
    listPreviousMessages(currentConversationId);
  }, 200);

  const handleScroll = debounce(
    () => {
      if (messageListRef) {
        if (
          hasPreviousMessages() &&
          loadedMessages.length === messages.length &&
          !isLoadingConversation() &&
          messageListRef.current.scrollTop === 0
        ) {
          debouncedListPreviousMessages();
        } else if (
          loadedMessages.length < messages.length &&
          !isLoadingConversation() &&
          messageListRef.current.scrollTop === 0
        ) {
          debouncedLoadPreviousMessages();
        }

        const entireHeightScrolled =
          messageListRef.current.scrollHeight - 1 <=
          messageListRef.current.clientHeight + messageListRef.current.scrollTop;

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
      {loadedMessages &&
        loadedMessages.map((message: Message, index: number) => {
          const prevMessage = loadedMessages[index - 1];
          const nextMessage = loadedMessages[index + 1];
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
